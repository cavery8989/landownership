import { LandRegister } from "../../domain";
import { landOwnershipFileLoader } from "../loaders/landOwnershipLoader";

export const landRegister = (path: string): LandRegister => {
  const companies = landOwnershipFileLoader(path);
  return {
    findByCompanyIds: async (companyIds: string[]) => {
        const data = await companies
        return companyIds.map((company) => {
          return data[company] || []
      });
    },
  };
};
