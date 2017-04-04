<template>
  <div>
    <h1>Invoices</h1>
    <router-link :to="{name: 'invoices-new'}">New</router-link>
    <div class="table-responsive" v-if="invoices">
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
            <td><currency :value="invoice.total.currency"/></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapState, mapMutations} from "vuex"
import Currency from "~components/currency"

export default {
  computed: {
    ...mapState({
      client: ({people}) => people.client,
      sender: ({people}) => people.sender,
      settings: ({settings}) => settings.settings
    }),
    ...mapGetters({
      invoices: "invoices/invoices"
    })
  },
  methods: mapActions({
    fetchClient: "people/fetchClient",
    fetchSender: "people/fetchSender",
    fetchSettings: "settings/fetchSettings",
    fetchInvoices: "invoices/fetchInvoices"
  }),
  mounted() {
    this.fetchClient()
      .then(() => this.fetchSender())
      .then(() => this.fetchSettings())
      .then(() => this.fetchInvoices())
      .then(() => {
        if(!this.client || !this.client.id || !this.sender || !this.sender.id || !this.settings)
          this.$router.push({name: "settings"})
      })
  },
  components: {
    Currency
  },
  head: {
    title: "Invoices"
  }
}

</script>
