#!/usr/bin/env node

const { spawn } = require('node:child_process');
const path = require('node:path');

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const expoArgs = ['expo', 'start', ...process.argv.slice(2).filter((argument) => argument !== '--')];

const quoteProxy = spawn(process.execPath, [path.join(__dirname, 'quote-proxy.cjs')], {
  stdio: 'inherit',
});

const expo = spawn(command, expoArgs, {
  stdio: 'inherit',
});

function stop(child) {
  if (!child.killed) {
    child.kill('SIGINT');
  }
}

function shutdown(code = 0) {
  stop(quoteProxy);
  stop(expo);
  process.exit(code);
}

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

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
