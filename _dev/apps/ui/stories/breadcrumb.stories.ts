export default {
  title: 'Basic Components/Breadcrumb',
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  template: `
    <div>

      Title:
      <b-card
        class="ps_gs-onboardingcard mb-2"
        no-body
      >
        <template #header>
          <h1 class="mb-0 ps_gs-onboardingcard__title">
            {{ $t("productFeedSettings.breadcrumb1") }}
          </h1>
        </template>
      </b-card>

      Multi level breadcrumb:
      <b-card
        no-body
        class="ps_gs-onboardingcard mb-2"
      >
        <template #header>
          <ol class="mb-0 list-inline d-flex align-items-center ps_gs-breadcrumb">
            <li class="list-inline-item ps_gs-breadcrumb__item">
              <b-link
                class="d-flex align-items-center ps_gs-breadcrumb__link"
              >
                {{ $t('productFeedSettings.breadcrumb1') }}
              </b-link>
            </li>
            <li class="list-inline-item ps_gs-breadcrumb__item">
              <b-link
                class="d-flex align-items-center ps_gs-breadcrumb__link"
              >
                {{ $t('productFeedPage.breadcrumb.nonCompliantProducts') }}
              </b-link>
            </li>
            <li class="list-inline-item ps_gs-breadcrumb__item">
              {{ $t('productFeedPage.compliancyIssues.nameMissing') }}
            </li>
          </ol>
        </template>
      </b-card>

      Single level breadcrumb:
      <b-card
        no-body
        class="ps_gs-onboardingcard"
      >
        <template #header>
          <ol class="mb-0 list-inline d-flex align-items-center ps_gs-breadcrumb">
            <li class="list-inline-item ps_gs-breadcrumb__item">
              {{ $t('campaigns.listTitle') }}
            </li>
          </ol>
        </template>
      </b-card>
    </div>
  `,
});

export const Breadcrumb:any = Template.bind({});
Breadcrumb.args = {}
