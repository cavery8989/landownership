import readline from "readline";
export type MockedService<T> = {
    [Property in keyof T]: jest.Mock;
};
type handler = (...args: unknown[]) => void

export const mockReadLine = () => {
    let reg: {[index: string]: handler} = {};
    return {
      on: (event: string, fn: handler) => {
        reg[event] = fn;
      },
      trigger: (event:string, payload?:unknown) => {
        reg[event](payload);
      },
      clearHandlers: () => { reg = {}}
    } as unknown as readline.Interface & {
      trigger: (event:string, payload?: unknown) => void;
      clearHandlers: () => void
    };
  };