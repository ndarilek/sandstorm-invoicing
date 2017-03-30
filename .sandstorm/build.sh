#!/bin/bash
set -euo pipefail
export CXX=clang++
cd /opt/app
yarn install
npm run build
