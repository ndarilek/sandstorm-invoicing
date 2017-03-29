<template>
  <div>
    <h1>New Invoice</h1>
    <form @submit.prevent="save">
      <h2>Sender</h2>
      <person-input prefix="sender" v-model="sender"/>
      <h2>Client</h2>
      <person-input prefix="client" v-model="client"/>
      <div class="form-group">
        <label for="currencyCode">Currency</label>
        <currency-selector v-model="currencyCode"/>
      </div>
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
          <tbody class="table-striped">
            <template v-for="item, index in lineItems">
              <line-item-input v-model="item.value" :index="index" @removed="removeLineItem(index)" :key="index"/>
            </template>
            <tr v-if="hasLineItems">
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
import CurrencySelector from "~components/currency/selector"
import LineItemInput from "~components/line-item/input"
import PersonInput from "~components/person/input"
import {total} from "~/lib/line-item"
import {newPerson} from "~/lib/person"

const newCurrency = (code) => ({code})

const newLineItem = (currencyCode) => ({
  item: "",
  notes: "",
  hours: 0,
  rate: newCurrency(currencyCode),
  total: newCurrency(currencyCode)
})

export default {
  data: () => ({
    client: newPerson(),
    sender: newPerson(),
    currencyCode: "",
    lineItems: []
  }),
  apollo: {
    client: {
      query: gql`{
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
      }`
    },
    sender: {
      query: gql`{
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
      }`
    },
    currencyCode: {
      query: gql`{
        settings {
          defaultCurrencyCode
        }
      }`,
      update: (data) => data.settings.defaultCurrencyCode,
      result(data) {
        this.lineItems = [{value: newLineItem(data.settings.defaultCurrencyCode)}]
      }
    }
  },
  methods: {
    removeLineItem: (index) => this.lineItems.splice(index, 1)
  },
  computed: {
    hasLineItems() {
      return this.lineItems.length != 0
    },
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
    CurrencySelector,
    LineItemInput,
    PersonInput
  }
}

</script>
