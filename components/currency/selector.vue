<template>
  <select>
    <option v-for="code in codes" value="code">{{code}}</option>
  </select>
</template>

<script>
import {mapActions, mapState} from "vuex"

export default {
  props: {
    value: {
      type: String,
      required: true
    }
  },
  computed: mapState({
    codes: ({settings}) => settings.currencyCodes
  }),
  methods: mapActions({
    fetchCurrencyCodes: "settings/fetchCurrencyCodes"
  }),
  created() {
    this.fetchCurrencyCodes()
  }
}
</script>
