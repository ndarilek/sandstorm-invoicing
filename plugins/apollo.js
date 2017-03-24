import ApolloClient, {createNetworkInterface} from "apollo-client"
import Vue from "vue"
import VueApollo from "vue-apollo"

const uri = process.BROWSER_BUILD ? "/graphql" : "http://127.0.0.1:8000/graphql"

const networkInterface = createNetworkInterface({
  uri,
  opts: {
    credentials: "same-origin"
  }
})

const apolloClient = new ApolloClient({
  networkInterface
})

Vue.use(VueApollo, {
  apolloClient
})
