
import { SaleFormData } from "../types";

export const calculateStatus = (item: SaleFormData): string => {
  if (item.amcStartDate === "" || item.amcExpiryDate === "") {
    return "Warranty Only";
  }
  
  const today = new Date();
  const amcExpiry = new Date(item.amcExpiryDate);
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(today.getMonth() + 3);
  
  if (amcExpiry < today) {
    return "Expired";
  } else if (amcExpiry <= threeMonthsFromNow) {
    return "Expiring Soon";
  }
  return "Active";
};
