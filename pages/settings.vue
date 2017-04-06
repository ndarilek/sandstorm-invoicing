<template>
  <div>
    <h1>Settings</h1>
    <form @submit.prevent="save">
      <h2>Sender</h2>
      <person-input prefix="sender" v-model="sender"/>
      <h2>Client</h2>
      <person-input prefix="client" v-model="client"/>
      <h2>Miscellaneous</h2>
      <div class="form-group">
        <label for="daysBeforeDue">Days before invoices are due</label>
        <input v-model="settings.daysBeforeDue" type="number" min="0"/>
      </div>
      <div class="form-group">
        <label for="defaultCurrencyCode">Default currency</label>
        <currency-selector v-model="settings.defaultCurrencyCode"/>
      </div>
      <button type="submit" class="btn btn-default">Save</button>
    </form>
  </div>
</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex"
import CurrencySelector from "~components/currency/selector"
import PersonInput from "~components/person/input"

export default {
  methods: {
    ...mapActions({
      fetchClient: "people/fetchClient",
      fetchSender: "people/fetchSender",
      fetchSettings: "settings/fetchSettings",
      updateClient: "people/updateClient",
      updateSender: "people/updateSender",
      updateSettings: "settings/updateSettings"
    }),
    ...mapMutations({
      setClient: "people/setClient",
      setSender: "people/setSender",
      setSettings: "people/setSettings"
    }),
    save() {
      this.updateClient(this.clientState)
        .then(() => this.updateSender(this.senderState))
        .then(() => this.updateSettings(this.settingsState))
        .then(() => this.$router.push({name: "index"}))
    }
  },
  created() {
    this.fetchClient()
      .then(() => this.fetchSender())
      .then(() => this.fetchSettings())
  },
  computed: {
    ...mapState({
      clientState: ({people}) => people.client,
      senderState: ({people}) => people.sender,
      settingsState: ({settings}) => settings.settings
    }),
    client: {
      get() { return this.clientState },
      set(value) { this.setClient(value) }
    },
    sender: {
      get() { return this.senderState },
      set(value) { this.setSender(value) }
    },
    settings: {
      get() { return this.settingsState },
      set(value) { this.setSettings(value) }
    }
  },
  head: {
    title: "Settings"
  },
  components: {
    CurrencySelector,
    PersonInput
  }
}
</script>
