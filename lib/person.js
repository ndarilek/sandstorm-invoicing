import _ from "lodash"

export const newPerson = () => ({
  organization: "",
  name: {
    first: "",
    last: ""
  },
  email: "",
  address: {
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: ""
  },
  phone: ""
})

export const cleanup = (person) => {
  person = _.toPlainObject(person)
  delete person.id
  delete person.__typename
  person.name = _.toPlainObject(person.name)
  delete person.name.__typename
  person.address = _.toPlainObject(person.address)
  delete person.address.__typename
  return person
}
