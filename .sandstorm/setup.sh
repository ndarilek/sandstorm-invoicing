#!/bin/bash

set -euo pipefail

apt-get update

curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
apt-get install -y nodejs
npm install -g yarn

if [ ! -e /usr/local/bin/capnp ] ; then
    sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -q clang autoconf pkg-config libtool git
    cd /tmp
    if [ ! -e capnproto ]; then git clone https://github.com/sandstorm-io/capnproto; fi
    cd capnproto
    git checkout master
    cd c++
    autoreconf -i
    ./configure
    make -j2
    sudo make install
fi
