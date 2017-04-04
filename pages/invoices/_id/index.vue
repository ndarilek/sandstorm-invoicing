<template>
  <div>
    <nav>
      <ul>
        <li role="presentation"><router-link :to="{name: 'invoices-id-standalone', params: {id: this.$route.params.id}}">Standalone</router-link></li>
      </ul>
    </nav>
    <invoice :id="$route.params.id"/>
  </div>
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
