import { Aggregator, createReadInterface, csvLoader } from "./csvLoader";

type LandOwnership = {
  [index: string]: string[];
};

const landOwnershipAggregator: Aggregator<LandOwnership> = (agg, csvLine) => {
  const [landId, companyId] = csvLine.split(",").map((d) => d.trim());
  const existingRecord = agg[companyId];
  return {
    ...agg,
    [companyId]: existingRecord ? existingRecord.concat(landId) : [landId],
  };
};

export const landOwnershipFileLoader = (
  path:string
) => csvLoader(createReadInterface(path), landOwnershipAggregator);
