import {dateGenerator} from '../../utils/date-generator';

export const dailyResultsEmpty = {
  dailyResultList: [
    {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      averageCostPerClick: 0,
      costs: 0,
      sales: 0,
      date: dateGenerator(0)
    }
  ]
}

export const dailyResultNotPerformingData = {
  dailyResultList: Array.from(Array(30)).map((x, i) => ({
    impressions: 0,
    clicks: 0,
    conversions: 0,
    averageCostPerClick: 0,
    costs: 0,
    sales: 0,
    date: dateGenerator(i),
  })),
};

export const dailyResultsDatas = {
  dailyResultList: [
    {
      impressions: 12,
      clicks: 1256,
      conversions: 1504,
      averageCostPerClick: 75,
      costs: 8778,
      sales: 548,
      date: dateGenerator(0),
    },
    {
      impressions: 76,
      clicks: 12,
      conversions: 12,
      averageCostPerClick: 10,
      costs: 120,
      sales: 24000,
      date: dateGenerator(1),
    },
    {
      impressions: 66,
      clicks: 250,
      conversions: 104,
      averageCostPerClick: 175,
      costs: 107,
      sales: 568,
      date: dateGenerator(2),
    },
    {
      impressions: 112,
      clicks: 17,
      conversions: 11,
      averageCostPerClick: 445,
      costs: 1897,
      sales: 668,
      date: dateGenerator(3),
    },
    {
      impressions: 56,
      clicks: 256,
      conversions: 154,
      averageCostPerClick: 145,
      costs: 897,
      sales: 5668,
      date: dateGenerator(4),
    },
    {
      impressions: 120,
      clicks: 80,
      conversions: 0,
      averageCostPerClick: 101,
      costs: 180,
      sales: 4450,
      date: dateGenerator(5),
    },
    {
      impressions: null,
      clicks: null,
      conversions: null,
      averageCostPerClick: null,
      costs: null,
      sales: null,
      date: dateGenerator(6),
    },
    {
      impressions: 66,
      clicks: 250,
      conversions: 104,
      averageCostPerClick: 175,
      costs: 107,
      sales: 568,
      date: dateGenerator(7),
    },
    {
      impressions: 120,
      clicks: 80,
      conversions: 0,
      averageCostPerClick: 101,
      costs: 180,
      sales: 4450,
      date: dateGenerator(8),
    },
    {
      impressions: 120,
      clicks: 80,
      conversions: 0,
      averageCostPerClick: 101,
      costs: 180,
      sales: 4450,
      date: dateGenerator(9),
    },
    {
      impressions: 76,
      clicks: 12,
      conversions: 12,
      averageCostPerClick: 10,
      costs: 120,
      sales: 24000,
      date: dateGenerator(10),
    },
    {
      impressions: 12,
      clicks: 1256,
      conversions: 1504,
      averageCostPerClick: 75,
      costs: 8778,
      sales: 548,
      date: dateGenerator(11),
    },
    {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      averageCostPerClick: 0,
      costs: 0,
      sales: 0,
      date: dateGenerator(12),
    },
    {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      averageCostPerClick: 0,
      costs: 0,
      sales: 0,
      date: dateGenerator(13),
    },
    {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      averageCostPerClick: 0,
      costs: 0,
      sales: 0,
      date: dateGenerator(14),
    },
    {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      averageCostPerClick: 0,
      costs: 0,
      sales: 0,
      date: dateGenerator(15),
    },
    {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      averageCostPerClick: 0,
      costs: 0,
      sales: 0,
      date: dateGenerator(16),
    },
  ],
}

export const dailyResultsBigDatas = {
  dailyResultList: [
    {
      impressions: 3230,
      clicks: 1554,
      conversions: 21,
      averageCostPerClick: 1.64,
      costs: 4315,
      sales: 36772,
      date: dateGenerator(0)
    },
    {
      impressions: 137,
      clicks: 352,
      conversions: 32,
      averageCostPerClick: 1.28,
      costs: 4045,
      sales: 15280,
      date: dateGenerator(1)
    },
    {
      impressions: 2378,
      clicks: 539,
      conversions: 34,
      averageCostPerClick: 1.94,
      costs: 2026,
      sales: 25172,
      date: dateGenerator(2)
    },
    {
      impressions: 1659,
      clicks: 2119,
      conversions: 28,
      averageCostPerClick: 2.47,
      costs: 3803,
      sales: 23973,
      date: dateGenerator(3)
    },
    {
      impressions: 1687,
      clicks: 1800,
      conversions: 28,
      averageCostPerClick: 4.82,
      costs: 4234,
      sales: 23270,
      date: dateGenerator(4)
    },
    {
      impressions: 3508,
      clicks: 2508,
      conversions: 25,
      averageCostPerClick: 0.08,
      costs: 2033,
      sales: 9791,
      date: dateGenerator(5)
    },
    {
      impressions: 1187,
      clicks: 2801,
      conversions: 38,
      averageCostPerClick: 2.13,
      costs: 3459,
      sales: 16945,
      date: dateGenerator(6)
    },
    {
      impressions: 2365,
      clicks: 769,
      conversions: 29,
      averageCostPerClick: 1.53,
      costs: 1756,
      sales: 37475,
      date: dateGenerator(7)
    },
    {
      impressions: 1525,
      clicks: 2460,
      conversions: 34,
      averageCostPerClick: 4.31,
      costs: 4922,
      sales: 35833,
      date: dateGenerator(8)
    },
    {
      impressions: 2132,
      clicks: 919,
      conversions: 37,
      averageCostPerClick: 1.52,
      costs: 4975,
      sales: 6625,
      date: dateGenerator(9)
    },
    {
      impressions: 1906,
      clicks: 2333,
      conversions: 35,
      averageCostPerClick: 0.24,
      costs: 4828,
      sales: 14074,
      date: dateGenerator(10)
    },
    {
      impressions: 1973,
      clicks: 2687,
      conversions: 27,
      averageCostPerClick: 2.98,
      costs: 4708,
      sales: 2071,
      date: dateGenerator(11)
    },
    {
      impressions: 754,
      clicks: 1155,
      conversions: 40,
      averageCostPerClick: 3.49,
      costs: 4196,
      sales: 1238,
      date: dateGenerator(12)
    },
    {
      impressions: 142,
      clicks: 919,
      conversions: 31,
      averageCostPerClick: 1.85,
      costs: 2843,
      sales: 2644,
      date: dateGenerator(13)
    },
    {
      impressions: 2080,
      clicks: 1345,
      conversions: 26,
      averageCostPerClick: 2.24,
      costs: 2564,
      sales: 6586,
      date: dateGenerator(14)
    },
    {
      impressions: 3002,
      clicks: 1207,
      conversions: 21,
      averageCostPerClick: 2.31,
      costs: 722,
      sales: 13392,
      date: dateGenerator(15)
    },
    {
      impressions: 250,
      clicks: 1396,
      conversions: 34,
      averageCostPerClick: 0.93,
      costs: 1155,
      sales: 33245,
      date: dateGenerator(16)
    },
    {
      impressions: 3282,
      clicks: 2523,
      conversions: 32,
      averageCostPerClick: 1.3,
      costs: 1070,
      sales: 22787,
      date: dateGenerator(17)
    },
    {
      impressions: 2025,
      clicks: 1886,
      conversions: 35,
      averageCostPerClick: 3.92,
      costs: 2838,
      sales: 31690,
      date: dateGenerator(18)
    },
    {
      impressions: 3086,
      clicks: 238,
      conversions: 25,
      averageCostPerClick: 1.75,
      costs: 2178,
      sales: 35320,
      date: dateGenerator(19)
    },
    {
      impressions: 1090,
      clicks: 1681,
      conversions: 35,
      averageCostPerClick: 2.34,
      costs: 556,
      sales: 29750,
      date: dateGenerator(20)
    },
    {
      impressions: 3983,
      clicks: 1478,
      conversions: 29,
      averageCostPerClick: 1.06,
      costs: 2170,
      sales: 19438,
      date: dateGenerator(21)
    },
    {
      impressions: 422,
      clicks: 2390,
      conversions: 28,
      averageCostPerClick: 3.19,
      costs: 1134,
      sales: 24140,
      date: dateGenerator(22)
    },
    {
      impressions: 2579,
      clicks: 1301,
      conversions: 27,
      averageCostPerClick: 1.13,
      costs: 3658,
      sales: 3746,
      date: dateGenerator(23)
    },
    {
      impressions: 1339,
      clicks: 266,
      conversions: 32,
      averageCostPerClick: 4.09,
      costs: 1217,
      sales: 36066,
      date: dateGenerator(24)
    },
    {
      impressions: 1025,
      clicks: 841,
      conversions: 20,
      averageCostPerClick: 2.45,
      costs: 1853,
      sales: 19052,
      date: dateGenerator(25)
    },
    {
      impressions: 816,
      clicks: 1820,
      conversions: 24,
      averageCostPerClick: 4.82,
      costs: 2752,
      sales: 9859,
      date: dateGenerator(26)
    },
    {
      impressions: 1873,
      clicks: 1526,
      conversions: 30,
      averageCostPerClick: 1.74,
      costs: 4469,
      sales: 35708,
      date: dateGenerator(27)
    },
    {
      impressions: 1443,
      clicks: 1768,
      conversions: 40,
      averageCostPerClick: 1.63,
      costs: 3063,
      sales: 32777,
      date: dateGenerator(28)
    },
    {
      impressions: 1742,
      clicks: 795,
      conversions: 21,
      averageCostPerClick: 4.63,
      costs: 449,
      sales: 1849,
      date: dateGenerator(29)
    },
    {
      impressions: 26,
      clicks: 1936,
      conversions: 25,
      averageCostPerClick: 3.22,
      costs: 741,
      sales: 28340,
      date: dateGenerator(30)
    },
    {
      impressions: 1479,
      clicks: 2287,
      conversions: 39,
      averageCostPerClick: 3.27,
      costs: 2900,
      sales: 8175,
      date: dateGenerator(31)
    },
    {
      impressions: 981,
      clicks: 1201,
      conversions: 32,
      averageCostPerClick: 0.8,
      costs: 3965,
      sales: 16139,
      date: dateGenerator(32)
    },
    {
      impressions: 2544,
      clicks: 272,
      conversions: 40,
      averageCostPerClick: 3.56,
      costs: 3343,
      sales: 12939,
      date: dateGenerator(33)
    },
    {
      impressions: 1041,
      clicks: 727,
      conversions: 29,
      averageCostPerClick: 3.85,
      costs: 4969,
      sales: 21219,
      date: dateGenerator(34)
    },
    {
      impressions: 2672,
      clicks: 2496,
      conversions: 30,
      averageCostPerClick: 4.74,
      costs: 2789,
      sales: 34793,
      date: dateGenerator(35)
    },
    {
      impressions: 3654,
      clicks: 2693,
      conversions: 22,
      averageCostPerClick: 1.18,
      costs: 4523,
      sales: 30872,
      date: dateGenerator(36)
    },
    {
      impressions: 3842,
      clicks: 1137,
      conversions: 32,
      averageCostPerClick: 1.04,
      costs: 303,
      sales: 14793,
      date: dateGenerator(37)
    },
    {
      impressions: 3835,
      clicks: 1454,
      conversions: 34,
      averageCostPerClick: 0.57,
      costs: 4352,
      sales: 69,
      date: dateGenerator(38)
    },
    {
      impressions: 3593,
      clicks: 2955,
      conversions: 22,
      averageCostPerClick: 2.82,
      costs: 2911,
      sales: 18026,
      date: dateGenerator(39)
    },
    {
      impressions: 3438,
      clicks: 1294,
      conversions: 21,
      averageCostPerClick: 0.38,
      costs: 3651,
      sales: 38237,
      date: dateGenerator(40)
    },
    {
      impressions: 1907,
      clicks: 488,
      conversions: 33,
      averageCostPerClick: 3,
      costs: 3287,
      sales: 28340,
      date: dateGenerator(41)
    },
    {
      impressions: 236,
      clicks: 264,
      conversions: 35,
      averageCostPerClick: 4.36,
      costs: 4435,
      sales: 37796,
      date: dateGenerator(42)
    },
    {
      impressions: 2225,
      clicks: 687,
      conversions: 27,
      averageCostPerClick: 4.54,
      costs: 1628,
      sales: 34816,
      date: dateGenerator(43)
    },
    {
      impressions: 904,
      clicks: 1681,
      conversions: 29,
      averageCostPerClick: 4.85,
      costs: 539,
      sales: 39178,
      date: dateGenerator(44)
    },
    {
      impressions: 3185,
      clicks: 231,
      conversions: 31,
      averageCostPerClick: 2.79,
      costs: 986,
      sales: 22895,
      date: dateGenerator(45)
    },
    {
      impressions: 365,
      clicks: 2898,
      conversions: 29,
      averageCostPerClick: 1.47,
      costs: 4328,
      sales: 1434,
      date: dateGenerator(46)
    },
    {
      impressions: 988,
      clicks: 2006,
      conversions: 22,
      averageCostPerClick: 3.53,
      costs: 2715,
      sales: 22697,
      date: dateGenerator(47)
    },
    {
      impressions: 2530,
      clicks: 1842,
      conversions: 27,
      averageCostPerClick: 3.78,
      costs: 4272,
      sales: 35990,
      date: dateGenerator(48)
    },
    {
      impressions: 2432,
      clicks: 2046,
      conversions: 33,
      averageCostPerClick: 4.19,
      costs: 3135,
      sales: 37416,
      date: dateGenerator(49)
    },
    {
      impressions: 2683,
      clicks: 2332,
      conversions: 32,
      averageCostPerClick: 4.38,
      costs: 4815,
      sales: 21516,
      date: dateGenerator(50)
    },
    {
      impressions: 2193,
      clicks: 872,
      conversions: 22,
      averageCostPerClick: 3.21,
      costs: 3388,
      sales: 37069,
      date: dateGenerator(51)
    },
    {
      impressions: 320,
      clicks: 178,
      conversions: 24,
      averageCostPerClick: 3.25,
      costs: 4267,
      sales: 26071,
      date: dateGenerator(52)
    },
    {
      impressions: 3459,
      clicks: 1950,
      conversions: 38,
      averageCostPerClick: 1.67,
      costs: 3298,
      sales: 30698,
      date: dateGenerator(53)
    },
    {
      impressions: 2636,
      clicks: 1149,
      conversions: 23,
      averageCostPerClick: 4.56,
      costs: 3120,
      sales: 25535,
      date: dateGenerator(54)
    },
    {
      impressions: 3414,
      clicks: 2243,
      conversions: 32,
      averageCostPerClick: 4.01,
      costs: 1072,
      sales: 5780,
      date: dateGenerator(55)
    },
    {
      impressions: 64,
      clicks: 727,
      conversions: 24,
      averageCostPerClick: 1.53,
      costs: 1217,
      sales: 36174,
      date: dateGenerator(56)
    },
    {
      impressions: 926,
      clicks: 1966,
      conversions: 25,
      averageCostPerClick: 0.59,
      costs: 4931,
      sales: 12779,
      date: dateGenerator(57)
    },
    {
      impressions: 65,
      clicks: 732,
      conversions: 36,
      averageCostPerClick: 3.39,
      costs: 4931,
      sales: 7469,
      date: dateGenerator(58)
    },
    {
      impressions: 1285,
      clicks: 1548,
      conversions: 36,
      averageCostPerClick: 0.68,
      costs: 3996,
      sales: 37523,
      date: dateGenerator(59)
    }
  ],
}
