import {MountOptions, mount} from '@vue/test-utils';
// Import this file first to init mock on window
import config, {addBootstrapToVue, addShowdownToVue, localVue} from '@/../tests/init';
import CollapsingIssues from './collapsing-issues.vue';
import {AccountIssue} from './types';
import CardCollapse from '@/components/commons/card-collapse.vue';

describe('CollapsingIssues', () => {
  const buildWrapper = (
    options: MountOptions<any> = {},
  ) => {
    addBootstrapToVue();
    addShowdownToVue();
    return mount(CollapsingIssues, {
      localVue,
      ...config,
      ...options,
    });
  };

  it('renders the component with default props', () => {
    const wrapper = buildWrapper({
      propsData: {
        issues: [],
      },
    });

    // Check if the component is rendered
    expect(wrapper.exists()).toBe(true);

    expect(wrapper.findAllComponents(CardCollapse)).toHaveLength(0);

    // Check if issues prop is passed correctly
    expect(wrapper.props('issues')).toEqual([]);
  });

  it('renders issues with proper data', () => {
    const issues: AccountIssue[] = [
      {
        title: 'Issue 1',
        severity: 'ERROR',
        htmlContent: '<p>Issue content 1</p>',
      },
      {
        title: 'Issue 2',
        severity: 'WARNING',
        htmlContent: '<p>Issue content 2</p>',
      },
      {
        title: 'Issue 3',
        severity: 'INFO',
        htmlContent: '<p>Issue content 3</p>',
      },
    ];

    const expectedIcon = [
      {
        icon: 'error',
        color: 'danger',
      },
      {
        icon: 'warning',
        color: 'warning',
      },
      {
        icon: 'info',
        color: 'info',
      },
    ];

    const wrapper = buildWrapper({
      propsData: {
        issues,
      },
    });

    // Check if issues are rendered correctly
    const cardCollapseComponents = wrapper.findAllComponents(CardCollapse);
    expect(cardCollapseComponents).toHaveLength(issues.length);

    issues.forEach((issue, index) => {
      const cardCollapse = cardCollapseComponents.at(index);
      // Check if issue title is rendered
      expect(cardCollapse.text()).toContain(issue.title);

      // Check if the icon color and icon are applied correctly
      const iconElement = cardCollapse.find('i');
      expect(iconElement.classes()).toContain(`text-${wrapper.vm.iconColor(issue.severity)}`);
      expect(iconElement.classes()).toContain(`text-${expectedIcon[index].color}`);
      expect(iconElement.text()).toBe(wrapper.vm.icon(issue.severity));
      expect(iconElement.text()).toBe(expectedIcon[index].icon);
      expect(cardCollapse.find('.card-body').html()).toContain(issue.htmlContent);
    });
  });

  it('prevents duplicates in impacted variants', () => {
    const wrapper = buildWrapper({
      propsData: {
        issues: [],
      },
    });

    const source = [
      {currency: 'EUR', language: 'en', attribute: '16'},
      {currency: 'EUR', language: 'fr', attribute: '16'},
      {currency: 'EUR', language: 'en', attribute: '17'},
      {currency: 'EUR', language: 'fr', attribute: '17'},
    ];

    const expected = [
      {currency: 'EUR', language: 'en'},
      {currency: 'EUR', language: 'fr'},
    ];

    expect(wrapper.vm.uniqueImpactedVariants(source)).toEqual(expected);
  });
});
