import { GenerateReport } from "./domain";
import { loading } from "./misc";

const title: string = `
__                    ________          __                                                                    
/ /   ____ _____  ____/ /_  __/__  _____/ /_                                                                   
/ /   / __ \`/ __ \\/ __  / / / / _ \\/ ___/ __ \\                                                                  
/ /___/ /_/ / / / / /_/ / / / /  __/ /__/ / / /                                                                  
/_____/\\__,_/_/ /_/\\__,_/ /_/  \\___/\\___/_/ /_/         _______           __               __________  ____  ____ 
/ __ \\_      ______  ___  __________/ /_  (_)___     / ____(_)___  ____/ /__  _____     / ____/ __ \\/ __ \\/ __ \\
/ / / / | /| / / __ \\/ _ \\/ ___/ ___/ __ \\/ / __ \\   / /_  / / __ \\/ __  / _ \\/ ___/    /___ \\/ / / / / / / / / /
/ /_/ /| |/ |/ / / / /  __/ /  (__  ) / / / / /_/ /  / __/ / / / / / /_/ /  __/ /       ____/ / /_/ / /_/ / /_/ / 
\\____/ |__/|__/_/ /_/\\___/_/  /____/_/ /_/_/ .___/  /_/   /_/_/ /_/\\__,_/\\___/_/       /_____/\\____/\\____/\\____/  
                                      /_/                                                                     
`;

export const app = (generateReport: GenerateReport) => ({
  start: async () => {
    console.log(title);
    const companyId = process.argv[2];
    if (!companyId) {
      console.log(`${companyId} is not a valid Id.`);
    } else {
      const loaded = loading("Building report");
      try {
        const report = await generateReport(companyId);
        loaded();
        console.log(
          `${report.companyName} owns ${report.packetsOwnedDirectly} packet${
            report.packetsOwnedDirectly === 1 ? "" : "s"
          } of land directly.`
        );
        if (report.packetsOwnedBySubs > 0) {
          console.log(
            `${report.packetsOwnedDirectly > 0 ? "It also" : "But it"} owns ${
              report.packetsOwnedBySubs
            } packets distributed amongst its subsidiaries.`
          );
        }
      } catch (e) {
        loaded();
        console.log(e.message);
      }
    }

    process.exit();
  },
});
