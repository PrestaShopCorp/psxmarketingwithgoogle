UPDATE `ps_psgdpr_consent` psgdpr
LEFT JOIN  ps_psgdpr_consent_lang psgdprl ON (psgdpr.id_gdpr_consent = psgdprl.id_gdpr_consent)
SET psgdprl.message = "J'accepte les conditions générales et la politique de confidentialité"
WHERE psgdprl.id_lang = (SELECT id_lang from ps_lang where iso_code = 'fr');

UPDATE `ps_psgdpr_consent` psgdpr
LEFT JOIN  ps_psgdpr_consent_lang psgdprl ON (psgdpr.id_gdpr_consent = psgdprl.id_gdpr_consent)
SET psgdprl.message = "I accept the terms and conditions and the privacy policy"
WHERE psgdprl.id_lang = (SELECT id_lang from ps_lang where iso_code = 'gb');
