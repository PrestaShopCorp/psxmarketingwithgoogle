![Marketing With Google logo](views/img/google-icon.svg)

# Marketing With Google (psxmarketingwithgoogle)

[![JS tests](https://github.com/PrestaShopCorp/psxmarketingwithgoogle/actions/workflows/js.yml/badge.svg)](https://github.com/PrestaShopCorp/psxmarketingwithgoogle/actions/workflows/js.yml)
[![Storybook CI/CD](https://github.com/PrestaShopCorp/psxmarketingwithgoogle/actions/workflows/storybook-ci-cd.yml/badge.svg)](https://github.com/PrestaShopCorp/psxmarketingwithgoogle/actions/workflows/storybook-ci-cd.yml)
[![PHP tests](https://github.com/PrestaShopCorp/psxmarketingwithgoogle/actions/workflows/php.yml/badge.svg)](https://github.com/PrestaShopCorp/psxmarketingwithgoogle/actions/workflows/php.yml)

## About

**Sync your product catalog with Google**

Connect your store to Google Merchant Center and synchronize your entire product catalog in a few clicks. Product attributes such as price and availability will be automatically updated everyday.

**Enable free listings for your products**

Free listings allow to show your product attributes, including image and price in organically-ranked listings on the Shopping tab. 

Once your catalog has been synchronised, enable free listings on your dashboard and start showing your products on the Shopping tab for free.

**Boost your reach and sales with Performance Max**

Want to maximize your campaign performance and find the right customers wherever they are? From one single campaign, Performance Max collects data across different Google channels, and optimises your campaign performance by showing where your ads have higher chances of driving conversion.

## Download & Installation

Modules archives can be found and downloaded:
* On the [PrestaShop Addons Marketplace](https://addons.prestashop.com/en/essentials/85751-prestashop-marketing-with-google-.html) (Latest stable release only)
* On the [releases page](https://github.com/PrestaShopCorp/psxmarketingwithgoogle/releases) of this repository (Stable & beta releases available)


Downloaded archives can be uploaded on PrestaShop instances, as detailed in the [user documentation](https://doc.prestashop.com/display/PS17/Modules+Selection#ModulesSelection-Uploadingamodulemanually).

## Building

This part covers the steps to get this project ready locally.

In order to run on a PrestaShop instance, dependencies needs to be downloaded and the JS application built.

### PHP

Retrieve dependencies with composer

```
composer install
# or
make composer-install
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

To compile and watch for new changes (development mode):

```
pnpm install

pnpm -r dev
```

## Dev environment

For getting a locally shop with the module installed, you can use the following commands:
```
make docker-up
```

It will create a docker container with a PrestaShop instance and the module installed and a phpMyAdmin instance.
You can configure the port for multiple instances & choose a specific version of PrestaShop.
All configuration is in the folder `e2e-env`.

## Testing

Tests will be run at each commit on this repository or any pull-request. These commands reproduce the checks done by the CI.

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

### QA Review

Each version need to be tested by the QA team before being sent to production.
This step is done once all pull-requests are merged in the base branch (`master` for instance).

To create a pre-release:
* Get the new version  by following the Semantic Versioning convention (SemVer),
* Check the version in the main class of the module and `config.xml` match the upcoming version, or update the values accordingly,
* Start creating a new release on the [releases page](https://github.com/PrestaShopCorp/pasmarketingwithgoogle/releases) with a tag that matches the version provided in the main class in the format `v1.XX.XX-beta.XX`.
* **Make sure to check the option "Set as a pre-release"**
* A proposal of change-log can be generated by GitHub to list all the merged pull-requests since the previous release. This list can be relevant for the QA team and can be sent as-is.
* Publish the release.

When created, several zip files will be attached to the release. Each of them is linked to a specific API environment (production, pre-production or integration), and the production zip is the one being sent to the marketplace.

### Deploying to production

Publishing on the marketplace can be done by creating a release on GitHub.

To publish a release:
* Use the version from the pre-release or get the new version by following the Semantic Versioning convention (SemVer),
* Check the version in the main class of the module and `config.xml` match the upcoming version, or update the values accordingly,
* Start creating a new release on the [releases page](https://github.com/PrestaShopCorp/pasmarketingwithgoogle/releases) with a tag that matches the version provided in the main class.
* A proposal of change-log can be generated by GitHub to list all the merged pull-requests since the previous release. Because this change-log will be sent to the marketplace along the archive, it is recommended to make it understandable to merchants.
* Publish the release.

When created, several zip files will be attached to the release. Each of them is linked to a specific API environment (production, pre-production or integration), and the production zip is the one being sent to the marketplace.

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

> [!WARNING]
> In case Storybook fails while loading with an error "Failed to fetch dynamically imported module: [...]/preview-[...].js", disable your ad-blocker and try again.

### Hook

The module registers itself to several hooks and adds the following features:

* actionCartUpdateQuantityBefore
  * Conversion tracking: Trigger the Conversion Action "Add to Cart"
* displayBackOfficeHeader
  * Menu: Fix the display of the Marketing tab
  * Website Verification: Trigger the verification & claim process every 30 days in the background of the BO dashboard.
  * Warning Messages: Display alerts on the BO dashboard about Marketing With Google
  * Warning Messages: Display a notice after the edition of a carrier advising to reconfigure shipping settings on the module
* displayHeader
  * Website verification: Display the Google Verification Tag
  * Conversion tracking: Display the Google Tag to init gtag()
  * Conversion tracking: Provide user data for [Enhanced conversions](https://support.google.com/google-ads/answer/9888656)
  * Conversion tracking: Purge & display events that could not be displayed (i.e triggered from Ajax requests)
* displayOrderConfirmation
  * Conversion tracking: Trigger the Conversion Action "Purchase"
* displayTop
  * Conversion tracking: Trigger the Conversion Action "Page view"

### Localization

Translated data is stored in the folder `_dev/packages/mktg-with-google-common/translations`.

Each hour, Crowdin will run several tasks on the repository:
* Data in the `en/` folder will be synchronized to Crowdin as source strings,
* Updates in the translated content on Crowdin will be sent back to the repository with a pull-request.

## Contributing

PrestaShop modules are open source extensions to the PrestaShop e-commerce platform. Everyone is welcome and even encouraged to contribute with their own improvements!

Just make sure to follow our contribution guidelines.

## Reporting issues

You can report issues with this module by using the link available in the module configuration page, in the "Help" tab.

## License

This module is released under the Academic Free License 3.0
