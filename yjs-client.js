#!/usr/bin/env node
// Yjs client for adam.js — connects to the shared document
const WebSocket = require('ws');
const Y = require('yjs');
const { WebsocketProvider } = require('y-websocket');

let ydoc = null;
let provider = null;
let ytext = null;
let ychat = null;
let connected = false;
let onUpdate = null;
let onChatUpdate = null;
let myAwareness = null;

function connect(url, room, onConnect) {
  ydoc = new Y.Doc();
  provider = new WebsocketProvider(url, room, ydoc, { WebSocketPolyfill: WebSocket });
  ytext = ydoc.getText('crousia-editor');
  ychat = ydoc.getArray('crousia-chat');

  provider.on('status', (event) => {
    connected = event.status === 'connected';
    if (connected && onConnect) onConnect(ytext);
  });

  myAwareness = provider.awareness;

  ytext.observe((event) => {
    if (onUpdate) onUpdate(ytext.toString(), event);
  });
  ychat.observe((event) => {
    if (onChatUpdate) onChatUpdate(ychat.toJSON(), event);
  });

  return { ydoc, provider, ytext, ychat, awareness: myAwareness };
}

// Content ops — work with the shared Lexical document
function getText() { return ytext ? ytext.toString() : ''; }
function getLength() { return ytext ? ytext.length : 0; }
function append(text) {
  if (ytext) ytext.insert(ytext.length, '\n\n' + text);
}
function prepend(text) {
  if (ytext) ytext.insert(0, text + '\n\n');
}
function insertAt(pos, text) {
  if (ytext) ytext.insert(pos, text);
}

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

module.exports = { connect, getText, getLength, append, prepend, insertAt, setCursor, setSelection, getOthersCursor, disconnect };
