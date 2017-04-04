import _ from "lodash"
import gql from "graphql-tag"
import {apolloClient} from "~/lib/apollo"

const settingsFragment = gql`fragment settings on Settings {
  defaultCurrencyCode
}`

const newSettings = () => ({
  defaultCurrencyCode: "USD"
})

export default {
  state: {
    settings: newSettings(),
    currencyCodes: []
  },
  mutations: {
    setSettings: (state, settings) => state.settings = _.toPlainObject(settings),
    setCurrencyCodes: (state, currencyCodes) => state.currencyCodes = _.toPlainObject(currencyCodes)
  },
  actions: {
    async fetchSettings({commit}) {
      const {data} = await apolloClient.query({
        query: gql`
          {
            settings {
              ...settings
            }
          }
          ${settingsFragment}
        `,
        fetchPolicy: "network-only"
      })
      let settings = data.settings
      if(!settings)
        settings = newSettings()
      commit("setSettings", settings)
    },
    async updateSettings({commit}, settings) {
      settings = _.toPlainObject(settings)
      delete settings.id
      delete settings.__typename
      const {data} = await apolloClient.mutate({
        mutation: gql`
          mutation($settings: SettingsInput!) {
            updateSettings(settings: $settings) {
              ...settings
            }
          }
          ${settingsFragment}
        `,
        variables: {
          settings
        }
      })
      commit("setSettings", data.settings)
    },
    fetchCurrencyCodes: async ({commit}) => {
      const {data} = await apolloClient.query({
        query: gql`
          {
            __type(name: "CurrencyCode") {
              enumValues {
                name
              }
            }
          }
        `,
        fetchPolicy: "network-only"
      })
      commit("setCurrencyCodes", data.__type.enumValues.map((v) => v.name))
    }
  }
}
