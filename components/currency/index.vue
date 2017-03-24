<template>
  <component :is="input" :amount="value.amount""/>">
</template>

<script>
import usd from "./usd"

export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  computed: {
    input() {
      if(this.value.code == "USD")
        return usd
      else
        return null
    }
  },
  components: {
    usd
  }
}
</script>
