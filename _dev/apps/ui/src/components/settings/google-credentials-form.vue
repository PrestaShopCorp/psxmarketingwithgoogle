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
      readGeneration: 0,
    };
  },
  methods: {
    importCredentials(event: Event) {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];

      if (!file || file.size > MAX_FILE_BYTES) {
        this.error = 'Select a valid Google OAuth web client JSON file.';
        return;
      }

      const generation = this.readGeneration + 1;
      this.readGeneration = generation;
      this.loading = true;
      this.error = '';
      const reader = new FileReader();
      reader.onerror = () => {
        if (generation !== this.readGeneration) {
          return;
        }
        this.error = 'The Google OAuth web client file could not be read.';
        this.loading = false;
      };
      reader.onload = async () => {
        if (generation !== this.readGeneration) {
          return;
        }

        let credential: {web: WebCredential};
        try {
          const parsed = JSON.parse(String(reader.result));

          if (!this.isValidWebCredential(parsed)) {
            throw new Error('invalid');
          }
          credential = parsed;
        } catch (error) {
          if (generation === this.readGeneration) {
            this.error = 'Select a valid Google OAuth web client JSON file.';
            this.loading = false;
          }
          return;
        }

        try {
          const response = await fetchOnboarding('POST', 'settings/credentials', {
            body: credential as unknown as {[key: string]: unknown},
          });
          const configuration = await response.json() as SafeGoogleConfiguration;

          if (generation === this.readGeneration) {
            this.$emit('configured', configuration);
          }
        } catch (error) {
          if (generation === this.readGeneration) {
            this.error = 'The Google OAuth web client could not be imported.';
          }
        } finally {
          if (generation === this.readGeneration) {
            this.loading = false;
          }
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
