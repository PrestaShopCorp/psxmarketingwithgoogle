# ps_googleshopping

## microcks

### setup
### Development

#### Environment customization

By default, PHP will define data to the Vue.js application that are related to the production.

In case you need to modify these variables during while maintaining this project, you may
overwrite them by creating a file `.env` in the root directory of this module, and using the
keys that can be found in `classes/config/Config.php`.

For instance to modify the base URL of the services for a local one:

```
PSX_GOOGLE_SHOPPING_API_URL=https://localhost:8080
```

#### Microcks

To use microcks change PSX_GOOGLE_SHOPPING_API_URL in Config.php class to:
```
PSX_GOOGLE_SHOPPING_API_URL=https://mock-googleshopping-api.psessentials-integration.net/
```
