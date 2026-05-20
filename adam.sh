#!/bin/bash
cd ~/.adam
while true; do
    node adam.js
    status=$?
    [ $status -eq 42 ] || break
done
