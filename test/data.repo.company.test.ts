import { companies } from "../src/data/repo/companies";
import * as companyRelationshipModule from "../src/data/loaders/companyRelationshipLoader";
import { Companies } from "../src/domain";

const companyRelationshipMap = {
  "1": { name: "companyA", subsidiaries: ["6", "7"] },
  "2": { name: "companyB", subsidiaries: [] },
  "3": { name: "companyC", subsidiaries: [] },
  "4": { name: "companyD", subsidiaries: [] },
  "5": { name: "companyE", subsidiaries: ["4"] },
  "6": { name: "companyF", subsidiaries: ["5"] },
  "7": { name: "companyH", subsidiaries: ["2", "3"] },
  "8": { name: "companyJ", subsidiaries: ["9"] },
  "9": { name: "companyK", subsidiaries: ["10"] },
  "10": { name: "companyL", subsidiaries: ["8"] },
};

describe("companies", () => {
  const mockCompanyLoader = () => {
    return Promise.resolve(companyRelationshipMap);
  };
  jest
    .spyOn(companyRelationshipModule, "companyRelationshipFileLoader")
    .mockImplementation(mockCompanyLoader);

  let testFixture: Companies = companies("testPath");

  describe("fetchByID", () => {
    it("returns undefined key no corresponding company", async () => {
      const actual = await testFixture.findById("testId");
      expect(actual).toBeUndefined();
    });
    it("returns company if it exists", async () => {
      const testId = "1";
      const actual = await testFixture.findById(testId);
      expect(actual).toEqual({
        id: testId,
        name: companyRelationshipMap[testId].name,
      });
    });
  });
  describe("findSubsidiaryIds", () => {
    it("returns an empty array company does not exist", async () => {
      const actual = await testFixture.findSubsidiaryIds("doesNotExist");
      expect(actual).toEqual([]);
    });
    it("returns an empty array if company has no subs", async () => {
      // 2 in the test data has no subs
      const actual = await testFixture.findSubsidiaryIds("2");
      expect(actual).toEqual([]);
    });
    it("returns an array of ids if company has subs", async () => {
      // 7 in test data owns 2 and 3
      const actual = await testFixture.findSubsidiaryIds("7");
      expect(actual).toEqual(["2", "3"]);
    });
    it("returns all ids of all subs sitting below company", async () => {
      // 1 in test data owns 6 and 7, who together 5 ,2 and 3. 5 owns company 4, 2 and 3 have no subs.
      // output should equal [6, 7, 5, 2, 3]
      const actual = await testFixture.findSubsidiaryIds("1");
      expect(actual).toEqual(["6", "7", "5", "4", "2", "3"]);
    });
    it("throws an error if circular dependency exists", async () => {
      // If malformed data containing circular dependency is provided we should inform where problem exists.
      expect(testFixture.findSubsidiaryIds("8")).rejects.toThrowError(
        "Company 10 contains circular dependency"
      );
    });
  });
});
