import gql from "graphql-tag"
import _ from "lodash"
import Vue from "vue"

import {apolloClient} from "~/lib/apollo"
import {totalCurrency, totalHours} from "~/lib/invoice"
import {cleanup as cleanupPerson, personFragment} from "./people"

const invoiceFragment = gql`fragment invoice on Invoice {
  id
  sender {
    ...person
  }
  client {
    ...person
  }
  lineItems {
    item
    notes
    total {
      code
      amount
    }
  }
  total {
    hours
    currency {
      code
      amount
    }
  }
  created
  updated
}`

const newCurrency = (code) => ({code, amount: 0})

const newLineItem = (currencyCode) => ({
  item: "",
  notes: "",
  hours: 0,
  rate: newCurrency(currencyCode)
})

export default {
  state: {
    invoices: {},
    draft: {
      lineItems: []
    }
  },
  getters: {
    invoices: (state) => _.values(state.invoices),
    currencyCode: (state, getters, rootState) => rootState.settings.settings.defaultCurrencyCode,
    hasLineItems: (state) => state.draft.lineItems.length != 0,
    subtotal: (state) => totalCurrency(state.draft),
    totalHours: (state)=>  totalHours(state.draft)
  },
  mutations: {
    addInvoice: (state, invoice) => Vue.set(state.invoices, invoice.id, _.toPlainObject(invoice)),
    resetDraft: (state, payload) => state.draft = {
      lineItems: [],
      ...payload
    },
    addLineItem: (state, currencyCode) => {
      state.draft.lineItems.push(newLineItem(currencyCode))
    },
    removeLineItem: (state, index) => {
      state.draft.lineItems.splice(index, 1)
    },
    updateDraft: (state, draft) => state.draft = draft
  },
  actions: {
    initDraft: ({commit, getters, rootState}) => {
      commit("resetDraft", {
        client: rootState.people.client,
        sender: rootState.people.sender,
        lineItems: [newLineItem(getters.currencyCode)]
      })
    },
    saveDraftInvoice: async ({state, commit}) => {
      const invoice = state.draft
      invoice.client = cleanupPerson(invoice.client)
      invoice.sender = cleanupPerson(invoice.sender)
      const {data} = await apolloClient.mutate({
        mutation: gql`mutation($invoice: InvoiceInput!) {
          newInvoice(invoice: $invoice) {
            id
          }
        }`,
        variables: {
          invoice

        }
      })
      commit("updateDraft", data.newInvoice)
    },
    fetchInvoice: async ({commit}, id) => {
      const {data} = await apolloClient.query({
        query: gql`
          query($id: String!) {
            invoice(id: $id) {
              ...invoice
            }
          }
          ${personFragment}
          ${invoiceFragment}
        `,
        variables: {
          id
        },
        fetchPolicy: "network-only"
      })
      commit("addInvoice", data.invoice)
    },
    fetchInvoices: async ({commit}) => {
      const {data} = await apolloClient.query({
        query: gql`
          {
            invoices {
              ...invoice
            }
          }
          ${personFragment}
          ${invoiceFragment}
        `,
        fetchPolicy: "network-only"
      })
      data.invoices.forEach((v) => commit("addInvoice", v))
    }
  }
}
