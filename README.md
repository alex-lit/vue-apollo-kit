# Vue Apollo Kit

Пример плагина nuxt.js (typescript)

```ts
import { formDataSerializer } from '@alexlit/apollo-vue-kit/serializers';
import { buildAxiosFetch } from '@lifeomic/axios-fetch';
import { Plugin } from '@nuxt/types';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { RestLink } from 'apollo-link-rest';
import Vue from 'vue';
import VueApollo from 'vue-apollo';

const API_HOST = 'https://example.com';

Vue.use(VueApollo);

/**
 * @param context
 * @param context.app
 * @param context.$axios
 */
const vueApollo: Plugin = ({ app, $axios }) => {
  /**
   * Error
   */
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      // silent
    }

    if (
      networkError &&
      `${networkError}` !== 'TypeError: forward is not a function'
    ) {
      const { response, statusCode, result } = networkError as any;

      console.error(
        '[Apollo.plugin::onError.networkError]: ',
        `${networkError}`,
        {
          response,
          statusCode,
          result,
        },
      );
    }
  });

  /**
   * Cache
   */
  const cache = new InMemoryCache();

  /**
   * Rest
   */
  const restLink = new RestLink({
    uri: API_HOST,

    /**
     * Использование axios-плагина вместо ванильного fetch
     *
     * @param uri
     * @param options
     */
    customFetch: (uri, options) => {
      return buildAxiosFetch($axios, (config) => {
        /**
         * Заголовок сформированный apollo, например при использовании
         * параметра 'formDataSerializer'
         */
        const apolloHeaders: Record<string, string> = Object.fromEntries(
          (options.headers as any).entries(),
        );

        config.headers = { ...config.headers, ...apolloHeaders };

        return config;
      })(uri, options);
    },
    bodySerializers: {
      formData: formDataSerializer,
    },
  });

  /**
   * Client
   */
  const defaultClient = new ApolloClient({
    link: ApolloLink.from([errorLink, restLink]),
    typeDefs: [],
    resolvers: {},
    cache,
  });

  /**
   * Provider
   */
  const apolloProvider = new VueApollo({
    defaultClient,
  });

  app.apolloProvider = apolloProvider;
};

export default vueApollo;
```
