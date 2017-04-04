<template>
  <invoice :id="$route.params.id"/>
</template>

<script>
import Invoice from "~components/invoice"

export default {
  async asyncData(context) {
    const id = context.params.id
    await context.store.dispatch("invoices/fetchInvoice", id)
    return {id, invoice: context.store.getters["invoices/invoices"][id]}
  },
  head() {
    return {
      title: `Invoice ${this.id}`
    }
  },
  components: {
    Invoice
  },
layout: "standalone"
}
</script>
