<template>
  <invoice :id="$route.params.id"/>
</template>

<script>
import Invoice from "~components/invoice"

export default {
  head: {
    title: "Invoice"
  },
  components: {
    Invoice
  }
}
</script>
