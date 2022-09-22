import {PrestaShopAccountsContext} from "@/store/modules/accounts/state";

export const contextPsAccountsNotConnected: PrestaShopAccountsContext = {
  currentContext: {
    type: 1,
    id: 1
  },
  psxName: "psxmarketingwithgoogle",
  psIs17: true,
  accountsUiUrl:"https://accounts.distribution.prestashop.net/en",
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
    id: "1",
    name: "PrestaShop",
    domain: "placeholder.ngrok.io",
    domainSsl: "placeholder.ngrok.io",
    physicalUri: "/",
    employeeId: 1,
    user: {
      email: null,
      emailIsValidated: false,
      isSuperAdmin: true,
    },
    isLinkedV4: false,
    multishop: false,
    moduleName: "psxmarketingwithgoogle",
    psVersion: "1.7.7.4",
    url: "https://placeholder.prestashop.com"
  },
  isShopContext: true,
  shops: [{"id":"1","name":"Default","shops":[{"id":"1","name":"PrestaShop","domain":"placeholder.ngrok.io","domainSsl":"placeholder.ngrok.io","physicalUri":"/","uuid":"d232f98c-65c2-4adc-9352-da5e949531c1","publicKey":"-----BEGIN RSA PUBLIC KEY-----\r\nMIGJAoGBALbXq5oLm/GzCcPb6LSUjgoOue/NHf+XJckP3vlplocTnSW15yKWEAQ0\r\nJPOFHWOhEW9dHxrdv2XUw1vyHhIK3KwJMQnbdzOV0Y0oDPnjIsm3TNhkvHIhq2F2\r\nlPgCW1T1LvLUc+JD2PEMw21W2J5LLDnF/vdnLkqdMMfSmR+34OmDAgMBAAE=\r\n-----END RSA PUBLIC KEY-----","employeeId":1,"url":"https://placeholder.ngrok.io/admin-dev/index.php?controller=AdminModules&configure=psxmarketingwithgoogle&setShopContext=s-1&token=ba2e131a1d891745a4e5389b890fc105","isLinkedV4":false}],"multishop":false,"moduleName":"psxmarketingwithgoogle","psVersion":"1.7.7.2"}],
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


export default contextPsAccountsConnectedAndValidated;
