<template>
  <div>
    <nav>
      <ul class="nav">
        <li role="presentation"><a :href="standaloneHref" target="_blank">Standalone</a></li>
      </ul>
    </nav>
    <invoice :id="$route.params.id"/>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex"
import Invoice from "~components/invoice"

export default {
  computed: {
    ...mapState({
      autoUrl: ({sandstorm}) => sandstorm.autoUrl
    }),
    standaloneHref() {
      return `${this.autoUrl}/invoices/${this.$route.params.id}/`
    }
  },
  methods: mapActions({
    fetchPublicId: "sandstorm/fetchPublicId"
  }),
  mounted() {
    this.fetchPublicId()
  },
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
