
import { useState, useEffect, useCallback } from "react";
import { Asset } from "../types";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { 
  fetchAssets, 
  createAsset, 
  updateAsset as updateAssetApi, 
  deleteAsset as deleteAssetApi 
} from "../api/assetApi";

export const useAssetData = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch assets from Supabase
  const fetchAssetData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      const formattedAssets = await fetchAssets();
      setAssets(formattedAssets);
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
      if (!user?.id) return false;

      const newAsset = await createAsset(asset, user.id);
      
      if (newAsset) {
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

      const success = await updateAssetApi(asset);

      if (success) {
        setAssets(prevAssets =>
          prevAssets.map(prevAsset => (prevAsset.id === asset.id ? asset : prevAsset))
        );

        toast({
          title: "Asset Updated",
          description: `${asset.name} has been updated.`,
        });
      }

      return success;
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
  const deleteAsset = async (id: string) => {
    try {
      if (!user?.id) return false;

      const success = await deleteAssetApi(id, assets);
      
      if (success) {
        setAssets(prevAssets => prevAssets.filter(asset => asset.id !== id));
        
        toast({
          title: "Asset Deleted",
          description: "Asset has been deleted.",
        });
      }
      
      return success;
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
      fetchAssetData();
    }
  }, [user?.id, fetchAssetData]);

  return {
    assets,
    loading,
    addAsset,
    updateAsset,
    deleteAsset,
    fetchAssets: fetchAssetData,
  };
};
