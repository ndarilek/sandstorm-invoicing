import gql from "graphql-tag"
import _ from "lodash"
import {apolloClient} from "~/lib/apollo"

export const personFragment = gql`
  fragment person on Person {
    id
    organization
    name {
      first
      last
    }
    email
    address {
      line1
      line2
      city
      state
      postalCode
    }
    phone
  }
`

const newPerson = () => ({
  organization: "",
  name: {
    first: "",
    last: ""
  },
  email: "",
  address: {
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: ""
  },
  phone: ""
})

export const cleanup = (person) => {
  person = _.toPlainObject(person)
  delete person.id
  delete person.__typename
  person.name = _.toPlainObject(person.name)
  delete person.name.__typename
  person.address = _.toPlainObject(person.address)
  delete person.address.__typename
  return person
}

export default {
  state: {
    client: newPerson(),
    sender: newPerson()
  },
  mutations: {
    setClient: (state, client) => state.client = _.toPlainObject(client),
    setSender: (state, sender) => state.sender = _.toPlainObject(sender)
  },
  actions: {
    async fetchClient({commit}) {
      const {data} = await apolloClient.query({
        query: gql`
          {
            client {
              ...person
            }
          }
          ${personFragment}
        `,
        fetchPolicy: "network-only"
      })
      let person = data.client
      if(!person)
        person = newPerson()
      commit("setClient", person)
    },
    async fetchSender({commit}) {
      const {data} = await apolloClient.query({
        query: gql`
          {
            sender {
              ...person
            }
          }
          ${personFragment}
        `,
        fetchPolicy: "network-only"
      })
      let person = data.sender
      if(!person)
        person = newPerson()
      commit("setSender", person)
    },
    async updateClient({commit}, client) {
      client = cleanup(client)
      const {data} = await apolloClient.mutate({
        mutation: gql`
          mutation($person: PersonInput!) {
            updateClient(person: $person) {
              ...person
            }
          }
          ${personFragment}
        `,
        variables: {
          person: client
        }
      })
      commit("setClient", data.updateClient)
    },
    async updateSender({commit}, sender) {
      sender = cleanup(sender)
      const {data} = await apolloClient.mutate({
        mutation: gql`
          mutation($person: PersonInput!) {
            updateSender(person: $person) {
              ...person
            }
          }
          ${personFragment}
        `,
        variables: {
          person: sender
        }
      })
      commit("setSender", data.updateSender)
    }
  }
}
