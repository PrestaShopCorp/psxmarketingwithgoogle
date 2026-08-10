<template>
  <section class="card mb-4 tiny-lux-google-credentials">
    <div class="card-body">
      <h2 class="h4">
        Google OAuth web client
      </h2>
      <p>
        Import a Google OAuth web-client JSON file containing this exact redirect URI:
      </p>
      <code class="d-block mb-3">{{ connection.redirectUri }}</code>
      <p v-if="connection.configured">
        Configured client ending in <strong>{{ connection.clientIdSuffix }}</strong>.
      </p>
      <div class="form-group mb-0">
        <label for="tiny-lux-google-credentials-file">
          Google OAuth web-client JSON
        </label>
        <input
          id="tiny-lux-google-credentials-file"
          class="form-control-file"
          type="file"
          accept="application/json,.json"
          :disabled="loading"
          @change="importCredentials"
        >
      </div>
      <p
        v-if="loading"
        class="mt-2 mb-0"
      >
        Importing credentials…
      </p>
      <b-alert
        v-if="error"
        class="mt-3 mb-0"
        variant="danger"
        show
      >
        {{ error }}
      </b-alert>
    </div>
  </section>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {fetchOnboarding} from 'mktg-with-google-common/api/onboardingClient';

type SafeGoogleConfiguration = {
  configured: boolean,
  clientIdSuffix: string,
  redirectUri: string,
};

type WebCredential = {
  client_id: string,
  client_secret: string,
  redirect_uris: string[],
};

const MAX_FILE_BYTES = 65536;

export default defineComponent({
  name: 'GoogleCredentialsForm',
  props: {
    connection: {
      type: Object as PropType<SafeGoogleConfiguration>,
      required: true,
    },
  },
  data() {
    return {
      error: '',
      loading: false,
    };
  },
  methods: {
    importCredentials(event: Event) {
      this.error = '';
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];

      if (!file || file.size > MAX_FILE_BYTES) {
        this.error = 'Select a valid Google OAuth web client JSON file.';
        return;
      }

      const reader = new FileReader();
      reader.onerror = () => {
        this.error = 'The Google OAuth web client file could not be read.';
      };
      reader.onload = async () => {
        let credential: {web: WebCredential};
        try {
          const parsed = JSON.parse(String(reader.result));

          if (!this.isValidWebCredential(parsed)) {
            throw new Error('invalid');
          }
          credential = parsed;
        } catch (error) {
          this.error = 'Select a valid Google OAuth web client JSON file.';
          return;
        }

        this.loading = true;
        try {
          const response = await fetchOnboarding('POST', 'settings/credentials', {
            body: credential as unknown as {[key: string]: unknown},
          });
          const configuration = await response.json() as SafeGoogleConfiguration;
          this.$emit('configured', configuration);
        } catch (error) {
          this.error = 'The Google OAuth web client could not be imported.';
        } finally {
          this.loading = false;
        }
      };
      reader.readAsText(file);
    },
    isValidWebCredential(value: unknown): value is {web: WebCredential} {
      if (!value || typeof value !== 'object' || Array.isArray(value)
          || Object.keys(value).length !== 1 || !('web' in value)) {
        return false;
      }
      const {web} = value as {web?: unknown};

      if (!web || typeof web !== 'object' || Array.isArray(web)) {
        return false;
      }

      const candidate = web as Partial<WebCredential>;

      return typeof candidate.client_id === 'string' && candidate.client_id.trim().length > 0
        && typeof candidate.client_secret === 'string' && candidate.client_secret.trim().length > 0
        && Array.isArray(candidate.redirect_uris)
        && candidate.redirect_uris.every((uri) => typeof uri === 'string')
        && candidate.redirect_uris.includes(this.connection.redirectUri);
    },
  },
});
</script>
