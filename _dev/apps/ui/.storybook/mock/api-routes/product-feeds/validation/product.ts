import { ProductIssue } from "@/components/render-issues/types";

export const productIssuesMock = {
  "7937-0": {
    issues: [
      {
        title: "Valeur manquante [prix]",
        impact: "Empêche la diffusion (Belgique, France et Italie)",
        countries: ["BE", "FR", "IT"],
        severity: "ERROR",
        htmlContent:
          '<div class="issue-detail"><div class="issue-content"><p class="content-element"><span class="segment">Ajoutez cet attribut à vos données produit</span></p><a href="https://support.google.com/merchants/answer/7052112?hl=fr" class="content-element">En savoir plus</a><p class="content-element content-moderation"></p></div></div>',
      },
      {
        title: "Devise incorrecte [prix]",
        impact: "Limite la visibilité (Belgique, France et Italie)",
        countries: ["BE", "FR", "IT"],
        severity: "WARNING",
        htmlContent:
          '<div class="issue-detail"><div class="issue-content"><p class="content-element"><span class="segment">Indiquez une devise acceptée dans le pays de vente</span></p><a href="https://support.google.com/merchants/answer/160637?hl=fr" class="content-element">En savoir plus</a><p class="content-element content-moderation"></p></div></div>',
      },
      {
        title:
          "Performances limitées en raison d'identifiants manquants [gtin, référence fabricant, marque]",
        impact: "Limite la visibilité (France et Italie)",
        countries: ["FR", "IT"],
        severity: "WARNING",
        htmlContent:
          '<div class="issue-detail"><div class="issue-content"><p class="content-element"><span class="segment">Ajoutez une marque, et un code GTIN ou une référence fabricant. Si ce produit est unique en son genre ou vintage, vous n&#39;avez pas besoin d&#39;ajouter d&#39;identifiant.</span></p><a href="https://support.google.com/merchants/answer/6098295?hl=fr" class="content-element">En savoir plus</a><p class="content-element content-moderation"></p></div></div>',
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
    ] as ProductIssue[],
    productId: "7937-0",
    productCurrency: "EUR",
    productLanguage: "fr",
  },
};

export const defaultProductIssuesMock = productIssuesMock["7937-0"];
