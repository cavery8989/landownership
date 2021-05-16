// sketch out data types functions
type Report = {
  companyId: string;
  companyName: string;
  packetsOwnedDirectly: number;
  packetsOwnedBySubs: number;
};

export type Company = { id: CompanyId; name: string };
export type Companies = {
  findById: (companyId: string) => Promise<Company | undefined>;
  findSubsidiaryIds: (company: string) => Promise<string[]>;
};

export type LandRegister = {
  findByCompanyIds: (companyIds: string[]) => Promise<string[][]>;
};
export type GenerateReport = (companyId: string) => Promise<Report>;

function sumTotalOwnedByOthers(ownedByOthers: string[][]): number {
  return ownedByOthers.reduce((sum, cur) => sum + cur.length, 0);
}

export const generateReport =
  (companies, landRegister): GenerateReport =>
  async (companyId) => {
    const company = await companies.findById(companyId);
    if (company === undefined) {
      throw new Error(`${companyId} not found`);
    }
    const subsidiaryIds = await companies.findSubsidiaryIds(companyId);
    const [directlyOwned, ...ownedByOthers] =
      await landRegister.findByCompanyIds([companyId, ...subsidiaryIds]);
    return {
      companyId: company.id,
      companyName: company.name,
      packetsOwnedDirectly: directlyOwned ? directlyOwned.length : 0,
      packetsOwnedBySubs: ownedByOthers
        ? sumTotalOwnedByOthers(ownedByOthers)
        : 0,
    };
  };
