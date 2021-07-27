# Marketing With Google (psxmarketingwithgoogle)


## Setup

Run composer

```
composer install
# or
make docker-build-composer
```

### Development

#### Environment customization

By default, PHP will define data to the Vue.js application that are related to the production.

In case you need to modify these variables during while maintaining this project, you may
overwrite them by creating a file `.env` in the root directory of this module, and using the
keys that can be found in `classes/config/Config.php`.

For instance to modify the base URL of the services for a local one:

```
PSX_MKTG_WITH_GOOGLE_API_URL=https://localhost:8080
PSX_MKTG_WITH_GOOGLE_API_KEY=API_KEY
```

#### Microcks

To use microcks replace the default PSX_MKTG_WITH_GOOGLE_API_URL from Config.php by filling an `.env` file with:
```
PSX_MKTG_WITH_GOOGLE_API_URL=https://mock-googleshopping-api.psessentials-integration.net/rest/PS+Google+Shopping+all-in-one/1.0/
```
