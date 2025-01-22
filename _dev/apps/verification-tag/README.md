# Verification Tag

The verification tag app is a crucial component of the PS Marketing module that handles Google site verification for PrestaShop stores.
A verification tag is an HTML meta tag used to confirm ownership of a website with Google services. It appears in the `<head>` section of your website's HTML and looks like this:

```html
<meta name="google-site-verification" content="your_verification_code" />
```

## Core Functionality

The verification tag app manages the verification process through several steps:

1. **Token Retrieval**: The app fetches a site verification token from PS Marketing API
2. **Token Storage**: Stores the verification token in the PrestaShop shop configuration
3. **Verification Process**: Handles the verification process with Google through PS Marketing API
4. **Website Claiming**: Claims the website with Google (with safety checks to prevent overwriting existing claims) through PS Marketing API
