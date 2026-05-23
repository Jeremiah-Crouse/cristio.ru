#!/usr/bin/env node
// Yjs client for adam.js — connects to the shared document
const WebSocket = require('ws');
const Y = require('yjs');
const { WebsocketProvider } = require('y-websocket');

let ydoc = null;
let provider = null;
let ytext = null;
let connected = false;
let onUpdate = null;

function connect(url, room, onConnect) {
  ydoc = new Y.Doc();
  provider = new WebsocketProvider(url, room, ydoc, { WebSocketPolyfill: WebSocket });
  ytext = ydoc.getText('crousia-editor');

  provider.on('status', (event) => {
    connected = event.status === 'connected';
    if (connected && onConnect) onConnect(ytext);
  });

  ytext.observe((event) => {
    if (onUpdate) onUpdate(ytext.toString(), event);
  });

  return { ydoc, provider, ytext };
}

function getText() { return ytext ? ytext.toString() : ''; }

function insert(pos, text) { if (ytext) ytext.insert(pos, text); }

function deleteRange(pos, len) { if (ytext) ytext.delete(pos, len); }

function replaceRange(pos, del, text) { if (ytext) ytext.delete(pos, del); if (ytext && text) ytext.insert(pos, text); }

function disconnect() {
  if (provider) provider.destroy();
  if (ydoc) ydoc.destroy();
  provider = null; ydoc = null; ytext = null;
  connected = false;
}

module.exports = { connect, getText, insert, delete: deleteRange, replace: replaceRange, disconnect };
