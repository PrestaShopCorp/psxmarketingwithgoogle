const {kpisEmpty, kpiDatas} = require('./mock/reporting/kpi.js');
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

    else res.send({})
  });

  router.get('/ads-reporting/kpis/', (req, res) => {
    let results = kpisEmpty;

    if (req.query.startDate === '00/00/0000') {
      results = kpiDatas
    } else if (req.query.startDate === '11/11/1111') {
      res.status(500)
    }
    res.send(results)
  });

  router.get('/ads-reporting/daily-results/', (req, res) => {
    let results = dailyResultsEmpty;

    if (req.query.startDate === '00/00/0000') {
      results = dailyResultsDatas
    } else if (req.query.startDate === '22/22/2222') {
      results = dailyResultsBigDatas
    } else if (req.query.startDate === '11/11/1111') {
      res.status(500)
    }
    res.send(results)
  });

  router.get('/ads-reporting/campaigns-performances', (req, res) => {
    res.send({
      campaignsPerformanceList: [
        {
          name: 'second campaign test',
          budget: 1,
          status: 'PAUSED',
          impressions: 0,
          clicks: 0,
          adSpend: 0,
          conversions: 0,
          sales: 0
        },
        {
          name: 'Campaign for Pokemon',
          budget: 1,
          status: 'ELIGIBLE',
          impressions: 275,
          clicks: 11,
          adSpend: 5.26,
          conversions: 1,
          sales: 851.5
        }
      ],
      "nextPageToken": 'amaury'
    });
    res.end();
  });

  router.get('/ads-reporting/products-performances', (req, res) => {
    res.send({
      productsPerformanceList: [
        {
          id: "8087-0-dt74r1z1ouzzxazjr6eyr8",
          name: "Mew",
          clicks: 0,
          costs: 0,
          averageCostPerClick: 0,
          conversions: 0,
          conversionsRate: 0,
          sales: 0
        },
        {
          id: "7942-0-o2bskdmbhuac8uf6zrolax",
          name: "Charizard",
          clicks: 0,
          costs: 0,
          averageCostPerClick: 0,
          conversions: 0,
          conversionsRate: 0,
          sales: 0
        },
        {
          id: "7937-0-a5hzckhjubxoguw136wmi7",
          name: "Bulbasaur",
          clicks: 0,
          costs: 0,
          averageCostPerClick: 0,
          conversions: 0,
          conversionsRate: 0,
          sales: 0
        },
        {
          id: "7961-0-aolfuacms7fnwauzoffrcr",
          name: "Pikachu",
          clicks: 0,
          costs: 0,
          averageCostPerClick: 0,
          conversions: 0,
          conversionsRate: 0,
          sales: 0
        },
        {
          id: "7942-0-nivqbsdgrp3jetnqmphylj",
          name: "Charizard",
          clicks: 0,
          costs: 0,
          averageCostPerClick: 0,
          conversions: 0,
          conversionsRate: 0,
          sales: 0
        },
        {
          id: "7961-0-9agy6hgaapwbxvicbh6vob",
          name: "Pikachu",
          clicks: 0,
          costs: 0,
          averageCostPerClick: 0,
          conversions: 0,
          conversionsRate: 0,
          sales: 0
        },
        {
          id: "7945-0-2gh9tty7rqd9nsplrtnrg5",
          name: "Blastoise",
          clicks: 0,
          costs: 0,
          averageCostPerClick: 0,
          conversions: 0,
          conversionsRate: 0,
          sales: 0
        },
        {
          id: "7961-0-qqmf95rxnq1vp4pe1pgsgo",
          name: "Pikachu",
          clicks: 0,
          costs: 0,
          averageCostPerClick: 0,
          conversions: 0,
          conversionsRate: 0,
          sales: 0
        },
        {
          id: "7961-0-58undqw78lk4mrz44d37kw",
          name: "Pikachu",
          clicks: 0,
          costs: 0,
          averageCostPerClick: 0,
          conversions: 0,
          conversionsRate: 0,
          sales: 0
        },
        {
          id: "7942-0-skin1abhtrwdtmzwfchvec",
          name: "Charizard",
          clicks: 0,
          costs: 0,
          averageCostPerClick: 0,
          conversions: 0,
          conversionsRate: 0,
          sales: 0
        }
      ]
    });
    res.end();
  });

  router.get('/ads-reporting/products-partitions-performances', (req, res) => {
    res.send({
      productsPartitionsPerformanceList: [],
    });
    res.end();
  });
}
