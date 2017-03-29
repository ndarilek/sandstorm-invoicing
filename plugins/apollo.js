import ApolloClient, {createNetworkInterface} from "apollo-client"
import Vue from "vue"
import VueApollo from "vue-apollo"

if(process.BROWSER_BUILD) {
  const uri = "/api"

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
}
