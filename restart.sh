#!/bin/bash
fuser -k 3000/tcp 2>/dev/null; fuser -k 4096/tcp 2>/dev/null
kill $(lsof -ti :3000) 2>/dev/null; kill $(lsof -ti :4096) 2>/dev/null
kill $(pgrep -f "cloudflared.*cristio") 2>/dev/null
sleep 1

cd ~/.adam
node server.js &>/tmp/adam-server.log &
echo "Server started (PID $(lsof -ti :3000))"

cloudflared tunnel --config ~/.adam/config/cristio-tunnel.yml run &>/tmp/cristio-tunnel.log &
sleep 3
echo "Tunnel started (PID $(pgrep -f 'cloudflared.*cristio'))"
