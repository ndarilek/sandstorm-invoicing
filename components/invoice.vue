<template>
  <div v-if="invoice">
    <h1>INVOICE</h1>
    <person :value="invoice.sender"/>
    <person :value="invoice.client"/>
    <p>Amount Due: <currency :value="invoice.total"/></p>
    <div class="table-responsive">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Item</th>
            <th>Notes</th>
            <th>Hours</th>
            <th>Hourly Rate</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody class="table-striped">
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag"
import Currency from "~components/currency"
import Person from "~components/person"

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data: () => ({
    invoice: null
  }),
  apollo: {
    invoice() {
      return {
        query: gql` query($id: String!) {
          invoice(id: $id) {
            id
            client {
              id
              organization
              name {
                first
                last
              }
              email
              address {
                line1
                line2
                city
                state
                postalCode
              }
              phone
            }
            sender {
              id
              organization
              name {
                first
                last
              }
              email
              address {
                line1
                line2
                city
                state
                postalCode
              }
              phone
            }
            total {
              code
              amount
            }
          }
        }`,
        variables: {
          id: this.id
        },
        pollInterval: 1000
      }
    }
  },
  head: {
    title: "Invoice"
  },
  components: {
    Currency,
    Person
  }
}
</script>
