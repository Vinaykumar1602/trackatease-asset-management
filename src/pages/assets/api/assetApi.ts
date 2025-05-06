
import { supabase } from "@/integrations/supabase/client";
import { Asset } from "../types";

// Fetch all assets
export const fetchAssets = async (): Promise<Asset[]> => {
  const { data, error } = await supabase
    .from('assets')
    .select('*');

  if (error) {
    throw error;
  }

  if (data) {
    return data.map(asset => ({
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
  }

  return [];
};

// Create a new asset
export const createAsset = async (
  asset: Omit<Asset, 'id' | 'supabaseId'>,
  userId: string
): Promise<Asset | null> => {
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
      created_by: userId
    })
    .select();

  if (error) {
    console.error("Supabase error:", error);
    throw error;
  }

  if (data && data[0]) {
    return {
      ...asset,
      id: data[0].id,
      supabaseId: data[0].id
    };
  }

  return null;
};

// Update an asset
export const updateAsset = async (asset: Asset): Promise<boolean> => {
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
    .eq('id', asset.supabaseId || asset.id);

  if (error) {
    throw error;
  }

  return true;
};

// Delete an asset
export const deleteAsset = async (id: string, assets: Asset[]): Promise<boolean> => {
  // Find the asset to get the Supabase ID
  const asset = assets.find(a => a.id === id);
  if (!asset) return false;

  const { error } = await supabase
    .from('assets')
    .delete()
    .eq('id', asset.supabaseId || asset.id);

  if (error) {
    throw error;
  }

  return true;
};
