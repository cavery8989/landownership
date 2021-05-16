import { Aggregator, createReadInterface, csvLoader } from "./csvLoader";
import readline from "readline";

type CompanyRecord = { name: string; subsidiaries: string[] };
export type CompanyRelationships = {
  [index: string]: CompanyRecord | undefined;
};

const upsertCompany = (
  existingCompany: CompanyRecord | undefined,
  name: string
) => {
  return existingCompany
    ? { ...existingCompany, name }
    : { name, subsidiaries: [] };
};

const upsertParent = (
  parentId: string,
  existingParent: CompanyRecord | undefined,
  companyId: string
) => {
  if (!parentId) {
    return undefined;
  }
  return existingParent
    ? {
        ...existingParent,
        subsidiaries: existingParent.subsidiaries.concat(companyId),
      }
    : ({ subsidiaries: [companyId] } as CompanyRecord);
};

const companyRelationsAggregator: Aggregator<CompanyRelationships> = (
  agg,
  csvLine
) => {
  const [companyId, name, parentId] = csvLine.split(",").map((s) => s.trim());
  const existingCompany = agg[companyId];
  const existingParent = agg[parentId];
  const out = {
    ...agg,
    // If parent exists insert the name, otherwise set up a new record
    [companyId]: upsertCompany(existingCompany, name),
  };

  if (parentId)
    // If the parent exists append this company to its list of subs, otherwise set up a new parent with this company as a sub
    out[parentId] = upsertParent(parentId, existingParent, companyId);

  return out;
};

export const companyRelationshipFileLoader = (
  path: string
) => csvLoader(createReadInterface(path), companyRelationsAggregator);
