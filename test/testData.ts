

const companyRelationshipMap = {
  "1": { name: "companyA", subsidiaries: ["6", "7"] },
  "2": { name: "companyB", subsidiaries: [] },
  "3": { name: "companyC", subsidiaries: [] },
  "4": { name: "companyD", subsidiaries: [] },
  "5": { subsidiaries: ["4"], name: "companyE" },
  "6": { subsidiaries: ["5"], name: "companyF" },
  "7": { subsidiaries: ["2", "3"], name: "companyH" },
}; 
