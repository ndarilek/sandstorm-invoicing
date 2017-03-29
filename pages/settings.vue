<template>
  <div>
    <h1>Settings</h1>
    <form @submit.prevent="save">
      <h2>Sender</h2>
      <person-input prefix="sender" v-model="sender"/>
      <h2>Client</h2>
      <person-input prefix="client" v-model="client"/>
      <h2>Miscellaneous</h2>
      <div class="form-group">
        <label for="defaultCurrencyCode">Default currency</label>
        <currency-selector v-model="settings.defaultCurrencyCode"/>
      </div>
      <button type="submit" class="btn btn-default">Save</button>
    </form>
  </div>
</template>

<script>
  import _ from "lodash"
  import gql from "graphql-tag"
  import CurrencySelector from "~components/currency/selector"
  import PersonInput from "~components/person/input"
  import {newPerson} from "~/lib/person"

  const newSettings = () => ({
    defaultCurrencyCode: "USD"
  })

  export default {
    data: () => ({
      client: newPerson(),
      sender: newPerson(),
      settings: newSettings()
    }),
    apollo: {
      client: {
        query: gql`{
          client {
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
        }`,
        update(data) {
          if(data.sender) {
            return data.sender
          } else
            return newPerson()
        }
      },
      settings: {
        query: gql`{
          settings {
            defaultCurrencyCode
          }
        }`,
        update(data) {
          if(data.settings) {
            return data.settings
          } else
            return newSettings()
        }
      }
    },
    methods: {
      save() {
        const cleanupPerson = (r) => {
          delete r.id
          delete r.__typename
          r.name = _.toPlainObject(r.name)
          delete r.name.__typename
          r.address = _.toPlainObject(r.address)
          delete r.address.__typename
          return r
        }
        const client = cleanupPerson(_.toPlainObject(this.client))
        const sender = cleanupPerson(_.toPlainObject(this.sender))
        const settings = _.toPlainObject(this.settings)
        delete settings.__typename
        this.$apollo.mutate({
          mutation: gql`mutation($client: PersonInput!, $sender: PersonInput!, $settings: SettingsInput!) {
            updateClient(person: $client) {
              id
            }
            updateSender(person: $sender) {
              id
            }
            updateSettings(settings: $settings) {
              defaultCurrencyCode
            }
          }`,
          variables: {
            client,
            sender,
            settings
          }
        }).then(() => {
          this.$apollo.client.resetStore()
          this.$router.push({name: "index"})
        })
      }
    },
    head: {
      title: "Settings"
    },
    components: {
      CurrencySelector,
      PersonInput
    }
  }

</script>
