<template>
  <div v-if="invoice">
    <h1>INVOICE</h1>
    <person :value="invoice.sender"/>
    <person :value="invoice.client"/>
    <dl>
      <dt>Amount Due</dt>
      <dd><currency :value="invoice.total.currency"/></dd>
      <dt>Date Due</dt>
      <dd>{{due}}</dd>
    </dl>
    <div class="table-responsive">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Item</th>
            <th>Notes</th>
            <th>Hours</th>
            <th>Hourly Rate</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody class="table-striped">
          <tr v-for="item in invoice.lineItems">
            <td>{{item.item}}</td>
            <td>{{item.notes}}</td>
            <td>{{item.hours}}</td>
            <td><span v-if="item.rate"><currency :value="item.rate"/></span></td>
            <td><currency :value="item.total"/></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex"
import Currency from "~components/currency"
import Person from "~components/person"

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState({
      invoice({invoices}) {
        return invoices.invoices[this.id]
      }
    }),
    due() {
      if(this.invoice && this.invoice.due)
        return new Date(this.invoice.due).toLocaleDateString()
      else
        return null
    }
  },
  methods: {
    ...mapActions({
      fetchInvoice: "invoices/fetchInvoice"
    })
  },
  created() {
    this.fetchInvoice(this.id)
  },
  components: {
    Currency,
    Person
  }
}
</script>
