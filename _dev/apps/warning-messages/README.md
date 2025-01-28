# Warning Messages Application

## Overview
The Warning Messages application is a component of the PS Marketing module for PrestaShop. It provides merchants with real-time notifications about their configuration status directly in their BackOffice Dashboard.

### Purpose
- Notify merchants about configuration issues that need attention
- Provide actionable insights for account improvement
- Display clear, user-friendly warning messages with action buttons
- Help maintain optimal account configuration

### Tech Stack
- TypeScript
- Webpack
- Jest for testing
- Sentry for error tracking
- Integration with PS Marketing onboarding API

### Core Components
- `WarningElement`: Creates and manages warning message UI components
- Warning message generator
- Onboarding client integration
- Sentry error tracking

## Usage

The warning system automatically initializes when the merchant accesses their BackOffice Dashboard. It:
1. Checks for configuration issues
2. Displays relevant warning messages
3. Provides action buttons when applicable
4. Updates dynamically as configurations change

### Example Warning Message
```typescript
buildWarningMessages(["IT_APPEARS_THAT_YOU_HAVE_NOT_FINALISED_YOUR_CONFIGURATION"],{
  isoCode: "en",
  link: "configuration-page"
});
```
