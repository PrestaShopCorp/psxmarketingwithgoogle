import Vuex from 'vuex';
import {mount} from '@vue/test-utils';
import {BSkeleton} from 'bootstrap-vue';
import config, {localVue, addBootstrapToVue, cloneStore} from '@/../tests/init';
import feedConfigurationCardVue from './feed-configuration-card.vue';

describe('feed-configuration-card.vue', () => {
  it('displays the configuration details used during the sync', () => {
    const wrapper = mount(feedConfigurationCardVue, {
      localVue,
      ...config,
      propsData: {
        productFeedConfiguration: {
          targetCountries: ['FR', 'IT'],
          languages: ['it', 'fr', 'en'],
          lastModificationDate: new Date(2022, 11, 25, 23, 55),
        },
        loading: false,
      },
      store: new Vuex.Store(cloneStore()),
    });

    const countriesFound = wrapper.findAll('[data-test-id="pf-config-country"]');
    const languagesFound = wrapper.findAll('[data-test-id="pf-config-lang"]');
    const lastConfigurationDateFound = wrapper.find('[data-test-id="pf-config-date"]');

    expect(lastConfigurationDateFound.text()).toEqual('25/12/2022, 23:55');

    expect(countriesFound).toHaveLength(2);
    expect(countriesFound.at(0).text()).toEqual('France (EUR)');
    expect(countriesFound.at(1).text()).toEqual('Italy (EUR)');

    expect(languagesFound).toHaveLength(3);
    expect(languagesFound.at(0).text()).toEqual('it');
    expect(languagesFound.at(1).text()).toEqual('fr');
    expect(languagesFound.at(2).text()).toEqual('en');
  });

  it('displays a skeleton during loading', () => {
    addBootstrapToVue();
    const wrapper = mount(feedConfigurationCardVue, {
      localVue,
      ...config,
      propsData: {
        productFeedConfiguration: null,
        loading: true,
      },
      store: new Vuex.Store(cloneStore()),
    });

    const countriesFound = wrapper.findAll('[data-test-id="pf-config-country"]');
    const languagesFound = wrapper.findAll('[data-test-id="pf-config-lang"]');
    const lastConfigurationDateFound = wrapper.find('[data-test-id="pf-config-date"]');

    const loadingTags = wrapper.findAllComponents(BSkeleton);

    expect(lastConfigurationDateFound.exists()).toBeFalsy();
    expect(countriesFound).toHaveLength(0);
    expect(languagesFound).toHaveLength(0);

    expect(loadingTags).toHaveLength(3);
  });

  it('displays an alert message when no language is used', () => {
    addBootstrapToVue();
    const wrapper = mount(feedConfigurationCardVue, {
      localVue,
      ...config,
      propsData: {
        productFeedConfiguration: {
          targetCountries: ['FR'],
          languages: [],
          lastModificationDate: new Date(),
        },
        loading: false,
      },
      store: new Vuex.Store(cloneStore()),
    });
    const countriesFound = wrapper.findAll('[data-test-id="pf-config-country"]');
    const noElligibleLang = wrapper.find('[data-test-id="pf-config-no-lang"]');
    const localizationAlerts = wrapper.find('.alert-danger');

    expect(countriesFound).toHaveLength(1);
    expect(countriesFound.at(0).text()).toEqual('France (EUR)');

    expect(noElligibleLang.exists()).toBeTruthy();
    expect(noElligibleLang.text()).toEqual('No eligible language');

    expect(localizationAlerts.text()).toContain('No eligible languages');
  });

  describe('Currencies eligibility', () => {
    it('should display an error if all target countries currencies are missing', () => {
      addBootstrapToVue();
      const wrapper = mount(feedConfigurationCardVue, {
        localVue,
        ...config,
        propsData: {
          productFeedConfiguration: {
            targetCountries: ['BR'],
            languages: [],
            currencies: ['EUR'],
            lastModificationDate: new Date(),
          },
          loading: false,
        },
        store: new Vuex.Store(cloneStore()),
      });
      const countriesFound = wrapper.findAll('[data-test-id="pf-config-country"]');
      const noElligibleLang = wrapper.find('[data-test-id="pf-config-no-lang"]');
      const localizationAlerts = wrapper.findAll('.alert');

      expect(countriesFound).toHaveLength(1);
      expect(countriesFound.at(0).text()).toEqual('Brazil (BRL)');

      expect(noElligibleLang.exists()).toBeTruthy();
      expect(noElligibleLang.text()).toEqual('No eligible language');

      expect(localizationAlerts.at(0).text()).toContain('No eligible languages');
      expect(localizationAlerts.at(0).classes().includes('alert-danger')).toBe(true);
      expect(localizationAlerts.at(1).text()).toContain('No eligible currencies');
      expect(localizationAlerts.at(1).classes().includes('alert-danger')).toBe(true);
      expect(localizationAlerts.at(1).classes().includes('alert-warning')).toBe(false);
    });
  });

  it('should display a warning if some currencies of the target countries are missing', () => {
    addBootstrapToVue();
    const wrapper = mount(feedConfigurationCardVue, {
      localVue,
      ...config,
      propsData: {
        productFeedConfiguration: {
          targetCountries: ['BR', 'FR'],
          languages: [],
          currencies: ['EUR'],
          lastModificationDate: new Date(),
        },
        loading: false,
      },
      store: new Vuex.Store(cloneStore()),
    });
    const countriesFound = wrapper.findAll('[data-test-id="pf-config-country"]');
    const noElligibleLang = wrapper.find('[data-test-id="pf-config-no-lang"]');
    const localizationAlerts = wrapper.findAll('.alert');

    expect(countriesFound).toHaveLength(2);
    expect(countriesFound.at(0).text()).toEqual('Brazil (BRL)');
    expect(countriesFound.at(1).text()).toEqual('France (EUR)');

    expect(noElligibleLang.exists()).toBeTruthy();
    expect(noElligibleLang.text()).toEqual('No eligible language');

    expect(localizationAlerts).toHaveLength(2);
    expect(localizationAlerts.at(0).text()).toContain('No eligible languages');
    expect(localizationAlerts.at(0).classes().includes('alert-danger')).toBe(true);
    expect(localizationAlerts.at(1).text()).toContain('No eligible currencies');
    expect(localizationAlerts.at(1).classes().includes('alert-danger')).toBe(false);
    expect(localizationAlerts.at(1).classes().includes('alert-warning')).toBe(true);
  });
});
