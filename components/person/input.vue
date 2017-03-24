<template>
  <div>
    <div class="form-group">
      <label :for="namespace('organization')">Organization</label>
      <input type="text" :id="namespace('organization')" v-model.trim="value.organization"/>
    </div>
    <div class="form-group">
      <label :for="namespace('firstName')">First name</label>
      <input type="text" :id="namespace('firstName')" v-model.trim="value.name.first"/>
    </div>
    <div class="form-group">
      <label :for="namespace('lastName')">Last name</label>
      <input type="text" :id="namespace('lastName')" v-model.trim="value.name.last"/>
    </div>
    <div class="form-group">
      <label :for="namespace('email')">Email</label>
      <input type="email" :id="namespace('email')" v-model.trim="value.email"/>
    </div>
    <div class="form-group">
      <label :for="namespace('address1')">Address line 1</label>
      <input type="text" :id="namespace('address1')" v-model.trim="value.address.line1"/>
    </div>
    <div class="form-group">
      <label :for="namespace('address2')">Address line 2</label>
      <input type="text" :id="namespace('address2')" v-model.trim="value.address.line2"/>
    </div>
    <div class="form-group">
      <label :for="namespace('city')">City</label>
      <input type="text" :id="namespace('city')" v-model.trim="value.address.city"/>
    </div>
    <div class="form-group">
      <label :for="namespace('state')">State/province</label>
      <input type="text" :id="namespace('state')" v-model.trim="value.address.state"/>
    </div>
    <div class="form-group">
      <label :for="namespace('postalCode')">Zip/postal code</label>
      <input type="text" :id="namespace('postalCode')" v-model.trim="value.address.postalCode"/>
    </div>
    <div class="form-group">
      <label :for="namespace('phone')">Phone</label>
      <input type="text" :id="namespace('phone')" v-model.trim="value.phone"/>
    </div>
  </div>
</template>

<script>

export default {
  props: ["prefix", "value"],
  methods: {
    namespace(name) {
      return `${this.prefix}_${name}`
    }
  }
}

</script>
