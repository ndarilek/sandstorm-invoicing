import bodyParser from "body-parser"
import Promise from "bluebird"
import {exec} from "child_process"
import Express from "express"
import {GraphQLScalarType} from "graphql"
import {Kind} from "graphql/language"
import {graphiqlExpress, graphqlExpress} from "graphql-server-express"
import {makeExecutableSchema} from "graphql-tools"
import "isomorphic-fetch"
import _ from "lodash"
import mkdirp from "mkdirp"
import Datastore from "nedb"
import Nuxt from "nuxt"

import {dbDir, staticDir} from "./lib/dirs"
import {totalCurrency, totalHours} from "./lib/invoice"
import {total as lineItemTotal} from "./lib/line-item"


const Invoices = Promise.promisifyAll(new Datastore({
  filename: `${dbDir}/invoices`,
  autoload: true
}))

const People = Promise.promisifyAll(new Datastore({
  filename: `${dbDir}/people`,
  autoload: true
}))

const Settings = Promise.promisifyAll(new Datastore({
  filename: `${dbDir}/settings`,
  autoload: true
}))

const GraphQLDate = new GraphQLScalarType({
  name: "Date",
  description: "Date type",
  parseValue: (value) => new Date(value),
  serialize: (value) => value.getTime(),
  parseLiteral(ast) {
    if(ast.kind == Kind.INT)
      return parseInt(ast.value, 10)
    return null
  }
})

const typeDefs = `

type Name {
  first: String
  last: String
}

input NameInput {
  first: String
  last: String
}

type Address {
  line1: String
  line2: String
  city: String
  state: String
  postalCode: String
}

input AddressInput {
  line1: String
  line2: String
  city: String
  state: String
  postalCode: String
}

enum CurrencyCode {
  USD
}

type Person {
  id: String!
  organization: String
  name: Name
  email: String
  address: Address
  phone: String
  currencyCode: CurrencyCode
}

input PersonInput {
  organization: String
  name: NameInput
  email: String
  address: AddressInput
  phone: String
}

type Settings {
  daysBeforeDue: Int!
  defaultCurrencyCode: CurrencyCode!
}

input SettingsInput {
  daysBeforeDue: Int!
  defaultCurrencyCode: CurrencyCode!
}

type Currency {
  code: CurrencyCode!
  amount: Float!
}

input CurrencyInput {
  code: CurrencyCode!
  amount: Float!
}

interface LineItem {
  item: String!
  notes: String!
  total: Currency!
}

type FixedLineItem implements LineItem {
  item: String!
  notes: String!
  total: Currency!
}

type TimeLineItem implements LineItem {
  item: String!
  notes: String!
  hours: Int!
  rate: Currency!
  total: Currency!
}

input LineItemInput {
  item: String!
  notes: String!
  hours: Int
  rate: CurrencyInput
  total: CurrencyInput
}

scalar Date

type Total {
  hours: Int!
  currency: Currency!
}

type Invoice {
  id: String!
  client: Person!
  sender: Person!
  lineItems: [LineItem]
  total: Total!
  due: Date!
  created: Date!
  updated: Date!
}

input InvoiceInput {
  client: PersonInput!
  sender: PersonInput!
  lineItems: [LineItemInput]
  due: Date!
}

type Query {
  client: Person
  invoice(id: String!): Invoice
  invoices: [Invoice]
  sender: Person
  settings: Settings
}

type Mutation {
  newInvoice(invoice: InvoiceInput!): Invoice!
  updateClient(person: PersonInput): Person!
  updateSender(person: PersonInput): Person!
  updateSettings(settings: SettingsInput!): Settings!
}

schema {
  query: Query
  mutation: Mutation
}

`

const resolvers = {
  Date: GraphQLDate,
  Invoice: {
    id: (doc) => doc._id,
    total: (doc) => {
      const hours = totalHours(doc)
      const currency = totalCurrency(doc)
      return {hours, currency}
    }
  },
  Person: {
    id: (doc) => doc._id
  },
  LineItem: {
    __resolveType(obj, context, info) {
      if(obj.hours != null)
        return "TimeLineItem"
      return "FixedLineItem"
    }
  },
  TimeLineItem: {
    total: (doc) => lineItemTotal(doc)
  },
  Settings: {
    daysBeforeDue: ({daysBeforeDue}) => {
      return(daysBeforeDue ? daysBeforeDue : 30)
    },
    defaultCurrencyCode: ({defaultCurrencyCode}) => {
      return(defaultCurrencyCode ? defaultCurrencyCode : "USD")
    }
  },
  Query: {
    client: () => People.findOneAsync({type: "client"}),
    invoice: (doc, {id}) => Invoices.findOneAsync({_id: id}),
    invoices: () => Invoices.findAsync({}),
    sender: () => People.findOneAsync({type: "sender"}),
    settings: () => Settings.findOneAsync({})
  },
  Mutation: {
    async newInvoice(root, {invoice}) {
      const client = await People.findOneAsync({type: "client"})
      const sender = await People.findOneAsync({type: "sender"})
      invoice.client._id = client._id
      invoice.sender._id = sender._id
      const now = new Date()
      return Invoices.insertAsync({...invoice, created: now, updated: now})
        .then((invoice) => {
          const invoiceDir = `${staticDir}/invoices/${invoice._id}`
          mkdirp.sync(invoiceDir)
          const invoiceFile = `${invoiceDir}/index.html`
          const url = `http://127.0.0.1:8000/invoices/${invoice._id}/standalone`
          const cmd = `curl ${url} -o ${invoiceFile}`
          console.log("cmd", cmd)
          exec(cmd, () => {
            exec(`perl -p -i -e 's/<script.*?script>//gs' ${invoiceFile}`)
          })
          return invoice
        })
    },
    updateClient(root, {person}) {
      return People.updateAsync({type: "client"}, {type: "client", ...person}, {upsert: true})
      .then(() => People.findOneAsync({type: "client"}))
    },
    updateSender(root, {person}) {
      return People.updateAsync({type: "sender"}, {type: "sender", ...person}, {upsert: true})
      .then(() => People.findOneAsync({type: "sender"}))
    },
    updateSettings(root, {settings}) {
      return Settings.findOneAsync({})
      .then((s) => {
        if(s)
          return Settings.updateAsync({_id: s._id}, settings)
        else
          return Settings.insertAsync(settings)
      }).then(() => Settings.findOneAsync({}))
    }
  }
}

const app = new Express()

const server = require("http").createServer(app)
const host = process.env.HOST || "0.0.0.0"
const port = process.env.PORT || "8000"

app.set("port", port)

const schema = makeExecutableSchema({resolvers, typeDefs})

const formatError = console.error

app.use(
  "/api",
  bodyParser.json(),
  graphqlExpress(req => ({
    schema,
    context: {sandstorm: req.sandstorm},
    formatError,
  }))
)

app.use("/graphiql", graphiqlExpress({
  endpointURL: "/api"
}))

// Import and Set Nuxt.js options
let config = require("./nuxt.config.js")
config.dev = !(process.env.NODE_ENV === "production")

// Init Nuxt.js
const nuxt = new Nuxt(config)
app.use(nuxt.render)

// Build only in dev mode
if (config.dev) {
  nuxt.build()
  .catch((error) => {
    console.error(error) // eslint-disable-line no-console
    process.exit(1)
  })
}

server.listen(port, host)
