import * as landRegisterModule from "../src/data/loaders/landOwnershipLoader";
import { landRegister } from "../src/data/repo/landRegister";

const landRegisterMap = {
  companyA: ["plot1"],
  companyB: ["plot2", "plot3", "plot4"],
  companyC: ["plot5", "plot6"],
  companyD: ["plot7", "plot8"],
};
describe("landRegister", () => {
  const mockLandOwnershipLoader = () => {
    return Promise.resolve(landRegisterMap);
  };
  jest
    .spyOn(landRegisterModule, "landOwnershipFileLoader")
    .mockImplementation(mockLandOwnershipLoader);

  let testFixture = landRegister("testPath");
  describe("findByCompanyIds", () => {
    it("returns empty array for each company with no land", async () => {
      const actual = await testFixture.findByCompanyIds([
        "doesNotExist1",
        "doesNotExist2",
        "doesNotExist2",
      ]);
      expect(actual).toEqual([[], [], []]);
    });
    it("returns an array of ids for every company that own land", async () => {
      const actual = await testFixture.findByCompanyIds([
        "companyA",
        "doesNotExist2",
        "companyC",
      ]);
      expect(actual).toEqual([["plot1"], [], ["plot5", "plot6"]]);
    });
  });
});
