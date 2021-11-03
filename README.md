# Marketing With Google (psxmarketingwithgoogle)


## Setup

In order to run on PrestaShop, dependencies needs to be downloaded and the JS application built.

### PHP

Retrieve dependencies with composer

```
composer install
# or
make docker-build-composer
```

### VueJS

```
npm install --n
npm run build
# or 
make vuejs
```

## Development

### Compiles and watch for new changes

```
npm run dev
```

### Lints and fixes files, run tests

#### JS

```
npm run lint
npm run test:unit

# or
make test-front
```

#### PHP

```
vendor/bin/php-cs-fixer fix
vendor/bin/phpunit tests/
docker run -tid --rm -v ps-volume:/var/www/html --name temp-ps prestashop/prestashop; docker run --rm --volumes-from temp-ps -v $PWD:/web/module -e _PS_ROOT_DIR_=/var/www/html --workdir=/web/module phpstan/phpstan analyse --configuration=/web/module/tests/phpstan/phpstan.neon;
# or
make test-back
```


### Storybook

Storybook available on this [url](https://storybook-google.psessentials-integration.net/). It is updated on each push to the `master` branch.

### Environment customization

By default, PHP will define data to the Vue.js application that are related to the production.

In case you need to modify these variables during while maintaining this project, you may
overwrite them by creating a file `.env` in the root directory of this module, and using the
keys that can be found in `classes/config/Config.php`.

If you want to use local vue app, set on your .env USE_LOCAL_VUE_APP at 1.
For instance to modify the base URL of the services for a local one:

```
PSX_MKTG_WITH_GOOGLE_API_URL=https://localhost:8080
PSX_MKTG_WITH_GOOGLE_API_KEY=API_KEY
USE_LOCAL_VUE_APP=1
```

### Microcks

Microcks is an API in which all calls to the production API have been mocked.
To use microcks, replace the default PSX_MKTG_WITH_GOOGLE_API_URL from Config.php by filling an `.env` file with:
```
PSX_MKTG_WITH_GOOGLE_API_URL=https://mock-googleshopping-api.psessentials-integration.net/rest/PS+Google+Shopping+all-in-one/1.0/
```

