import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react"; 
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalesTable } from "./components/SalesTable";
import { ServiceHistoryTable } from "./components/ServiceHistoryTable";
import { ProductLookupWithQR, Product } from "./components/ProductLookupWithQR";
import { ProductDetailsDialog } from "./components/ProductDetailsDialog";
import { SalesHeader } from "./components/SalesHeader";
import { ImportDialog } from "./components/ImportDialog"; 
import { useSalesData } from "./hooks/useSalesData";
import { useExportData } from "./hooks/useExportData";
import { mockClientBranches } from "./data/mockData";
import { SalesItem } from "./types";
import { Search, Filter } from "lucide-react";
import { SalesFilters } from "./components/SalesFilters";

export default function SalesTracking() {
  const {
    salesItems,
    serviceRecords,
    handleAddSale,
    handleUpdateSale,
    handleDeleteSale,
    handleAddService,
    handleImportComplete
  } = useSalesData();
  
  const { exportToCSV } = useExportData(salesItems, serviceRecords);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [clientFilter, setClientFilter] = useState("All");
  const [warrantyFilter, setWarrantyFilter] = useState("All");
  const [viewingServiceHistory, setViewingServiceHistory] = useState(false);
  const [serviceHistoryForItem, setServiceHistoryForItem] = useState<string | null>(null);
  const [viewingProductDetails, setViewingProductDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<SalesItem | null>(null);
  const [productLookupOpen, setProductLookupOpen] = useState(false);

  const handleViewServiceHistory = (id: string) => {
    setServiceHistoryForItem(id);
    setViewingServiceHistory(true);
  };

  const handleViewProductDetails = (item: SalesItem) => {
    setSelectedProduct(item);
    setViewingProductDetails(true);
  };

  const handleProductSelected = (item: any) => {
    setProductLookupOpen(false);
    if ((item as SalesItem).serialNo) {
      handleViewProductDetails(item as SalesItem);
    }
  };

  const productsForLookup: Product[] = salesItems.map(item => ({
    id: item.id,
    name: item.productName,
    sku: item.serialNo,
    // Add any other required properties
  }));

  const filteredSalesItems = salesItems.filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serialNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.client.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    const matchesClient = clientFilter === "All" || item.client === clientFilter;
    
    const matchesWarranty = warrantyFilter === "All" || 
                          (warrantyFilter === "Valid" && item.status === "Warranty Only") ||
                          (warrantyFilter === "Expiring Soon" && item.status === "Expiring Soon") ||
                          (warrantyFilter === "Expired" && item.status === "Expired");
    
    return matchesSearch && matchesStatus && matchesClient && matchesWarranty;
  });

  return (
    <div className="space-y-6">
      <SalesHeader 
        onImportComplete={handleImportComplete}
        onExportCSV={exportToCSV}
      />

      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales">Sales & AMC Records</TabsTrigger>
          <TabsTrigger value="service">Service History</TabsTrigger>
        </TabsList>
      
        <TabsContent value="sales" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <Button variant="outline" onClick={() => setProductLookupOpen(true)}>
              Search Products with QR
            </Button>
            <ProductLookupWithQR
              open={productLookupOpen}
              onClose={() => setProductLookupOpen(false)}
              onSelect={handleProductSelected}
              products={productsForLookup}
            />
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Serviced">Serviced</SelectItem>
                  <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
                  <SelectItem value="Warranty Only">Warranty Only</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search sales..." 
                className="pl-8 w-full" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>
          </div>

          {showFilters && (
            <SalesFilters 
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              clientFilter={clientFilter}
              setClientFilter={setClientFilter}
              warrantyFilter={warrantyFilter}
              setWarrantyFilter={setWarrantyFilter}
              salesItems={salesItems}
            />
          )}

          <div className="border rounded-md">
            <SalesTable 
              items={filteredSalesItems}
              onEdit={() => {}}
              onViewHistory={handleViewServiceHistory}
              onDelete={handleDeleteSale}
              onUpdate={handleUpdateSale}
              clientBranches={mockClientBranches}
              onView={handleViewProductDetails}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="service" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Service History Records</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => exportToCSV('service')}>
                <Download className="h-4 w-4 mr-2" />
                Export Records
              </Button>
              <ImportDialog 
                type="service" 
                onImportComplete={(data) => handleImportComplete(data, 'service')} 
              />
            </div>
          </div>
          
          <div className="border rounded-md">
            <ServiceHistoryTable 
              records={serviceRecords}
            />
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={viewingServiceHistory} onOpenChange={setViewingServiceHistory}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              Service History
              {serviceHistoryForItem && salesItems.find(item => item.id === serviceHistoryForItem) && (
                <span className="ml-2 font-normal text-muted-foreground">
                  {salesItems.find(item => item.id === serviceHistoryForItem)?.productName}
                </span>
              )}
            </DialogTitle>
            <DialogDescription>
              Complete service history for this product
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="border rounded-md">
              <ServiceHistoryTable 
                records={serviceRecords}
                compact
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ProductDetailsDialog
        isOpen={viewingProductDetails}
        onClose={() => setViewingProductDetails(false)}
        item={selectedProduct}
        serviceRecords={serviceRecords}
      />
    </div>
  );
}
