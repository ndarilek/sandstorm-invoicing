<template>
  <div>
    <h1>Settings</h1>
    <form @submit.prevent="save">
      <h2>Sender</h2>
      <person-input prefix="sender" v-model="sender"/>
      <h2>Client</h2>
      <person-input prefix="client" v-model="client"/>
      <button type="submit" class="btn btn-default">Save</button>
    </form>
  </div>
</template>

<script>
  import _ from "lodash"
  import gql from "graphql-tag"
  import PersonInput from "~components/person/input"
  import {newPerson} from "~/lib/person"

  export default {
    data: () => ({
      sender: newPerson(),
      client: newPerson()
    }),
    apollo: {
      client: {
        query: gql`{
          client {
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
        }`,
        update(data) {
          if(data.client) {
            return data.client
          } else
            return newPerson()
        }
      },
      sender: {
        query: gql`{
          sender {
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
        }`,
        update(data) {
          if(data.sender) {
            return data.sender
          } else
            return newPerson()
        }
      }
    },
    methods: {
      save() {
        const client = _.toPlainObject(this.client)
        delete client.__typename
        const sender = _.toPlainObject(this.sender)
        delete sender.__typename
        this.$apollo.mutate({
          mutation: gql`mutation($client: PersonInput!, $sender: PersonInput!) {
            updateClient(person: $client) {
              id
            }
            updateSender(person: $sender) {
              id
            }
          }`,
          variables: {
            client,
            sender
          }
        }).then((response) => {
          console.log(response)
        })
      }
    },
    head: {
      title: "Settings"
    },
    components: {PersonInput}
  }

</script>
