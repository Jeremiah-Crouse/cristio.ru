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
let myAwareness = null;

function connect(url, room, onConnect) {
  ydoc = new Y.Doc();
  provider = new WebsocketProvider(url, room, ydoc, { WebSocketPolyfill: WebSocket });
  ytext = ydoc.getText('crousia-editor');

  provider.on('status', (event) => {
    connected = event.status === 'connected';
    if (connected && onConnect) onConnect(ytext);
  });

  myAwareness = provider.awareness;

  ytext.observe((event) => {
    if (onUpdate) onUpdate(ytext.toString(), event);
  });

  return { ydoc, provider, ytext, awareness: myAwareness };
}

function getText() { return ytext ? ytext.toString() : ''; }
function getLength() { return ytext ? ytext.length : 0; }
function insert(pos, text) { if (ytext) ytext.insert(pos, text); }
function deleteRange(pos, len) { if (ytext) ytext.delete(pos, len); }
function replaceRange(pos, del, text) { if (ytext) ytext.delete(pos, del); if (ytext && text) ytext.insert(pos, text); }

function setCursor(pos) {
  if (myAwareness) {
    myAwareness.setLocalStateField('cursor', { anchor: pos, head: pos });
  }
}
function setSelection(anchor, head) {
  if (myAwareness) {
    myAwareness.setLocalStateField('cursor', { anchor, head });
  }
}
function getOthersCursor() {
  if (!myAwareness) return [];
  const states = [];
  myAwareness.getStates().forEach((state, id) => {
    if (state.cursor) states.push({ clientId: id, ...state.cursor });
  });
  return states;
}

function disconnect() {
  if (provider) provider.destroy();
  if (ydoc) ydoc.destroy();
  provider = null; ydoc = null; ytext = null;
  connected = false;
}

module.exports = { connect, getText, getLength, insert, delete: deleteRange, replace: replaceRange, setCursor, setSelection, getOthersCursor, disconnect };
