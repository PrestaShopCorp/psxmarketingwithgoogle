<template>
  <b-card
    no-body
    class="ps_gs-onboardingcard"
  >
    <b-card-header
      header-tag="nav"
      header-class="px-3 py-1"
    >
      <ol class="list-inline mb-0 d-flex align-items-center ps_gs-breadcrumb">
        <li class="list-inline-item ps_gs-breadcrumb__item">
          <a
            href=""
            class="d-flex align-items-center ps_gs-breadcrumb__link"
          >
            <img
              class="ps_gs-breadcrumb__icon"
              src="@/assets/images/product-feed-icon.svg"
              width="40"
              height="40"
              alt=""
            >
            Product feed
          </a>
        </li>
        <li class="list-inline-item ps_gs-breadcrumb__item">Product feed settings</li>
      </ol>
    </b-card-header>
    <b-card-body
      body-class="p-4"
    >
      <stepper
        :steps="steps"
        :activeStep="activeStep"
      />
      <product-feed-settings-shipping v-if="activeStep == 1"/>
    </b-card-body>
  </b-card>
</template>

<script>
import Stepper from '../commons/stepper';
import ProductFeedSettingsShipping from './product-feed-settings-shipping';

export default {
  name: 'ProductFeedSettings',
  components: {
    Stepper, ProductFeedSettingsShipping
  },
  data() {
    return {
      steps: [
        {
          title: 'Shipping settings',
        },
        {
          title: 'Export rules',
        },
        {
          title: 'Attribute mapping',
        },
        {
          title: 'Category mapping',
        },
        {
          title: 'Summary',
        },
      ],
    };
  },
  props: {
    activeStep: {
      type: Number,
      required: true,
    },
  },
};
</script>
