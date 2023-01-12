const childProcess = require('child_process');

const executeScript = (command) => (
  new Promise((resolve, reject) => {
    const child = childProcess.exec(command, (er) => {
      if (er) {
        reject(er);
      }
      resolve(command);
    });
    child.stdout.on('data', (data) => {
      console.log(`[${command.toLowerCase()}]`, data);
    });
    child.stdin.end();
  })
);

(async () => {
  try {
    await executeScript('yarn start:build');
    await executeScript('yarn prebuild:server');
    await executeScript('yarn build:server');
  } catch {
    process.exit(1);
  }
})();
