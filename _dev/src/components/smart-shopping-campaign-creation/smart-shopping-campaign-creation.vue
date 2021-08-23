<template>
  <b-card
    no-body
    class="ps_gs-onboardingcard"
  >
    <b-card-header
      header-tag="nav"
      header-class="px-3 py-1"
    >
      <ol class="list-inline mb-0 d-sm-flex align-items-center ps_gs-breadcrumb">
        <li class="list-inline-item ps_gs-breadcrumb__item">
          <a
            href=""
            class="d-flex align-items-center ps_gs-breadcrumb__link"
          >
            <img
              class="ps_gs-breadcrumb__icon"
              src="@/assets/images/Google-Commercial-icon.svg"
              width="40"
              height="40"
              alt=""
            >
            Paid marketing
          </a>
        </li>
        <li class="list-inline-item ps_gs-breadcrumb__item ml-4 ml-sm-0">
          Create Smart Shopping campaign
        </li>
      </ol>
    </b-card-header>
    <b-card-body
      body-class="p-3 p-md-4"
    >
      <b-form>
        <b-form-group
          id="campaign-name-fieldset"
          label="Campaign name"
          label-for="campaign-name-input"
        >
          <b-form-input
            id="campaign-name-input"
            v-model="campaignName"
            placeholder="Type campaign name"
          />
        </b-form-group>
      </b-form>
    </b-card-body>
  </b-card>
</template>

<script>

export default {
  name: 'ProductFeedSettings',
  data() {
    return {
      campaignName: '',
    }
  },
  components: {
  },
  computed: {
  },
  methods: {
  },
};
</script>
