<template>
  <select>
    <option v-for="code in codes" value="code">{{code}}</option>
  </select>
</template>

<script>
import gql from "graphql-tag"

export default {
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data: () => ({
    codes: []
  }),
  apollo: {
    codes: {
      query: gql`{
        __type(name: "CurrencyCode") {
          enumValues {
            name
          }
        }
      }`,
      update(data) {
        return data.__type.enumValues.map((v) => v.name)
      }
    }
  }
}
</script>
