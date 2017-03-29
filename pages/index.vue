<template>
  <div>
    <div v-if="!loading">
      <h1>Invoices</h1>
      <router-link :to="{name: 'new'}">New</router-link>
      <div class="table-responsive">
        <table class="table table-bordered">
          <thead>
            <tr>
            </tr>
          </thead>
          <tbody class="table-striped">
            <tr/>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag"

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
    }
  },
  data: () => ({
    loadingQueriesCount: 0,
    client: null,
    sender: null,
    settings: null
  }),
  computed: {
    loading() {
      return !(this.client && this.sender && this.settings)
    }
  },
  head: {
    title: "Invoices"
  }
}

</script>
