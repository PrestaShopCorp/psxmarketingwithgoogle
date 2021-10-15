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
}
