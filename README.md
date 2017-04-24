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

For best results, run everything inside a [Vagrant](https://vagrantup.com) environment to ensure that you're using the correct version of Node and have all native dependencies.

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
vagrant-spk vm ssh #You're now SSH'd to the VM.
cd /opt/app
yarn install
yarn run dev
```

Connect to the app at http://localhost:8000.

### In Sandstorm

Follow all above steps until `vagrant-spk vm ssh`. Instead, run:

```
vagrant-spk dev
```

visit [http://local.sandstorm.io:6080/](http://local.sandstorm.io:6080/).

## Adding a Currency

Here are the steps needed to add support for additional currencies:

#### Decide on a Model

Because floating point math is bad for currency, it is best to store amounts as an integer and convert to decimals for user input and output. USD values, for instance, are stored as values in cents, then converted to and from dollars when read or written. You'll need to model your currency in a similar way. Note that changing this model later is currently difficult or impossible, but if you track amounts in the smallest real value (I.e. no fractional cents) you're probably fine.

#### Add a CurrencyCode to the API

Start by editing _server.js_ and adding your currency code. For instance, if you're adding Sillycoin with a code of _SLC_, you might do the following:

```
enum CurrencyCode {
  SLC
  ...
  USD
}
```

#### Create Input and Output Components

Next, you'll create an *input component* for reading currency values from forms, then converting them into integer values for persistence. You'll also create an *output component* for reading an integer from the API and formatting it for display. Perhaps the easiest way to do this is by copying an existing component set:

`cp -R components/currency/usd components/currency/slc`

Then edit the directory contents to ensure that the correct currency sign is used and placed correctly, and that values are converted to and from integers.

#### Integrate Components

With your components created, you must now tell the main currency input and output components which codes your components match up with. Start by editing _components/currency/input.vue_. Import your input component:

```
import slc from "./slc/input"
import usd from "./usd/input"
```

Then, edit the `input` function as shown:

```
    input() {
      if(this.value.code == "SLC")
        return slc
      else if(this.value.code == "USD")
        return usd
      else
        return null
    }
```

Finally, add your component to the template's component list:

```
  components: {
    slc,
    usd
  }
```

Make similar changes to _components/currency/index.vue_, only this time you'll update the `output` function since this is an *output component*.
