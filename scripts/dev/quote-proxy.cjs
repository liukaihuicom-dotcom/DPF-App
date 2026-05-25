#!/usr/bin/env node

const http = require('node:http');
const os = require('node:os');
const WebSocket = require('ws');

const PORT = 8091;
const HOST = process.env.QUOTE_PROXY_HOST ?? '0.0.0.0';
const UPSTREAM_URL = process.env.DUPOIN_QUOTE_WS_URL ?? 'wss://ws.dupoin.co.id/api/webtrade/v2/ws?login=0&sid=0';
const DUPION_ORIGIN = process.env.DUPOIN_QUOTE_ORIGIN ?? 'https://www.dupoin.co.id';
const SYMBOLS = (process.env.DUPOIN_QUOTE_SYMBOLS ?? 'EURUSD,GBPUSD,AUDUSD,NZDUSD,USDJPY,USDCAD,USDCHF,XAUUSD')
  .split(',')
  .map((symbol) => symbol.trim().toUpperCase())
  .filter(Boolean);

const server = http.createServer((_request, response) => {
  response.writeHead(200, { 'content-type': 'application/json' });
  response.end(JSON.stringify({ ok: true, service: 'dupoin-quote-proxy', symbols: SYMBOLS }));
});

const localClients = new Set();
let upstream = null;
let reconnectTimer = null;
let firstQuoteTimer = null;
let hasFirstQuote = false;

function getLanAddresses() {
  return Object.values(os.networkInterfaces())
    .flat()
    .filter((address) => address && address.family === 'IPv4' && !address.internal)
    .map((address) => address.address);
}

function sendLocal(client, payload) {
  if (client.readyState === WebSocket.OPEN) {
    client.send(payload);
  }
}

function broadcast(payload) {
  for (const client of localClients) {
    sendLocal(client, payload);
  }
}

function broadcastStatus(status, reason) {
  broadcast(JSON.stringify({ type: 'quote-status', status, reason }));
}

function scheduleReconnect() {
  if (reconnectTimer || localClients.size === 0) {
    return;
  }

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connectUpstream();
  }, 2500);
}

function closeUpstream() {
  if (!upstream) {
    return;
  }

  const socket = upstream;
  upstream = null;
  clearTimeout(firstQuoteTimer);
  firstQuoteTimer = null;
  socket.removeAllListeners();
  socket.close();
}

function connectUpstream() {
  if (upstream || localClients.size === 0) {
    return;
  }

  hasFirstQuote = false;
  upstream = new WebSocket(UPSTREAM_URL, {
    headers: {
      Origin: DUPION_ORIGIN,
    },
  });

  upstream.on('open', () => {
    broadcastStatus('connecting');
    upstream.send(JSON.stringify({ action: 3, data: { symbols: SYMBOLS }, type: 2 }));
    clearTimeout(firstQuoteTimer);
    firstQuoteTimer = setTimeout(() => {
      if (!hasFirstQuote) {
        broadcastStatus('failed', 'No live quote received from upstream within 8 seconds.');
      }
    }, 8000);
  });

  upstream.on('message', (data) => {
    hasFirstQuote = true;
    clearTimeout(firstQuoteTimer);
    firstQuoteTimer = null;
    broadcast(data.toString());
  });

  upstream.on('error', (error) => {
    broadcastStatus('failed', error.message);
  });

  upstream.on('close', (code, reason) => {
    upstream = null;
    clearTimeout(firstQuoteTimer);
    firstQuoteTimer = null;
    broadcastStatus('failed', `Upstream closed: ${code}${reason ? ` ${reason}` : ''}`);
    scheduleReconnect();
  });
}

const wss = new WebSocket.Server({ server });

wss.on('connection', (client) => {
  localClients.add(client);
  sendLocal(client, JSON.stringify({ type: 'quote-status', status: upstream ? 'connecting' : 'connecting' }));
  connectUpstream();

  client.on('close', () => {
    localClients.delete(client);
    if (localClients.size === 0) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
      closeUpstream();
    }
  });
});

server.listen(PORT, HOST, () => {
  const addresses = getLanAddresses();
  console.log(`Dupoin quote proxy listening on ws://localhost:${PORT}`);
  for (const address of addresses) {
    console.log(`LAN quote proxy: ws://${address}:${PORT}`);
  }
});

process.on('SIGINT', () => {
  closeUpstream();
  server.close(() => process.exit(0));
});
