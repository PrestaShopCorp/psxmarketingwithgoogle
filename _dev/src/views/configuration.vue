<template>
  <div id="configuration">
    <b-card no-body>
      <b-card-body>
        <div class="row">
          {{ $t("configuration.introduction") }}
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import {defineComponent} from '@vue/composition-api';

export default defineComponent({
  name: 'configuration',
  components: {
  },
  props: {
  },
  data() {
    return {
    };
  },
  created() {
    console.log(this.$store.getters.psAccountsIsOnboarded);
    // console.log(this.$store.state);
  },
  methods: {
  },
  computed: {
  },
});
</script>

<style lang="scss">
</style>
