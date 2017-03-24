<template>
  <span>$<input type="text" v-model="formattedValue" @input="input($event.target.value)"/></span>
</template>

<script>

export default {
  props: {
    value: {
      type: Number,
      default: () => 0.00
    }
  },
  computed: {
    formattedValue() {
      return (this.value/100).toFixed(2)
    }
  },
  methods: {
    input(value) {
      const amount = parseInt(parseFloat(value)*100)
      this.$emit("input", amount)
    }
  }
}
</script>
