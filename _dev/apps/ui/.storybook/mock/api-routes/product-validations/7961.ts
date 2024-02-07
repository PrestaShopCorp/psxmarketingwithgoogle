export default {
  issues: [
    {
      title: "Unavailable mobile landing page",
      message: "Prevents from showing in France",
      severity: "ERROR",
      countries: ["FR"],
      htmlContent:
        '<div class="issue-detail"><div class="issue-content"><p class="content-element"><span class="segment">The product page was unavailable for Google to check. Update your online store so that your product page can be viewed from mobile devices. You can then request Google to check your website to resolve this issue.</span></p><p class="content-element root-causes-intro"><span class="segment">Make sure your online store meets the following requirements</span></p><ul class="content-element root-causes"><li><p><span class="segment">Your online store and product page are available for mobile devices</span></p></li><li><p><span class="segment">Your online store doesn\'t restrict Google from accessing your product page</span></p></li><li><p><span class="segment">The link to the product page is correct</span></p></li></ul><a href="https://support.google.com/merchants/answer/6098296?hl=en" class="content-element">How to fix unavailable mobile landing page</a><p class="content-element content-moderation"></p></div></div>',
      actions: [
        {
          externalAction: {
            type: "REVIEW_PRODUCT_ISSUE_IN_MERCHANT_CENTER",
            uri: "https://merchants.google.com/mc/items/details?a=730762435&hl=en&offerId=4-18&channel=0&feedLabel=EUR&language=en",
          },
          buttonLabel: "Request website check",
          isAvailable: true,
        },
      ],
      impacts: [
        { currency: "EUR", language: "en", attribute: "18" },
        { currency: "EUR", language: "fr", attribute: "18" },
      ],
    },
    {
      title: "Unavailable desktop landing page",
      message: "Prevents from showing in France",
      severity: "ERROR",
      countries: ["FR"],
      htmlContent:
        '<div class="issue-detail"><div class="issue-content"><p class="content-element"><span class="segment">The product page was unavailable for Google to check. Update your online store so that your product page can be viewed from desktop devices. You can then request Google to check your website to resolve this issue.</span></p><p class="content-element root-causes-intro"><span class="segment">Make sure your online store meets the following requirements</span></p><ul class="content-element root-causes"><li><p><span class="segment">Your online store and product page are available for desktop devices</span></p></li><li><p><span class="segment">Your online store doesn\'t restrict Google from accessing your product page</span></p></li><li><p><span class="segment">The link to the product page is correct</span></p></li></ul><a href="https://support.google.com/merchants/answer/6098155?hl=en" class="content-element">How to fix unavailable desktop landing page</a><p class="content-element content-moderation"></p></div></div>',
      actions: [
        {
          externalAction: {
            type: "REVIEW_PRODUCT_ISSUE_IN_MERCHANT_CENTER",
            uri: "https://merchants.google.com/mc/items/details?a=730762435&hl=en&offerId=4-17&channel=0&feedLabel=EUR&language=fr",
          },
          buttonLabel: "Request website check",
          isAvailable: true,
        },
      ],
      impacts: [
        { currency: "EUR", language: "en", attribute: "16" },
        { currency: "EUR", language: "fr", attribute: "16" },
        { currency: "EUR", language: "en", attribute: "17" },
        { currency: "EUR", language: "fr", attribute: "17" },
      ],
    },
    {
      title: "Valeur d'attribut incorrecte [lien image]",
      impact: "Limite la visibilité (Belgique, France et Italie)",
      countries: ["BE", "FR", "IT"],
      severity: "WARNING",
      htmlContent:
        '<div class="issue-detail"><div class="issue-content"><p class="content-element"><span class="segment">Les informations détaillées sur vos produits ne respectent pas les exigences concernant les annonces Discovery et/ou les annonces de génération de la demande. Si vous n&#39;êtes pas d&#39;accord, demandez un examen dans Merchant Center.</span></p><a href="https://support.google.com/merchants/answer/13389785?hl=fr" class="content-element">En savoir plus</a><p class="content-element content-moderation">Google a détecté ce problème grâce à des vérifications automatisées</p></div></div>',
    },
    {
      title: "Langue incorrecte",
      severity: "INFO",
      htmlContent:
        '<div class="issue-detail"><div class="issue-content"><p class="content-element"><span class="segment">La langue utilisée dans les informations détaillées sur vos produits doit correspondre à la langue du pays dans lequel vous souhaitez diffuser vos produits.</span></p><p class="content-element"><span class="segment">Vous devez envoyer les informations détaillées sur vos produits dans une langue acceptée dans le pays, et vous assurer que la langue de votre boutique en ligne est identique.</span></p><a href="https://support.google.com/merchants/answer/6101164?hl=fr" class="content-element">En savoir plus</a><a href="https://support.google.com/merchants/answer/160637?hl=fr" class="content-element">En savoir plus sur les langues acceptées</a><p class="content-element content-moderation"></p></div></div>',
    },
  ],
};
