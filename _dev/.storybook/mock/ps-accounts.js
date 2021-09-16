export const contextPsAccountsNotConnected = {
psxName: "ps_accounts",
psIs17: true,
psAccountsIsInstalled: true,
psAccountsInstallLink: null,
psAccountsIsEnabled: true,
psAccountsEnableLink: "http://shop17.ps.localhost/administration/index.php/improve/modules/manage/action/enable/ps_accounts?_token=Kz1iDBxIP37pFsJ_bwobcqvts09rl3iu-jrAOxDk",
psAccountsIsUptodate: true,
psAccountsUpdateLink: null,
user: {
  uuid: null,
  email: null,
  emailIsValidated: false,
  isSuperAdmin: true
},
backendUser: {
  email: "antoine.metifeu@prestashop.com",
  employeeId: 1,
  isSuperAdmin: true
},
currentShop: {
  id: "1",
  name: "PrestaShop",
  domain: "shop17.ps.localhost",
  domainSsl: "shop17.ps.localhost",
  physicalUri: "/",
  uuid: "d80ca2fb-d65d-4832-863e-f624328dc1",
  publicKey: "-----BEGIN RSA PUBLIC KEY-----\r\nMIGJAoGBAMzdJDxSEpCZZdDOuK33M+9pVqUNq2yTMDteHWGeRRgKw6ooivA/oUrt\r\nrz/Mf9mQk9J2grA3OzoTRe51/vGjB91JPcEIFAWwS7fpxxoi+iepjEuWtF71\r\nS//ekhecTU9vlJ3f+d3PqpMf/twjZLqpQnpSSGGMcLGD5EVwV0SnAgMBAAE=\r\n-----END RSA PUBLIC KEY-----",
  employeeId: 1,
  user: {
    email: "antoine.metifeu+test13@prestashop.com",
    uuid: "IxMWePWaB9MVFigjkxEcI3x2"
  },
  url: "http://shop17.ps.localhost/administration/index.php?controller=AdminModules&configure=ps_accounts&setShopContext=s-1&token=de88195bd4ed4683f1e88ae8cfbc",
  isLinkedV4: false,
  multishop: true,
  moduleName: "ps_accounts",
  psVersion: "1.7.6.7"
},
isShopContext: true,
superAdminEmail: "antoine.metifeu@prestashop.com",
onboardingLink: "https://accounts.prestashop.localhost?shops=W10=",
ssoResendVerificationEmail: "https://prestashop-newsso-staging.appspot.com/account/send-verification-email",
manageAccountLink: "https://prestashop-newsso-staging.appspot.com/login?lang=en",
isOnboardedV4: false,
shops: [
  {
    id: "1",
    name: "Default",
    shops: [
      {
        id: "1",
        name: "PrestaShop",
        domain: "shop17.ps.localhost",
        domainSsl: "shop17.ps.localhost",
        physicalUri: "/",
        uuid: "d80ca2fb-d65d-4832-863e-ffe624328dc1",
        publicKey: "-----BEGIN RSA PUBLIC KEY-----\r\nMIGJAoGBAMzdJDxSEpCZZdDOuK33M+9pVqUNq2yTMDteHWGeRRgKw6ooivA/oUrt\r\nrz/Mf9mQk9J2grA3OzoTRe51/vGjB919P2QJFAWwS7fpxxoi+iepjEuWtF71\r\nS//ekhecTU9vlJ3f+d3PqpMf/twjZLqpQnpSSGGMcLGD5EVwV0SnAgMBAAE=\r\n-----END RSA PUBLIC KEY-----",
        employeeId: 1,
        user: {
          email: "antoine.metifeu+test13@prestashop.com",
          uuid: "IxMWeltQSPWaB9MVFigjkxEcI3x2"
        },
        url: "http://shop17.ps.localhost/administration/index.php?controller=AdminModules&configure=ps_accounts&setShopContext=s-1&token=de88195bd4ed4683f1e88ae83066cfbc",
        isLinkedV4: false,
        multishop: true,
        moduleName: "ps_accounts",
        psVersion: "1.7.6.7"
      },
    ],
    multishop: true,
    moduleName: "ps_accounts",
    psVersion: "1.7.6.7"
  },
],
adminAjaxLink: "http://shop17.ps.localhost/administration/index.php?controller=AdminAjaxPsAccounts&ajax=1&token=cdf160b067c4ab55d11608dede8f0e4d",
accountsUiUrl: "https://accounts.prestashop.localhost",
segmentApiKey: "",
dependencies: {
  ps_eventbus: {
    isInstalled: true,
    installLink: "http://shop17.ps.localhost/administration/index.php/improve/modules/manage/action/install/ps_eventbus?_token=Kz1iDBxIP37pFsJ_bwobcq70Svts09rl3iu-jrAOxDk",
    isEnabled: true,
    enableLink: "http://shop17.ps.localhost/administration/index.php/improve/modules/manage/action/enable/ps_eventbus?_token=Kz1iDBxIP37pFsJ_bwobcq70Svts09rl3iu-jrAOxDk"
  }
}
}
export const contextPsAccountsConnected = {
    ...contextPsAccountsNotConnected,
    user: {
        uuid: "IxMWeltQSPWaFigjkxEcI3x2",
        email: "antoine.metifeu+test13@prestashop.com",
        emailIsValidated: false,
        isSuperAdmin: true
    }
  
};

export const contextPsAccountsConnectedAndValidated = {
    ...contextPsAccountsConnected,
    user: {
        ...contextPsAccountsConnected.user,
        emailIsValidated: true,
    },
};


export default contextPsAccountsConnectedAndValidated;
