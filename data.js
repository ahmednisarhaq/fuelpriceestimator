/*
  DAILY EDIT FILE — this is the only file you need to change.

  Daily workflow:
  1. After the official announcement, add the completed forecast to `history`.
  2. Add the newest ICE Brent settlement to the end of `brentCloses`.
  3. Keep exactly the latest 8 consecutive trading-day closes.
  4. Update both FX values, the current official price and the dates.
  5. Commit this file to GitHub. Vercel will republish automatically.

  Keep decimal values as numbers (for example 94.07), not quoted text.
  Dates use YYYY-MM-DD. Times use ISO 8601, preferably UTC ending in Z.
  Always use the same Brent series. Model v2.1 is calibrated to settlement-style
  closes; do not mix settlements with last-trade or CFD closing values.
*/

window.PETROL_DATA = {
  model: {
    version: "v2.1-brent-rolling",
    rollingWindow: 7,
    beta: 1.13,
    fixedComponents: 108.46,
    forecastRange: 1.5
  },

  currentForecast: {
    forecastDate: "2026-07-25",
    announcementDate: "2026-07-24",
    currentOfficialPrice: 331.52,
    previousFx: 277.91,
    latestFx: 277.90,
    createdAt: "2026-07-23T19:35:00Z",
    brentCloses: [
      { date: "2026-07-14", close: 84.73 },
      { date: "2026-07-15", close: 84.95 },
      { date: "2026-07-16", close: 84.23 },
      { date: "2026-07-17", close: 88.10 },
      { date: "2026-07-20", close: 89.22 },
      { date: "2026-07-21", close: 91.01 },
      { date: "2026-07-22", close: 94.07 },
      { date: "2026-07-23", close: 100.69 }
    ]
  },

  // Keep one record per government price date. Newest or oldest order both work.
  history: [
    {
      date: "2026-07-20",
      brentTradingDate: "2026-07-17",
      brentClose: 88.10,
      usdPkr: 277.96,
      predictedPrice: 316.03,
      officialPrice: 315.80
    },
    {
      date: "2026-07-21",
      brentTradingDate: "2026-07-20",
      brentClose: 89.22,
      usdPkr: 277.95,
      predictedPrice: 320.36,
      officialPrice: 320.73
    },
    {
      date: "2026-07-22",
      brentTradingDate: "2026-07-21",
      brentClose: 91.01,
      usdPkr: 277.92,
      predictedPrice: 327.26,
      officialPrice: 327.12
    },
    {
      date: "2026-07-23",
      brentTradingDate: "2026-07-22",
      brentClose: 94.07,
      usdPkr: 277.91,
      predictedPrice: 339.12,
      officialPrice: 331.52,
      modelVersion: "v1"
    }
  ]
};
