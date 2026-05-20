#!/bin/bash
cd ~/.adam
bash restart.sh
while true; do
    node adam.js
    status=$?
    [ $status -eq 42 ] || break
    bash restart.sh
done
