<template>
  <div>
    <div v-if="!loading">
      <h1>Invoices</h1>
      <router-link :to="{name: 'invoices-new'}">New</router-link>
      <div class="table-responsive">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date Issued</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody class="table-striped">
            <tr v-for="invoice in invoices">
              <td><router-link :to="{name: 'invoices-id', params: {id: invoice.id}}">{{invoice.id}}</router-link></td>
              <td>{{new Date(invoice.created).toLocaleDateString()}}</td>
              <td><currency :value="invoice.total"/></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag"
import Currency from "~components/currency"

export default {
  apollo: {
    client: {
      query: gql`{
        client {
          id
        }
      }`,
      result(data) {
        if(!data.client)
          this.$router.push({name: "settings"})
      },
      pollInterval: 1000,
    },
    sender: {
      query: gql`{
        sender {
          id
        }
      }`,
      result(data) {
        if(!data.sender)
          this.$router.push({name: "settings"})
      },
      pollInterval: 1000,
    },
    settings: {
      query: gql`{
        settings {
          defaultCurrencyCode
        }
      }`,
      result(data) {
        if(!data.settings)
          this.$router.push({name: "settings"})
      },
      pollInterval: 1000,
    },
    invoices: {
      query: gql`{
        invoices {
          id
          created
          total {
            code
            amount
          }
        }
      }`,
      updateInterval: 1000
    }
  },
  data: () => ({
    loadingQueriesCount: 0,
    client: null,
    sender: null,
    settings: null,
    invoices: []
  }),
  computed: {
    loading() {
      return !(this.client && this.sender && this.settings)
    }
  },
  components: {
    Currency
  },
  head: {
    title: "Invoices"
  }
}

</script>
