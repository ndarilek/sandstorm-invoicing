<template>
  <tr>
    <td><input type="text" v-model="value.item"/></td>
    <td><input type="text" v-model="value.notes"/></td>
    <td><input type="number" v-model="value.hours"/></td>
    <td><currency-input v-model="value.rate"/></td>
    <td><currency :value="total"/></td>
  </tr>
</template>

<script>
import Currency from "~components/currency"
import CurrencyInput from "~components/currency/input"
import {total} from "~/lib/line-item"

export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  computed: {
    total() {
      console.log("value", this.value)
      return total(this.value)
    }
  },
  components: {
    Currency,
    CurrencyInput
  }
}
</script>

