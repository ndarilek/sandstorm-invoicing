<template>
  <tr>
    <td><input type="text" v-model="value.item"/></td>
    <td><input type="text" v-model="value.notes"/></td>
    <td><input type="number" v-model="value.hours" min="0"/></td>
    <td><currency-input v-model="value.rate"/></td>
    <td><currency :value="total"/></td>
    <td><button class="btn" @click="remove">Remove</button></td>
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
    },
    index: {
      type: Number,
      required: true
    }
  },
  methods: {
    remove() {
      this.$emit("removed", this.index)
    },
  },
  computed: {
    total() {
      return total(this.value)
    }
  },
  components: {
    Currency,
    CurrencyInput
  }
}
</script>
