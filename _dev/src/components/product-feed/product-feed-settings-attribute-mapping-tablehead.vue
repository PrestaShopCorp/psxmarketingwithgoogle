<template>
  <b-thead>
    <b-tr>
      <b-th class="border-0 font-weight-600 text-decoration-underline">
        {{ $t('productFeedSettings.attributeMapping.googleAttribute') }}
      </b-th>
      <b-th class="border-0 font-weight-600 text-decoration-underline">
        {{ $t('productFeedSettings.attributeMapping.prestashopAttribute') }}
      </b-th>
    </b-tr>
  </b-thead>
</template>

<script>
export default {
  name: 'ProductFeedSettingsAttributeMappingTablehead',
};
</script>
