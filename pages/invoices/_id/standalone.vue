<template>
  <invoice :id="$route.params.id"/>
</template>

<script>
import Invoice from "~components/invoice"

export default {
  async asyncData(context) {
    const id = context.params.id
    await context.store.dispatch("invoices/fetchInvoice", id)
    return {invoice: context.store.getters["invoices/invoices"][id]}
  },
  head: {
    title: "Invoice"
  },
  components: {
    Invoice
  },
layout: "standalone"
}
</script>
