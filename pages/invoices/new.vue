<template>
  <div>
    <h1>New Invoice</h1>
    <form @submit.prevent="save">
      <h2>Sender</h2>
      <person-input prefix="sender" v-model="invoice.sender" v-if="invoice.sender"/>
      <h2>Client</h2>
      <person-input prefix="client" v-model="invoice.client" v-if="invoice.client"/>
      <div class="form-group" v-if="currencyCode">
        <label for="currencyCode">Currency</label>
        <currency-selector v-model="currencyCode"/>
      </div>
      <div class="table-responsive">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Type</th>
              <th>Item</th>
              <th>Notes</th>
              <th>Hours</th>
              <th>Hourly Rate</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody class="table-striped" v-if="hasLineItems">
            <template v-for="item, index in invoice.lineItems">
              <line-item-input v-model="item" :index="index" :currencyCode="currencyCode" :key="index"/>
            </template>
            <tr>
              <td/>
              <td>Subtotal</td>
              <td/>
              <td>{{totalHours}}</td>
              <td/>
              <td><currency :value="subtotal"/></td>
            </tr>
          </tbody>
        </table>
      </div>
      <button class="btn" @click.prevent="addLineItem">Add Line Item</button>
      <button type="submit" class="btn btn-default">Save</button>
    </form>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from "vuex"
import Currency from "~components/currency"
import CurrencySelector from "~components/currency/selector"
import LineItemInput from "~components/line-item/input"
import PersonInput from "~components/person/input"

export default {
  methods: {
    ...mapActions({
      fetchClient: "people/fetchClient",
      fetchSender: "people/fetchSender",
      fetchSettings: "settings/fetchSettings",
      saveDraftInvoice: "invoices/saveDraftInvoice",
      initDraft: "invoices/initDraft"
    }),
    ...mapMutations({
      addLineItemToState: "invoices/addLineItem",
      updateDraft: "invoices/updateDraft"
    }),
    addLineItem() {
      this.addLineItemToState(this.currencyCode)
    },
    save() {
      this.saveDraftInvoice()
      .then(() => {
        this.$router.push({name: "invoices-id", params: {id: this.invoice.id}})
        this.initDraft()
      })
    }
  },
  computed: {
    ...mapState({
      client: ({people}) => people.client,
      sender: ({people}) => people.sender,
      draft: ({invoices}) => invoices.draft,
      currencyCode: ({settings}) => settings.settings.defaultCurrencyCode
    }),
    ...mapGetters({
      hasLineItems: "invoices/hasLineItems",
      subtotal: "invoices/subtotal",
      totalHours: "invoices/totalHours"
    }),
    invoice: {
      get() { return this.draft },
      set(value) { this.updateDraft(value) }
    }
  },
  created() {
    this.fetchClient()
      .then(() => this.fetchSender())
      .then(() => this.fetchSettings())
      .then(() => this.initDraft())
  },
  head: {
    title: "New Invoice"
  },
  components: {
    Currency,
    CurrencySelector,
    LineItemInput,
    PersonInput
  }
}
</script>
