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
}
