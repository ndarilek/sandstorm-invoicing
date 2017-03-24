import Promise from "bluebird"
import Nuxt from "nuxt"
import bodyParser from "body-parser"
import Express from "express"
import promiseMiddleware from "express-promise"
const fs = Promise.promisifyAll(require("fs"))
import {GraphQLScalarType} from "graphql"
import {Kind} from "graphql/language"
import {graphiqlExpress, graphqlExpress} from "graphql-server-express"
import {makeExecutableSchema} from "graphql-tools"
import "isomorphic-fetch"
import Datastore from "nedb"

const baseDir = () => {
  if(process.env.SANDSTORM)
    return "/var"
  else
    return "./var"
}

const dbDir = `${baseDir()}/db`

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
  defaultCurrencyCode: CurrencyCode!
}

input SettingsInput {
  defaultCurrencyCode: CurrencyCode!
}

type Currency {
  code: CurrencyCode!
  amount: Float!
}

interface LineItem {
  total: Currency!
}

type TimeLineItem implements LineItem {
  hours: Int!
  rate: Currency!
  total: Currency!
}

scalar Date

type Invoice {
  sender: Person!
  client: Person!
  due: Date
  lineItems: [LineItem]
  total: Currency!
  created: Date!
  updated: Date!
}

type Query {
  client: Person
  sender: Person
  settings: Settings
}

type Mutation {
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
  Person: {
    id: (doc) => doc._id
  },
  LineItem: {
    __resolveType(obj, context, info) {
      if(obj.hours)
        return "TimeLineItem"
      return null
    }
  },
  Query: {
    client: () => People.findOneAsync({type: "client"}),
    sender: () => People.findOneAsync({type: "sender"}),
    settings: () => Settings.findOneAsync()
  },
  Mutation: {
    updateClient(root, {person}) {
      return People.updateAsync({type: "client"}, {type: "client", ...person}, {upsert: true})
      .then(() => People.findOneAsync({type: "client"}))
    },
    updateSender(root, {person}) {
      return People.updateAsync({type: "sender"}, {type: "sender", ...person}, {upsert: true})
      .then(() => People.findOneAsync({type: "sender"}))
    },
    updateSettings(root, {settings}) {
      return Settings.findOneAsync()
      .then((s) => {
        if(s)
          return Settings.updateAsync({_id: s._id}, settings)
          .then(() => Settings.findOneAsync())
        else
          return Settings.insert(settings)
          .then(() => Settings.findOneAsync())
      })
    }
  }
}

const app = new Express()

const server = require("http").createServer(app)
const host = process.env.HOST || "127.0.0.1"
const port = process.env.PORT || "8000"

app.set("port", port)

const schema = makeExecutableSchema({resolvers, typeDefs})

const formatError = console.error

app.use("/api", bodyParser.json(), graphqlExpress({formatError, schema}))

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

if(!fs.existsSync(baseDir()))
  fs.mkdirSync(baseDir())

if(!fs.existsSync(dbDir))
  fs.mkdirSync(dbDir)

server.listen(port, host, () => {
  console.log(`Server listening on ${host}:${port}`)
})
