<template>
  <div>
    <div v-if="value.organization">
      {{value.organization}}
    </div>
    <div v-if="formattedName">
      {{formattedName}}
    </div>
    <invoice-address :value="value.address" v-if="value.address"/>
    <a :href="mailto" v-if="value.email">{{value.email}}</a>
    <div v-if="value.phone">
      {{value.phone}}
    </div>
  </div>
</template>

<script>
import InvoiceAddress from "~components/address"

export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedName() {
      if(this.value.name) {
        const name = this.value.name
        if(name.first && name.last)
          return `${name.first} ${name.last}`
        else if(name.first)
          return name.first
        else if(name.last)
          return name.last
        else
          return null
      } else
        return null
    },
    mailto() {
      return `mailto:${this.value.email}`
    }
  },
  components: {
    InvoiceAddress
  }
}
</script>
