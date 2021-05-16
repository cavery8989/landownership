import { Companies } from "../../domain";
import { createReadInterface } from "../loaders/csvLoader";
import {
  companyRelationshipFileLoader,
  CompanyRelationships,
} from "../loaders/companyRelationshipLoader";

export const companies = (path: string): Companies => {
  const companies = companyRelationshipFileLoader(path);

  return {
    findById: async (companyId: string) => {
      const company = (await companies)[companyId];
      if (company) {
        return {
          id: companyId,
          name: company.name,
        };
      }
    },
    findSubsidiaryIds: async (companyId) => {
      const data = await companies;
      return extractSubs(data, companyId);
    },
  };
};

const extractSubs = (
  companyMap: CompanyRelationships,
  companyId: string,
  parentIds: string[] = []
): string[] => {
  const company = companyMap[companyId];
  if (company === undefined || company.subsidiaries.length === 0) {
    return [];
  }
  if (company.subsidiaries.find((s) => parentIds.includes(s))) {
    throw new Error(`Company ${companyId} contains circular dependency`);
  }
  const childIds = company.subsidiaries
    .map((subId) => extractSubs(companyMap, subId, parentIds.concat(companyId)))
    .flat();
  return company.subsidiaries.concat(childIds);
};
