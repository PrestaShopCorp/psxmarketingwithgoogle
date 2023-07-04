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

**Boost your reach and sales with Performance Max**

Want to maximize your campaign performance and find the right customers wherever they are? From one single campaign, Performance Max collects data across different Google channels, and optimises your campaign performance by showing where your ads have higher chances of driving conversion.

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

With Node 20+, the following commands need to be run in the `_dev/` folder and requires pnpm to be installed. If you do not have it:

```
npm install -g pnpm
```

To build the application in production mode:

```
pnpm install
pnpm -r build

# or 

make vuejs
```

To compiles and watch for new changes (development mode):

```
pnpm install

pnpm -r dev
```

## Testing

Tests will be run at each commit on this repository or any pull-request. These command reproduce the checks done by the CI.

* JS checks: Unit tests & coding standards

```
pnpm -r lint
pnpm -r test:unit

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

* To use the UI built in the `views/` folder, set on your .env `USE_LOCAL_VUE_APP` at 1.
* To use the developer environment with hot-reload, set `USE_LIVE_VUE_APP=1`. The template will call the dev server at http://localhost:5173 by default. Customising this value is possible by modifying `app.tpl` and `vite.config.ts`.
* To modify the base URL of the API for a local one: `PSX_MKTG_WITH_GOOGLE_API_URL=https://localhost:8080`

Other values are managed by the Vue.js application and are provided in the [`_dev/apps/ui/.env` file](_dev/apps/ui/.env), different from the optional `.env` in the root folder.


## Releasing

To publish a new version on the marketplace:
* Update the version in the main class of this module, and in `config.xml` ifit exists,
* Create a new release on the [releases page](https://github.com/PrestaShopCorp/pasmarketingwithgoogle/releases) with a tag that matches the version provided in the main class.

## Documentation

### User help

Documentation is hosted [online](
https://storage.googleapis.com/psessentials-documentation/psxmarketingwithgoogle/user_guide_en.pdf), and is available in several languages. Translated documentation in your language can be found in the module configuration page, in the "Help" tab.

### Storybook

All components and pages of this module are available on a dedicated website running Storybook. 
It is updated on each push to the `master` branch.  
[Integration Storybook](https://google-storybook-integration.prestashop.com/)  
[Preproduction Storybook](https://google-storybook-preproduction.prestashop.com/)  
[Production Storybook](https://google-storybook.prestashop.com/)

### Hook

The module registers itself to several hooks and add the following features:

* actionCartUpdateQuantityBefore
  * Remarketing: Trigger the Conversion Action "Add to Cart"
* displayBackOfficeHeader
  * Menu: Fix the display of the Marketing tab
  * Website Verification: Trigger the verification & claim process every 30 days in the background of the BO dashboard.
  * Warning Messages: Display alerts on the BO dashboard about Marketing With Google
  * Warning Messages: Display a notice after the edition of a carrier advising to reconfigure shipping settings on the module
* displayHeader
  * Website verification: Display the Google Verification Tag
  * Remarketing: Display the Google Remarketing Tag to init gtag()
  * Remarketing: Purge & display events that could not be displayed (i.e triggered from Ajax requests)
* displayOrderConfirmation
  * Remarketing: Trigger the Conversion Action "Purchase"
* displayTop
  * Remarketing: Trigger the Conversion Action "Page view"


## Contributing

PrestaShop modules are open source extensions to the PrestaShop e-commerce platform. Everyone is welcome and even encouraged to contribute with their own improvements!

Just make sure to follow our contribution guidelines.

## Reporting issues

You can report issues with this module by using the link available in the module configuration page, in the "Help" tab.

## License

This module is released under the Academic Free License 3.0
