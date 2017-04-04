<template>
  <div>
    <div v-if="value.line1">
      {{value.line1}}
    </div>
    <div v-if="value.line2">
      {{value.line2}}
    </div>
    {{lastLine}}
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  computed: {
    lastLine() {
      if(this.value.city && this.value.state && this.value.postalCode)
        return `${this.value.city}, ${this.value.state} ${this.value.postalCode}`
      else
        return ""
    }
  }
}
</script>
