const fs = require('fs');
const path = require('path');
const { exec, ChildProcess } = require('child_process');

/** @type {string} */
const dbDir = path.join(__dirname, 'database');
if (!fs.existsSync(dbDir)) {
  console.log('Creating database directory...');
  fs.mkdirSync(dbDir, { recursive: true });
}

console.log('Starting the application...');

/**
 * @typedef {Object} ExecError
 * @property {string} message
 */

/**
 * @callback ExecCallback
 * @param {ExecError|null} error
 * @param {string} stdout
 * @param {string} stderr
 */

/** @type {ChildProcess} */
const appProcess = exec('node app.js', 
  /** @type {ExecCallback} */
  (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  }
);

appProcess.stdout.on('data', 
  /** 
   * @param {Buffer|string} data 
   */
  (data) => {
    console.log(data.toString());
  }
);

appProcess.stderr.on('data', 
  /** 
   * @param {Buffer|string} data 
   */
  (data) => {
    console.error(data.toString());
  }
);

process.on('SIGINT', () => {
  console.log('\nGracefully shutting down...');
  appProcess.kill();
  process.exit();
});

process.on('SIGTERM', () => {
  console.log('\nGracefully shutting down...');
  appProcess.kill(); 
  process.exit();
});
