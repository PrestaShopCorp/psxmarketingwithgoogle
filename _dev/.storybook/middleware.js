const {dateGenerator, dateTokenGenerator} = require('./utils/date-generator');
const {kpisEmpty, kpiDatas} = require('./mock/reporting/kpi.js');
const {campaignsPerformanceListEmpty, campaignsPerformanceList} = require('./mock/reporting/campaigns-performance.js');
const {productsPerformanceListEmpty, productsPerformanceList} = require('./mock/reporting/products-performance.js');
const {productsPartitionsPerformanceListEmpty, productsPartitionsPerformanceList} = require('./mock/reporting/products-partitions-performance.js');
const {nextPageTokenEmpty, nextPageToken} = require('./mock/reporting/next-page-token.js');
const {dailyResultsEmpty, dailyResultsDatas, dailyResultsBigDatas} = require('./mock/reporting/daily-results.js');
const express = require('express');

module.exports = function (router) {
  router.use(express.urlencoded({ extended: false }));
  router.use(express.json());

  router.post('/', (req, res) => {
    if (req.body.action === 'getShopConfigurationForGMC') {
      const items = ['Birmingham', 'Toulouse', 'Marseille', 'Strasbourg', 'Londres']
      const item = items[Math.floor(Math.random()*items.length)];
      res.send({
        "shop": {
          "name": "PrestaDoge",
          "url": "http://perdu.com/"
        },
        "store": {
          "streetAddress": "111 Richard Arrington Jr Blvd S",
          "locality": item,
          "region": "Alabama",
          "postalCode": "35233",
          "country": {
            "name": "United States",
            "iso_code": "US"
          },
          "phone": "0654879832"
        }
      })
    }
    if (req.body.action === 'getShopConfigurationForAds') {
      res.send({
        "timezone": {
          "offset":"+02:00",
          "text":"Europe\/Paris"
        },
        "currency":"EUR"
      })
    }
    if (req.body.action === 'getWebsiteRequirementStatus') {
      res.send({
        "requirements": {
          "shoppingAdsPolicies": true,
          "accurateContactInformation": true,
          "secureCheckoutProcessAndCollectionOfPersonalData": true,
          "billingTermsAndCollections": true,
          "completeCheckoutProcess": true
        }
      })
    }
    if (req.body.action === 'removeVerificationMeta') {
      res.send({
        "success": true,
        "method": "delete"
      })
    }
    if (req.body.action === 'setVerificationMeta') {
      res.send({
        "success": true,
        "method": "insert"
      })
    }
    if (req.body.action === 'toggleGoogleAccountIsRegistered') {
      res.send({
        "success": true
      })
    }
    if (req.body.action === 'setWebsiteRequirementStatus') {
      res.send({
        "success": true
      })
    }
  });

  router.get('/oauth', (req, res) => {
    res.send({
      "access_token":"foobar",
      "expiry_date": dateTokenGenerator(-1),
      "created_at": dateTokenGenerator(0),
      "details":{
        "email":"jpp@gmail.com",
        "picture":"",
        "verified_email":true
      },
      "prestashop_id":"65498",
      "account_id":"21465748"
    })
  });

  router.get('/ads-reporting/kpis/', (req, res) => {
    let results = kpisEmpty;

    if (
      req.query.startDate === dateGenerator(6) &&
      req.query.endDate === dateGenerator(0)
    ) {
      results = kpiDatas
    } else if (
      req.query.startDate === dateGenerator(1) &&
      req.query.endDate === dateGenerator(0)
    ) {
      res.status(500)
    }
    res.send(results)
  });

  router.get('/ads-reporting/daily-results/', (req, res) => {
    let results = dailyResultsEmpty;

    if (
      req.query.startDate === dateGenerator(6) &&
      req.query.endDate === dateGenerator(0)
    ) {
      results = dailyResultsDatas
    } else if (
      req.query.startDate === dateGenerator(59) &&
      req.query.endDate === dateGenerator(0)
    ) {
      results = dailyResultsBigDatas
    } else if (
      req.query.startDate === dateGenerator(1) &&
      req.query.endDate === dateGenerator(0)
    ) {
      res.status(500)
    }
    res.send(results)
  });

  router.get('/ads-reporting/campaigns-performances', (req, res) => {
    let results = {
      ...nextPageTokenEmpty,
      ...campaignsPerformanceListEmpty
    };

    if (
      req.query.startDate === dateGenerator(6) &&
      req.query.endDate === dateGenerator(0)
    ) {
      results = {
        ...nextPageToken,
        ...campaignsPerformanceList
      }
    } else if (
      req.query.startDate === dateGenerator(1) &&
      req.query.endDate === dateGenerator(0)
    ) {
      res.status(500)
    }
    res.send(results)
  });

  router.get('/ads-reporting/products-performances', (req, res) => {
    let results = {
      ...nextPageTokenEmpty,
      ...productsPerformanceListEmpty
    };

    if (
      req.query.startDate === dateGenerator(6) &&
      req.query.endDate === dateGenerator(0)
    ) {
      results = {
        ...nextPageToken,
        ...productsPerformanceList
      }
    } else if (
      req.query.startDate === dateGenerator(1) &&
      req.query.endDate === dateGenerator(0)
    ) {
      res.status(500)
    }
    res.send(results)
  });

  router.get('/ads-reporting/products-partitions-performances', (req, res) => {
    let results = {
      ...nextPageTokenEmpty,
      ...productsPartitionsPerformanceListEmpty
    };

    if (
      req.query.startDate === dateGenerator(6) &&
      req.query.endDate === dateGenerator(0)
    ) {
      results = {
        ...nextPageToken,
        ...productsPartitionsPerformanceList
      }
    } else if (
      req.query.startDate === dateGenerator(1) &&
      req.query.endDate === dateGenerator(0)
    ) {
      res.status(500)
    }
    res.send(results)
  });

  router.get('/merchant-accounts', (req, res) => {
    let results = [{
      "aggregatorId":"4404465089",
      "kind":"content#account",
      "id":"506712489489",
      "name":"placehplder.com",
      "websiteUrl":"https://placehplder.com/",
      "adultContent":false,
      "accountManagement":"manual",
      "adsLinks":[{
        "adsId":"6617778305",
        "status":"active",
      }],
      "users":[{
        "emailAddress":"jpp@gmail.com",
        "admin":true,
      }],
      "businessInformation":{
        "address":{
          "streetAddress":"17  rue du Fossé des Tanneurs 2ème étage",
          "locality":"Toulon",
          "postalCode":"93100",
          "country":"FR",
        },
        "phoneNumber":"+336224448877",
        "phoneVerificationStatus":"VERIFIED",
      },
    }];
    res.send(results);
  });

  router.get('/merchant-accounts/*', (req, res) => {
    let results = {
      merchantAccounts: {
        value: [
          {
            name: 'V Godard',
            id: '1234567890',
            adultContent: false,
            users: [
              {
                emailAddress: 'v.godard@maisonroyer.com',
                admin: true,
              },
            ],
            businessInformation: {
              address: {
                country: 'FR',
              },
            },
          },
        ],
      },
    };
    res.send(results);
  });

  router.get('/shopping-websites/site-verification/status', (req, res) => {
    let results = {
      "isVerified": true,
      "isClaimed": true,
      "isEnhancedFreeListingCompliant": {
        "status": false,
        "issues": []
      },
      "isSuspended": {
        "status": false,
        "issues": []
      },
      "isPhoneVerified": {
        "status": true,
        "issues": []
      }
    };
    res.send(results);
  });

  router.get('/incremental-sync/settings/*', (req, res) => {
    let results = {
      "targetCountries": [
        "FR"
      ],
      "shopId": "5b9b4f01-4005-4a86-9af0-68f200b4c5ce",
      "fullSync": true,
      "additionalShippingSettings": {
        "deliveryDetails": [
          {
            "maxHandlingTimeInDays": 1,
            "enabledCarrier": true,
            "maxTransitTimeInDays": 1,
            "country": "FR",
            "deliveryType": "delivery",
            "minTransitTimeInDays": 1,
            "delay": "Delivery next day!",
            "minHandlingTimeInDays": 0,
            "carrierId": "2",
            "name": "My carrier"
          }
        ]
      },
      "shippingSettings": [
        {
          "id": "1",
          "collection": "carriers",
          "properties": {
            "country_ids": "FR",
            "max_weight": 0,
            "max_height": 0,
            "grade": 0,
            "shipping_external": false,
            "id_carrier": "1",
            "external_module_name": "",
            "is_module": false,
            "free_shipping_starts_at_weight": 0,
            "url": "",
            "carrier_taxes_rates_group_id": "1",
            "max_depth": 0,
            "active": true,
            "currency": "EUR",
            "deleted": false,
            "is_free": true,
            "name": "PrestaShop",
            "shipping_handling": 0,
            "disable_carrier_when_out_of_range": false,
            "id_reference": "1",
            "free_shipping_starts_at_price": 0,
            "max_width": 0,
            "weight_unit": "kg",
            "need_range": false,
            "delay": "Pick up in-store"
          }
        },
        {
          "collection": "carrier_taxes",
          "properties": {
            "tax_rate": 20,
            "state_ids": "",
            "id_reference": "1",
            "id_carrier_tax": "1",
            "country_id": "FR"
          },
          "id": 1
        },
        {
          "properties": {
            "id_carrier": "2",
            "max_width": 0,
            "need_range": false,
            "free_shipping_starts_at_price": 0,
            "free_shipping_starts_at_weight": 0,
            "max_height": 0,
            "carrier_taxes_rates_group_id": "1",
            "grade": 0,
            "id_reference": "2",
            "currency": "EUR",
            "country_ids": "FR",
            "is_module": false,
            "active": true,
            "delay": "Delivery next day!",
            "external_module_name": "",
            "deleted": false,
            "shipping_external": false,
            "url": "",
            "is_free": false,
            "name": "My carrier",
            "shipping_handling": 2,
            "disable_carrier_when_out_of_range": false,
            "max_depth": 0,
            "weight_unit": "kg",
            "max_weight": 0
          },
          "id": "2",
          "collection": "carriers"
        },
        {
          "properties": {
            "state_ids": "",
            "shipping_method": "range_weight",
            "id_reference": "2",
            "id_carrier_detail": "1",
            "delimiter1": 0,
            "price": 5,
            "delimiter2": 10000,
            "country_ids": "FR"
          },
          "id": "2-1-0-1",
          "collection": "carrier_details"
        },
        {
          "collection": "carrier_taxes",
          "properties": {
            "state_ids": "",
            "tax_rate": 20,
            "id_carrier_tax": "1",
            "id_reference": "2",
            "country_id": "FR"
          },
          "id": 2
        },
        {
          "collection": "carriers",
          "properties": {
            "id_carrier": "3",
            "is_free": false,
            "external_module_name": "",
            "id_reference": "3",
            "name": "My cheap carrier",
            "country_ids": "FR",
            "disable_carrier_when_out_of_range": false,
            "max_height": 0,
            "shipping_handling": 2,
            "free_shipping_starts_at_weight": 0,
            "url": "",
            "carrier_taxes_rates_group_id": "1",
            "is_module": false,
            "active": false,
            "need_range": false,
            "weight_unit": "kg",
            "max_weight": 0,
            "deleted": false,
            "max_depth": 0,
            "currency": "EUR",
            "free_shipping_starts_at_price": 0,
            "delay": "Achetez plus vous paierez moins!",
            "max_width": 0,
            "shipping_external": false,
            "grade": 0
          },
          "id": "3"
        },
        {
          "collection": "carrier_details",
          "properties": {
            "shipping_method": "range_price",
            "id_carrier_detail": "2",
            "country_ids": "FR",
            "id_reference": "3",
            "price": 3,
            "delimiter2": 50,
            "state_ids": "",
            "delimiter1": 0
          },
          "id": "3-1-1-2"
        },
        {
          "collection": "carrier_details",
          "properties": {
            "id_carrier_detail": "3",
            "state_ids": "",
            "price": 1,
            "id_reference": "3",
            "country_ids": "FR",
            "delimiter2": 100,
            "delimiter1": 50,
            "shipping_method": "range_price"
          },
          "id": "3-1-1-3"
        },
        {
          "properties": {
            "country_ids": "FR",
            "delimiter2": 200,
            "id_reference": "3",
            "shipping_method": "range_price",
            "state_ids": "",
            "id_carrier_detail": "4",
            "price": 0,
            "delimiter1": 100
          },
          "id": "3-1-1-4",
          "collection": "carrier_details"
        },
        {
          "collection": "carrier_taxes",
          "id": 3,
          "properties": {
            "id_carrier_tax": "1",
            "tax_rate": 20,
            "state_ids": "",
            "country_id": "FR",
            "id_reference": "3"
          }
        },
        {
          "properties": {
            "max_height": 0,
            "weight_unit": "kg",
            "shipping_external": false,
            "is_free": false,
            "name": "My light carrier",
            "id_carrier": "4",
            "grade": 0,
            "id_reference": "4",
            "external_module_name": "",
            "country_ids": "FR",
            "currency": "EUR",
            "max_width": 0,
            "free_shipping_starts_at_weight": 0,
            "disable_carrier_when_out_of_range": false,
            "is_module": false,
            "carrier_taxes_rates_group_id": "1",
            "max_depth": 0,
            "shipping_handling": 2,
            "free_shipping_starts_at_price": 0,
            "url": "",
            "max_weight": 0,
            "active": false,
            "delay": "Panier léger, prix allégé!",
            "need_range": false,
            "deleted": false
          },
          "id": "4",
          "collection": "carriers"
        },
        {
          "collection": "carrier_details",
          "properties": {
            "state_ids": "",
            "delimiter1": 0,
            "id_reference": "4",
            "delimiter2": 1,
            "shipping_method": "range_weight",
            "id_carrier_detail": "2",
            "price": 0,
            "country_ids": "FR"
          },
          "id": "4-1-0-2"
        },
        {
          "collection": "carrier_details",
          "properties": {
            "shipping_method": "range_weight",
            "delimiter1": 1,
            "price": 2,
            "id_reference": "4",
            "id_carrier_detail": "3",
            "delimiter2": 3,
            "country_ids": "FR",
            "state_ids": ""
          },
          "id": "4-1-0-3"
        },
        {
          "collection": "carrier_details",
          "properties": {
            "state_ids": "",
            "country_ids": "FR",
            "price": 5,
            "id_carrier_detail": "4",
            "id_reference": "4",
            "delimiter1": 3,
            "shipping_method": "range_weight",
            "delimiter2": 10000
          },
          "id": "4-1-0-4"
        },
        {
          "collection": "carrier_taxes",
          "id": 4,
          "properties": {
            "id_reference": "4",
            "state_ids": "",
            "id_carrier_tax": "1",
            "country_id": "FR",
            "tax_rate": 20
          }
        }
      ],
      "autoImportShippingSettings": true,
      "attributeMapping": {
      },
      "productsPerBatchSync": 100,
      "enabled": true,
      "syncSchedule": "À 01:00, tous les jours",
      "updatedAt": "2021-11-24T15:47:47.268Z",
      "autoImportTaxSettings": false
    };
    res.send(results);
  });

  router.get('/incremental-sync/status/*', (req, res) => {
    let results = {
      "syncSchedule": "À 01:00, tous les jours",
      "nextJobAt": "2021-11-26T01:00:00.000Z",
      "jobEndedAt": null,
      "lastUpdatedAt": null,
      "success": false
    };
    res.send(results);
  });

  router.get('/shopping-campaigns/dimensions/filters', (req, res) => {
    let results = {
      value: {
        categories: [
          {
            resourceName: 'productBiddingCategoryConstants/US~LEVEL1~1',
            level: 'LEVEL1',
            status: 'ACTIVE',
            id: '1',
            countryCode: 'US',
            languageCode: 'en',
            name: 'Animals & Pet Supplies',
          },
        ],
        brands: [],
        products: [],
      },
    };
    res.send(results);
  });
};
