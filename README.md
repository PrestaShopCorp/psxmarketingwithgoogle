![Marketing With Google logo](views/img/google-icon.svg)

# Marketing With Google (psxmarketingwithgoogle)

[![JS tests](https://github.com/PrestaShopCorp/psxmarketingwithgoogle/actions/workflows/js.yml/badge.svg)](https://github.com/PrestaShopCorp/psxmarketingwithgoogle/actions/workflows/js.yml)
[![Storybook CI/CD](https://github.com/PrestaShopCorp/psxmarketingwithgoogle/actions/workflows/storybook-ci-cd.yml/badge.svg)](https://github.com/PrestaShopCorp/psxmarketingwithgoogle/actions/workflows/storybook-ci-cd.yml)
[![PHP tests](https://github.com/PrestaShopCorp/psxmarketingwithgoogle/actions/workflows/php.yml/badge.svg)](https://github.com/PrestaShopCorp/psxmarketingwithgoogle/actions/workflows/php.yml)

## About

**Sync your product catalog with Google**

Connect your store to Google Merchant Center and synchroniwe your entire product catalog in a few clicks. Product attributes such as price and availability will be automatically updated everyday.

**Enable free listings for your products**

Free listings allow to show your product attributes, including image and price in organically-ranked listings on the Shopping tab. 

Once your catalog has been synchronised, enable free listings on your dashboard and start showing your products on the Shopping tab for free.

**Create and manage Smart Shopping campaigns**

Smart Shopping campaigns are ads that use Google’s smart technology for bidding and ad placement to maximize conversion value and strategically display your ads to people searching for products like yours.

Set a daily budget and let Google's smart technology optimize your campaigns across different networks like Google Search, YouTube or Gmail. You only pay when people click.

## Download & Installation

Modules archives can be found and downloaded:
* On the [PrestaShop Addons Marketplace](https://addons.prestashop.com/en/essentials/85751-prestashop-marketing-with-google-.html) (Latest stable release only)
* On the [releases page](https://github.com/PrestaShopCorp/pasmarketingwithgoogle/releases) of this repository (Stable & beta releases available)


Downloaded archives can be uploaded on PrestaShop instances, as detailed in the [user documentation](https://doc.prestashop.com/display/PS17/Modules+Selection#ModulesSelection-Uploadingamodulemanually).

## Building

This part covers the steps to get this project ready locally.

In order to run on a PrestaShop instance, dependencies needs to be downloaded and the JS application built.

### PHP

Retrieve dependencies with composer

```
composer install
# or
make docker-build-composer
```

Composer has been configured in authoritative mode, which means it won't look in the filesystem when a class is not found in the current autoloader.
When a class is added or deleted, it is required to rerun the above command.

### VueJS

The following commands need to be run in the `_dev/` folder.

To build the application in production mode:

```
npm install --n
npm run build

# or 

make vuejs
```

To compiles and watch for new changes (development mode):

```
npm install --n

npm run dev
```

## Testing

Tests will be run at each commit on this repository or any pull-request. These command reproduce the checks done by the CI.

* JS checks: Unit tests & coding standards

```
npm run lint
npm run test:unit

# or

make test-front
```

* PHP checks: Unit tests, coding standards...

```
vendor/bin/php-cs-fixer fix

vendor/bin/phpunit tests/

docker run -tid --rm -v ps-volume:/var/www/html --name temp-ps prestashop/prestashop; docker run --rm --volumes-from temp-ps -v $PWD:/web/module -e _PS_ROOT_DIR_=/var/www/html --workdir=/web/module phpstan/phpstan analyse --configuration=/web/module/tests/phpstan/phpstan.neon;

php vendor/bin/header-stamp --license=vendor/prestashop/header-stamp/assets/afl.txt --exclude=vendor,tests,_dev

# or

make test-back
```

## Environment customization

By default, PHP & JS will define data to the application that are related to the production.

In case you need to modify these variables while maintaining this project, you may
overwrite them in a freshly `.env` file created in the root directory of this module, by using the
keys that can be found in `classes/config/Config.php`.

If you want to use local vue app, set on your .env USE_LOCAL_VUE_APP at 1.
For instance to modify the base URL of the services for a local one:

```
PSX_MKTG_WITH_GOOGLE_API_URL=https://localhost:8080
PSX_MKTG_WITH_GOOGLE_API_KEY=API_KEY
USE_LOCAL_VUE_APP=1
```

Some values are managed by the Vue.js application and are provided in the [`_dev/.env` file](_dev/.env).


## Releasing

To publish a new version on the marketplace:
* Update the version in the main class of this module, and in `config.xml` ifit exists,
* Create a new release on the [releases page](https://github.com/PrestaShopCorp/pasmarketingwithgoogle/releases) with a tag that matches the version provided in the main class.

## Documentation

### User help

Documentation is hosted [online](
https://storage.googleapis.com/psessentials-documentation/psxmarketingwithgoogle/user_guide_en.pdf), and is available in several languages. Translated documentation in your language can be found in the module configuration page, in the "Help" tab.

### Storybook

All components and pages of this module are available on a [dedicated website running Storybook](https://storybook-google.psessentials-integration.net/). It is updated on each push to the `master` branch.


## Contributing

PrestaShop modules are open source extensions to the PrestaShop e-commerce platform. Everyone is welcome and even encouraged to contribute with their own improvements!

Just make sure to follow our contribution guidelines.

## Reporting issues

You can report issues with this module by using the link available in the module configuration page, in the "Help" tab.

## License

This module is released under the Academic Free License 3.0
