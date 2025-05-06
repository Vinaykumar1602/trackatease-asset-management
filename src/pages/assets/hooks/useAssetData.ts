import { useState, useEffect, useCallback } from "react";
import { Asset } from "../types";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export const useAssetData = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch assets from Supabase
  const fetchAssets = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('assets')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        const formattedAssets: Asset[] = data.map(asset => ({
          id: asset.id,
          name: asset.name,
          category: asset.category,
          serial: asset.serial || '',
          location: asset.location || '',
          assignedTo: asset.assigned_to || '',
          status: asset.status,
          qrCodeUrl: asset.qr_code_url || '',
          purchaseDate: asset.purchase_date ? new Date(asset.purchase_date).toISOString().split('T')[0] : undefined,
          purchaseValue: asset.purchase_value || undefined,
          currentValue: asset.current_value || undefined,
          lastMaintenance: asset.last_maintenance ? new Date(asset.last_maintenance).toISOString().split('T')[0] : undefined,
          nextMaintenance: asset.next_maintenance ? new Date(asset.next_maintenance).toISOString().split('T')[0] : undefined,
          supabaseId: asset.id
        }));

        setAssets(formattedAssets);
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
      toast({
        title: "Error",
        description: "Failed to load assets",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, toast]);

  // Add new asset
  const addAsset = async (asset: Omit<Asset, 'id' | 'supabaseId'>) => {
    try {
      if (!user?.id) return;

      console.log("Adding asset:", asset);

      const { data, error } = await supabase
        .from('assets')
        .insert({
          name: asset.name,
          category: asset.category,
          serial: asset.serial,
          location: asset.location,
          assigned_to: asset.assignedTo,
          status: asset.status || 'active',
          qr_code_url: asset.qrCodeUrl,
          purchase_date: asset.purchaseDate,
          purchase_value: asset.purchaseValue,
          current_value: asset.currentValue,
          last_maintenance: asset.lastMaintenance,
          next_maintenance: asset.nextMaintenance,
          created_by: user.id
        })
        .select();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      if (data && data[0]) {
        const newAsset: Asset = {
          ...asset,
          id: data[0].id,
          supabaseId: data[0].id
        };

        setAssets(prev => [...prev, newAsset]);
        
        toast({
          title: "Asset Added",
          description: `${newAsset.name} has been added to your assets.`
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error adding asset:", error);
      toast({
        title: "Error",
        description: "Failed to add asset",
        variant: "destructive"
      });
      return false;
    }
  };

  // Update asset
  const updateAsset = async (asset: Asset) => {
    try {
      if (!user?.id) return false;

      const { error } = await supabase
        .from('assets')
        .update({
          name: asset.name,
          category: asset.category,
          serial: asset.serial,
          location: asset.location,
          assigned_to: asset.assignedTo,
          status: asset.status,
          qr_code_url: asset.qrCodeUrl,
          purchase_date: asset.purchaseDate,
          purchase_value: asset.purchaseValue,
          current_value: asset.currentValue,
          last_maintenance: asset.lastMaintenance,
          next_maintenance: asset.nextMaintenance,
        })
        .eq('id', asset.id);

      if (error) {
        throw error;
      }

      setAssets(prevAssets =>
        prevAssets.map(prevAsset => (prevAsset.id === asset.id ? asset : prevAsset))
      );

      toast({
        title: "Asset Updated",
        description: `${asset.name} has been updated.`,
      });
      return true;
    } catch (error) {
      console.error("Error updating asset:", error);
      toast({
        title: "Error",
        description: "Failed to update asset",
      });
      return false;
    }
  };

  // Delete asset
  const deleteAsset = async (id: number) => {
    try {
      if (!user?.id) return false;

      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setAssets(prevAssets => prevAssets.filter(asset => asset.id !== id));
      
      toast({
        title: "Asset Deleted",
        description: "Asset has been deleted.",
      });
      return true;
    } catch (error) {
      console.error("Error deleting asset:", error);
      toast({
        title: "Error",
        description: "Failed to delete asset",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchAssets();
    }
  }, [user?.id, fetchAssets]);

  return {
    assets,
    loading,
    addAsset,
    updateAsset,
    deleteAsset,
    fetchAssets,
  };
};
