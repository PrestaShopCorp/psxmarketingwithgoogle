export const contextPsAccountsNotConnected = {
    psxName: "ps_googleshopping",
    psIs17: true,
    psAccountsIsInstalled: true,
    psAccountsInstallLink: null,
    psAccountsIsEnabled: true,
    psAccountsEnableLink: null,
    psAccountsIsUptodate: true,
    psAccountsUpdateLink: null,
    onboardingLink: "https://localhost",
    user: {
        email: null,
        emailIsValidated: false,
        isSuperAdmin: true,
    },
    currentShop: {
        id: "2",
        name: "PrestaDoge (Pokemon)",
        domain: "localhost",
        domainSsl: "localhost",
        url: "https://localhost",
    },
    isShopContext: true,
    shops: [],
    superAdminEmail: "some@email.com",
    ssoResendVerificationEmail: "https:\/\/auth.prestashop.com\/account\/send-verification-email",
    manageAccountLink: "https:\/\/auth.prestashop.com\/login",
    adminAjaxLink: "https://localhost",
    dependencies: {
        ps_eventbus: {
            isInstalled: true,
            installLink: "https://localhost",
            isEnabled: true,
            enableLink: "https://localhost"
        },
    },
};

export const contextPsAccountsConnected = {
    ...contextPsAccountsNotConnected,
    "user": {
      "email": "doge@thedog.com",
      "emailIsValidated": false,
      "isSuperAdmin": true
    },
};

export const contextPsAccountsConnectedAndValidated = {
    ...contextPsAccountsConnected,
    "user": {
        ...contextPsAccountsConnected.user,
        "emailIsValidated": true,
    },
};

export default {
    contextPsAccounts: contextPsAccountsNotConnected,
};
