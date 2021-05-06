# ps_googleshopping

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

**Setup**

When running for the fist time run command: make build-microcks
After microcks is installed run: make run-microcks
When microcks is running you can access it by opening [microcks](http://localhost:8080/).
