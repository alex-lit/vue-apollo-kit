import {
  ApolloClient,
  ApolloLink,
  buildAxiosFetch,
  InMemoryCache,
  onError,
  RestLink,
  VueApollo,
} from '@alexlit/apollo-vue-kit';
import { Plugin } from '@nuxt/types';
import Vue from 'vue';

import { formDataSerializer } from './serializers';

const API_HOST = 'https://example.com';
