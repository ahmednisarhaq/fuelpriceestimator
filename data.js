/*
  DAILY EDIT FILE — this is the only file you need to change.

  Evening workflow:
  1. Move yesterday's completed forecast into `history`.
  2. Add the official price announced by the government.
  3. Replace `currentForecast` with the next forecast's inputs.
  4. Commit this file to GitHub. Vercel will republish automatically.

  Keep decimal values as numbers (for example 94.07), not quoted text.
  Dates use YYYY-MM-DD. Times use ISO 8601, preferably UTC ending in Z.
*/

window.PETROL_DATA = {
  model: {
    slope: 2.2183486,
    intercept: -25.6510436,
    barrelLitres: 158.99,
    version: "v1"
  },

  currentForecast: {
    forecastDate: "2026-07-23",
    brentTradingDate: "2026-07-22",
    brentClose: 94.07,
    usdPkr: 277.91,
    previousOfficialPrice: 327.12,
    createdAt: "2026-07-22T22:05:00Z"
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
    }
  ]
};
