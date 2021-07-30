import Vue from 'vue';
import Vuex from 'vuex';
import actionsFactory from './actions';
import * as getters from './getters';
import mutations from './mutations';
import state from './state';

Vue.use(Vuex);

export const getStoreConfig = ({ initialState, endpoints, hasPagination }) => ({
    state: { ...state(), ...initialState },
    actions: actionsFactory({ endpoints, hasPagination }),
    mutations,
    getters,
})

export default ({ initialState, endpoints, hasPagination }) =>
  new Vuex.Store(getStoreConfig({ initialState, endpoints, hasPagination }));
