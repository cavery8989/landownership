import readline from "readline";
import fs from 'fs'

export type Aggregator<T> = (
  aggregate: T,
  line: string,
  lineNumber: number
) => T;


export const createReadInterface = (path: string) => readline.createInterface({
  input: fs.createReadStream(path),
}) 

export const csvLoader = <T extends object>(
  readLineInterface: readline.Interface,
  aggregator: Aggregator<T>
) =>
  new Promise<T>((resolve, reject) => {
    let currentLine = 1;
    let output = {} as T;
    readLineInterface.on("error", reject);
    readLineInterface.on("line", (line: string) => {
      if (currentLine !== 1) {
        output = aggregator(output, line, currentLine);
      }
      currentLine++;
    });
    readLineInterface.on("close", () => {
      resolve(output);
    });
  });

