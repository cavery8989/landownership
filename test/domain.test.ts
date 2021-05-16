import {
  Companies,
  Company,
  generateReport,
  LandRegister,
} from "../src/domain";
import { MockedService } from "./helpers";

const mockCompanies: MockedService<Companies> = {
  findById: jest.fn(),
  findSubsidiaryIds: jest.fn(),
};
const mockLandRegistry: MockedService<LandRegister> = {
  findByCompanyIds: jest.fn(),
};

const testCompanyId = "testId";

const testCompany: Company = {
  name: "testCompany",
  id: testCompanyId,
};

describe("generateReport", () => {
  const testFixture = generateReport(mockCompanies, mockLandRegistry);
  describe("Given a companyId", () => {
    describe(`
            That does not return a company`, () => {
      beforeEach(() => mockCompanies.findById.mockResolvedValueOnce(undefined));
      it("it throw an error", async () => {
        expect(() => testFixture("testId")).rejects.toThrowError(
          `${testCompanyId} not found`
        );
      });
    });

    describe(`
            That returns a company 
            with no subsidiaries
            and no land`, () => {
      beforeEach(() => {
        mockCompanies.findById.mockResolvedValueOnce(testCompany);
        mockCompanies.findSubsidiaryIds.mockResolvedValueOnce([]);
        mockLandRegistry.findByCompanyIds.mockResolvedValueOnce([]);
      });
      it("Calls findSubsidiaryIds with the companyId", async () => {
        await testFixture(testCompanyId);
        expect(mockCompanies.findSubsidiaryIds).toHaveBeenCalledWith(
          testCompanyId
        );
      });
      it("Calls mockLandRegistry.findByCompanyId with the companyId", async () => {
        await testFixture(testCompanyId);
        expect(mockLandRegistry.findByCompanyIds).toHaveBeenCalledWith([
          testCompanyId,
        ]);
      });
      it("returns a report", async () => {
        const actual = await testFixture(testCompanyId);
        expect(actual).toEqual({
          companyId: testCompany.id,
          companyName: testCompany.name,
          packetsOwnedBySubs: 0,
          packetsOwnedDirectly: 0,
        });
      });
    });
    describe(`
            That returns a company 
            with no subsidiaries
            and directly owned land`, () => {
      const packetList = ["a", "b", "d"];
      beforeEach(() => {
        mockCompanies.findById.mockResolvedValueOnce(testCompany);
        mockCompanies.findSubsidiaryIds.mockResolvedValueOnce([]);
        mockLandRegistry.findByCompanyIds.mockResolvedValueOnce([packetList]);
      });

      it("returns a report", async () => {
        const actual = await testFixture(testCompanyId);
        expect(actual).toEqual({
          companyId: testCompany.id,
          companyName: testCompany.name,
          packetsOwnedDirectly: packetList.length,
          packetsOwnedBySubs: 0,
        });
      });
    });
    describe(`
    That returns a company with directly owned land
    that has subsidiaries that all own land`, () => {
      const directlyOwned = ["a", "b", "c"];
      const subLands = [
        ["1", "2", "3"],
        ["4", "5"],
        ["6", "7", "8", "9"],
      ];
      const subCompanyIds = ["subIdOne", "subIdThree", "subIdThree"];
      beforeEach(() => {
        mockCompanies.findById.mockResolvedValueOnce(testCompany);
        mockCompanies.findSubsidiaryIds.mockResolvedValueOnce(subCompanyIds);
        mockLandRegistry.findByCompanyIds.mockResolvedValueOnce([
          directlyOwned,
          ...subLands,
        ]);
      });

      it("calls landRegister.findByCompanyIds with the correct input", async () => {
        await testFixture(testCompanyId);
        expect(mockLandRegistry.findByCompanyIds).toBeCalledWith([
          testCompanyId,
          ...subCompanyIds,
        ]);
      });

      it("returns a report", async() => {
        const actual = await testFixture(testCompanyId);
        expect(actual).toEqual({
          companyId: testCompany.id,
          companyName: testCompany.name,
          packetsOwnedDirectly: directlyOwned.length,
          packetsOwnedBySubs: 9,
        });
      });
    });
    describe(`
    That returns a company with directly owned land
    that has subsidiaries where some own land`, () => {
      const directlyOwned = ["a", "b", "c"];
      const subLands = [
        ["1", "2", "3"],
        [],
        ["4", "5", "6", "7", "8"],
        [],
        [],
        ["9", "10"],
      ];
      const subCompanyIds = ["subIdOne", "subIdThree", "subIdThree"];
      beforeEach(() => {
        mockCompanies.findById.mockResolvedValueOnce(testCompany);
        mockCompanies.findSubsidiaryIds.mockResolvedValueOnce(subCompanyIds);
        mockLandRegistry.findByCompanyIds.mockResolvedValueOnce([
          directlyOwned,
          ...subLands,
        ]);
      });

      it("returns a report",  async() => {
        const actual = await testFixture(testCompanyId);
        expect(actual).toEqual({
          companyId: testCompany.id,
          companyName: testCompany.name,
          packetsOwnedDirectly: directlyOwned.length,
          packetsOwnedBySubs: 10,
        });
      });
    });
  });
});
