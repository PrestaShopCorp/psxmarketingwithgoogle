module.exports = function (router) {
  router.get('/ads-reporting/kpis/', (req, res) => {
    res.send({
      impressions: 32,
      clicks: 750,
      conversions: 658,
      averageCostPerClick: 0.2,
      costs: 321,
      sales: 18,
    });
    res.end();
  });
  router.get('/ads-reporting/daily-results/', (req, res) => {
    res.send({
      dailyResultList: [
        {
          impressions: 12,
          clicks: 1256,
          conversions: 1504,
          averageCostPerClick: 75,
          costs: 8778,
          sales: 548,
          date: '2020-10-22',
        },
        {
          impressions: 76,
          clicks: 12,
          conversions: 12,
          averageCostPerClick: 10,
          costs: 120,
          sales: 24000,
          date: '2020-10-23',
        },
        {
          impressions: 66,
          clicks: 250,
          conversions: 104,
          averageCostPerClick: 175,
          costs: 107,
          sales: 568,
          date: '2020-10-24',
        },
        {
          impressions: 112,
          clicks: 17,
          conversions: 11,
          averageCostPerClick: 445,
          costs: 1897,
          sales: 668,
          date: '2020-10-25',
        },
        {
          impressions: 56,
          clicks: 256,
          conversions: 154,
          averageCostPerClick: 145,
          costs: 897,
          sales: 5668,
          date: '2020-10-26',
        },
        {
          impressions: 120,
          clicks: 80,
          conversions: 0,
          averageCostPerClick: 101,
          costs: 180,
          sales: 4450,
          date: '2020-10-27',
        },
      ],
    });
    res.end();
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
