#!/bin/bash
set -euo pipefail
cd /opt/app
HOME=/tmp NODE_ENV=production npm start
