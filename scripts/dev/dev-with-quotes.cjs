#!/usr/bin/env node

const { spawn } = require('node:child_process');
const net = require('node:net');
const path = require('node:path');

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const expoArgs = ['expo', 'start', ...process.argv.slice(2).filter((argument) => argument !== '--')];
const expoPortIndex = expoArgs.indexOf('--port');
const expoPort = expoPortIndex >= 0 ? Number(expoArgs[expoPortIndex + 1]) : 8081;
const quoteProxyPort = 8091;

function assertPortAvailable(port, label) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.once('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        reject(new Error(`${label} port ${port} is already in use. Stop the existing service and retry; this script does not switch ports automatically.`));
        return;
      }

      reject(error);
    });

    server.once('listening', () => {
      server.close(resolve);
    });

    server.listen(port, '0.0.0.0');
  });
}

let quoteProxy;
let expo;

function stop(child) {
  if (child && !child.killed) {
    child.kill('SIGINT');
  }
}

function shutdown(code = 0) {
  stop(quoteProxy);
  stop(expo);
  process.exit(code);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

async function main() {
  await assertPortAvailable(expoPort, 'Expo / Metro');
  await assertPortAvailable(quoteProxyPort, 'Quote proxy');

  quoteProxy = spawn(process.execPath, [path.join(__dirname, 'quote-proxy.cjs')], {
    stdio: 'inherit',
  });

  expo = spawn(command, expoArgs, {
    stdio: 'inherit',
  });

  quoteProxy.on('exit', (code) => {
    if (code && code !== 0) {
      stop(expo);
      process.exit(code);
    }
  });

  expo.on('exit', (code) => {
    stop(quoteProxy);
    process.exit(code ?? 0);
  });
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
