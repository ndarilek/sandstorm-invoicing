<template>
  <div>
    <h1>New Invoice</h1>
    <form @submit.prevent="save">
      <h2>Sender</h2>
      <person-input prefix="sender" v-model="sender"/>
      <h2>Client</h2>
      <person-input prefix="client" v-model="client"/>
      <h2>Line Items</h2>
      <div class="table-responsive">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Item</th>
              <th>Notes</th>
              <th>Hours</th>
              <th>Hourly Rate</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody class="table-striped" v-for="item in lineItems">
            <line-item-input v-model="item.value"/>
            <tr>
              <td>Subtotal</td>
              <td/>
              <td>{{totalHours}}</td>
              <td/>
              <td><currency :value="subtotal"/></td>
            </tr>
          </tbody>
        </table>
      </div>
      <button type="submit" class="btn btn-default">Save</button>
    </form>
  </div>
</template>

<script>
import _ from "lodash"
import gql from "graphql-tag"
import Currency from "~components/currency"
import LineItemInput from "~components/line-item/input"
import PersonInput from "~components/person/input"
import {total} from "~/lib/line-item"
import {newPerson} from "~/lib/person"

const newCurrency = () => ({
  code: "USD"
})

const newLineItem = () => ({
  item: "",
  notes: "",
  hours: 0,
  rate: newCurrency(),
  total: newCurrency()
})

export default {
  data: () => ({
    client: newPerson(),
    sender: newPerson(),
    lineItems: [{value: newLineItem()}]
  }),
  apollo: {
    client: {
      query: gql`{
        client {
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
      }`
    },
    sender: {
      query: gql`{
        sender {
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
      }`
    }
  },
  computed: {
    totalHours() {
      return _.sum(this.lineItems.map((v) => v.value.hours))
    },
    subtotal() {
      return _.sum(this.lineItems.map((v) => {
        return total(v.value)
      }))
    }
  },
  head: {
    title: "New Invoice"
  },
  components: {
    Currency,
    LineItemInput,
    PersonInput
  }

}

</script>
