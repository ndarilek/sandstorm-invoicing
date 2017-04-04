<template>
  <div>
    <nav>
      <ul class="nav">
        <li role="presentation"><router-link :to="{name: 'invoices-id-standalone', params: {id: this.$route.params.id}}">Standalone</router-link></li>
      </ul>
    </nav>
    <invoice :id="$route.params.id"/>
  </div>
</template>

<script>
import Invoice from "~components/invoice"

export default {
  head() {
    return {
      title: `Invoice ${this.$route.params.id}`
    }
  },
  components: {
    Invoice
  }
}
</script>
