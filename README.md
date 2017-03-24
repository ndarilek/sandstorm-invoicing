# Sandstorm Invoicing

This [Sandstorm](https://sandstorm.io) package implements a basic client invoicing system. Eventual planned features include:

 * Multiple currency support.
 * API for other grains to programatically create invoices.
 * Static web publishing of invoices.
 * PDF export.
 * Emailing invoice notifications.

Note that this is in *very* early development and not yet useful.

## Development

### Running Locally

To quickly test, run:

    npm install # or yarn install
    npm run dev

Connect to the app at http://localhost:8000.

### In Sandstorm

This is not currently supported, but will be soon.

Use [vagrant-spk](https://github.com/sandstorm-io/vagrant-spk), a tool designed to help app developers package apps for [Sandstorm](https://sandstorm.io).

#### Prerequisites

You will need to install:
- [Vagrant](https://www.vagrantup.com/)
- [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
- Git

#### Step by Step

```
git clone https://github.com/sandstorm-io/vagrant-spk
git clone https://github.com/ndarilek/sandstorm-invoicing
export PATH=$(pwd)/vagrant-spk:$PATH
cd sandstorm-invoicing
vagrant-spk vm up
vagrant-spk dev
```

visit [http://local.sandstorm.io:6080/](http://local.sandstorm.io:6080/).
