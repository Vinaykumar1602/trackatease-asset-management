
import { ClientBranch } from "../types";

export const mockClientBranches: ClientBranch[] = [
  { id: 1, clientId: 1, name: "ABC Corporation - Main Branch", code: "ABC-001", address: "123 Corporate Blvd, City" },
  { id: 2, clientId: 1, name: "ABC Corporation - North Branch", code: "ABC-002", address: "456 Business Ave, City" },
  { id: 3, clientId: 2, name: "XYZ Inc - Headquarters", code: "XYZ-001", address: "789 Market St, City" },
  { id: 4, clientId: 2, name: "XYZ Inc - South Division", code: "XYZ-002", address: "101 Commerce Rd, City" },
  { id: 5, clientId: 3, name: "123 Solutions - Main Office", code: "123-HQ", address: "202 Solution Dr, City" },
];
