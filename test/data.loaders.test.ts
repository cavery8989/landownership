import { mockReadLine } from "./helpers";

import { Aggregator, csvLoader } from "../src/data/loaders/csvLoader";
import { companyRelationshipFileLoader } from "../src/data/loaders/companyRelationshipLoader";
import { landOwnershipFileLoader } from "../src/data/loaders/landOwnershipLoader";
import * as CsvLoaderModule from "../src/data/loaders/csvLoader";
describe("services", () => {
  const mockCreateInterface = jest.spyOn(
    CsvLoaderModule,
    "createReadInterface"
  );

  describe("fileParser", () => {
    const mockReadlineInterface = mockReadLine();
    const testAggregator: Aggregator<{}> = (agg, cur, ln) => ({
      ...agg,
      [ln]: cur,
    });

    afterEach(() => mockReadlineInterface.clearHandlers());
    it("returns an object when end of file is reached", async () => {
      const testFixture = csvLoader(mockReadlineInterface, testAggregator);
      mockReadlineInterface.trigger("close");
      const actual = await testFixture;
      expect(actual).toEqual({});
    });
    it("skips first line of csv", async () => {
      const testFixture = csvLoader(mockReadlineInterface, testAggregator);
      mockReadlineInterface.trigger("line", "lineOne");
      mockReadlineInterface.trigger("line", "lineTwo");
      mockReadlineInterface.trigger("close");
      const actual = await testFixture;
      expect(actual).toEqual({ "2": "lineTwo" });
    });

    it("parses the data into correct format", async () => {
      const testFixture = csvLoader(mockReadlineInterface, testAggregator);
      mockReadlineInterface.trigger("line", "lineOne");
      mockReadlineInterface.trigger("line", "lineTwo");
      mockReadlineInterface.trigger("close");
      const actual = await testFixture;
      expect(actual).toEqual({ "2": "lineTwo" });
    });
  });
  describe("companyRelationsLoader", () => {
    const companyRelationDataRows = [
      "company_id, name, parent",
      "1, companyA, ",
      "2, companyB, 7",
      "3, companyC, 7",
      "4, companyD, 5",
      "5, companyE, 6",
      "6, companyF, 1",
      "7, companyH, 1",
    ];

    const mockReadlineInterface = mockReadLine();

    mockCreateInterface.mockImplementationOnce(() => mockReadlineInterface);
    it("parses file lines correctly", async () => {
      const testFixture = companyRelationshipFileLoader("testPath");
      companyRelationDataRows.forEach((line) =>
        mockReadlineInterface.trigger("line", line)
      );
      mockReadlineInterface.trigger("close");

      const actual = await testFixture;

      expect(actual).toEqual({
        "1": { name: "companyA", subsidiaries: ["6", "7"] },
        "2": { name: "companyB", subsidiaries: [] },
        "3": { name: "companyC", subsidiaries: [] },
        "4": { name: "companyD", subsidiaries: [] },
        "5": { subsidiaries: ["4"], name: "companyE" },
        "6": { subsidiaries: ["5"], name: "companyF" },
        "7": { subsidiaries: ["2", "3"], name: "companyH" },
      });
    });
  });

  describe("landOwnershipLoader", () => {
    const landOwnershipRows = [
      "land_id,company_id",
      "plot1, companyA",
      "plot2, companyB",
      "plot3, companyB",
      "plot4, companyB",
      "plot5, companyC",
      "plot6, companyC",
      "plot7, companyD",
      "plot8, companyD",
    ];
    const mockReadlineInterface = mockReadLine();
    mockCreateInterface.mockImplementationOnce(() => mockReadlineInterface);
    it("parses file correctly", async () => {
      const testFixture = landOwnershipFileLoader("testPath");

      landOwnershipRows.forEach((line) =>
        mockReadlineInterface.trigger("line", line)
      );
      mockReadlineInterface.trigger("close");

      const actual = await testFixture;
      expect(actual).toEqual({
        companyA: ["plot1"],
        companyB: ["plot2", "plot3", "plot4"],
        companyC: ["plot5", "plot6"],
        companyD: ["plot7", "plot8"],
      });
    });
  });
});
