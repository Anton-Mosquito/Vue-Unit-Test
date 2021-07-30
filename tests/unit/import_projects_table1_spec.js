import { GlLoadingIcon }  from '@gitlab/ui/dist/index';
import { shallowMount, enableAutoDestroy } from '@vue/test-utils';
import { merge } from 'lodash';
import Vue from 'vue'; // Jest  сбрасывает кэш модулей при выполнении каждого теста
import Vuex from 'vuex'; // Jest  сбрасывает кэш модулей при выполнении каждого теста
import ImportProjectsTable  from '~/import_entities/import_projects/components/import_projects_table.vue';
import { getStoreConfig } from '~/import_entities/import_projects/store';

Vue.use(Vuex);
// const noOperation = () => {};

describe('Import projects table', () => {
  enableAutoDestroy(beforeEach);

  let wrapper;

  let mockedActions;

  const FAKE_ENDPOINTS = {
    reposPath: '/fake/repos',
    importPath: '/fake/import',
    jobsPath: '/fake/jobs',
    namespacesPath: '/fake/namespacesPath',
  };

  const DEFAULT_PROPS = {
    providerTitle: 'DEMO_PROVIDER',
    filterable: true,
    paginatable: true
  };

  const DEFAULT_STORE_CONFIG = {
    hasPagination: true,
    endpoints : FAKE_ENDPOINTS,
  };

  // const localVue = createLocalVue();
  // localVue.use(Vuex);

  const createComponents = ({ props, storeConfig } = {}) => {
    const defaultStoreConfig = getStoreConfig(DEFAULT_STORE_CONFIG);

    mockedActions = Object.fromEntries(
      Object.keys(defaultStoreConfig.actions).map((actionName) => [actionName, jest.fn()])
    );

    const store = new Vuex.Store(
      merge(defaultStoreConfig, { actions: mockedActions } , storeConfig)
    );

    wrapper = shallowMount(ImportProjectsTable, {
      propsData: {
        ...DEFAULT_PROPS,
        ...props,
      },
      // localVue,

      // mocks: {
      //   $store : store,
      // },
      store
    });
  }


  it('gl-loading-icon v-if="isLoading" renders loading icon when loading',  () => {
    createComponents({
      storeConfig : {
        getters: {
          isLoading: () => true,
       },
    }});

    expect(wrapper.find(GlLoadingIcon).exists()).toBe(true);
  })


  it.todo('template v-if="hasIncompatibleRepos"')
  it.todo('form v-if="filterable"')
  it.todo('div v-if="repositories.length"')
  it.todo('gl-intersection-observer v-if="paginatable"')

  it.todo('div v-if="!isLoading && repositories.length === 0"')


  it.todo('@click="$refs.importAllModal.show()"');
  it.todo('@ok="importAll"');
  it.todo('@keyup.enter="setFilter($event.target.value)"');
  it.todo('@appear="fetchRepos"');


  it.todo('gl-button :loading="isImportingAnyRepo"');
  it.todo('gl-button :disabled="!hasImportableRepos"');
  it.todo('gl-intersection-observer :key="pagePaginationStateKey"');

  // 'fetchRepos',
  // 'fetchJobs',
  // 'fetchNamespaces',
  // 'stopJobsPolling',
  // 'clearJobsEtagPoll',
  // 'setFilter',
  // 'importAll',
});
