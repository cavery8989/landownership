export const loading = (message: string) => {
    let counter = 0
    const interval = setInterval(() => {
      const dots = Array.from(Array(counter)).reduce(d => d + '.','')
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(`${message}.${dots}` + '\x1B[?25l');
      counter = (counter + 1) % 3
    }, 500);
  
    return () => {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      // put cursor back
      process.stdout.write('\x1B[?25h');
      clearInterval(interval);
    };
  };
  