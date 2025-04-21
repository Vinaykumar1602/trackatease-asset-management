
import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Notification } from '@/types/notification';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  
  // Fetch notifications from Supabase
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user?.id || !isAuthenticated) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }
      
      return data.map(notification => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        timestamp: new Date(notification.created_at),
        read: notification.read,
        type: notification.type as 'info' | 'warning' | 'error' | 'success'
      }));
    },
    enabled: !!user?.id && isAuthenticated
  });
  
  // Calculate unread count
  const unreadCount = notifications?.filter(notif => !notif.read).length ?? 0;
  
  // Add notification mutation
  const { mutate: addNotificationMutation } = useMutation({
    mutationFn: async (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      if (!user?.id || !isAuthenticated) return null;
      
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: notification.title,
          message: notification.message,
          type: notification.type
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error adding notification:', error);
        return null;
      }
      
      return {
        id: data.id,
        title: data.title,
        message: data.message,
        timestamp: new Date(data.created_at),
        read: data.read,
        type: data.type as 'info' | 'warning' | 'error' | 'success'
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    }
  });
  
  // Mark as read mutation
  const { mutate: markAsReadMutation } = useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id || !isAuthenticated) return;
      
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error marking notification as read:', error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    }
  });
  
  // Clear all mutation
  const { mutate: clearAllMutation } = useMutation({
    mutationFn: async () => {
      if (!user?.id || !isAuthenticated) return;
      
      // Only mark all as read instead of deleting them
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error clearing notifications:', error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    }
  });
  
  // Public methods
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    addNotificationMutation(notification);
  }, [addNotificationMutation]);
  
  const markAsRead = useCallback((id: string) => {
    markAsReadMutation(id);
  }, [markAsReadMutation]);
  
  const clearAll = useCallback(() => {
    clearAllMutation();
  }, [clearAllMutation]);

  return {
    notifications: notifications || [],
    unreadCount,
    addNotification,
    markAsRead,
    clearAll,
    isLoading
  };
};
