# PrestaShop Cache Directory Provider for Modules

This repository provides the cache directory for PrestaShop modules.

## Pre-requisites

You should install this library only on a PrestaShop environment and with PHP 5.6.0 minimum.

## Installation

```
composer require prestashop/module-lib-cache-directory-provider
```

When this project is successfully added to your dependencies, you can add the new CacheDirectoryProvider to your module and use it.

## Usage

To use this library, it's simple :
```
    $cacheDirectoryProvider = new CacheDirectoryProvider(
                _PS_VERSION_,
                _PS_ROOT_DIR_,
                _PS_MODE_DEV_
            );
```
With the getPath() function, you will retrieve the cache path of your module :
```
    $cacheDirectoryProvider->getPath();
```
