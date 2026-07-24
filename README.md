# Pakistan Petrol Price Forecast

A static, Vercel-ready forecast website. It uses plain HTML, CSS and JavaScript,
with Chart.js loaded from a CDN. There is no database, backend, login or build
step. For routine updates, edit only `data.js`.

## Model used

```text
predicted price = current official price
  + 1.13 × (current official price − 108.46)
  × (((latest 7-day Brent average × latest FX)
     / (previous 7-day Brent average × previous FX)) − 1)
```

Model `v2.1-brent-rolling` uses two overlapping seven-trading-day Brent windows.
It is a simplified public-data proxy, not the Government of Pakistan's formula.
The temporary beta of 1.13 is calibrated from one observed forecast error.
Keep each published forecast unchanged so the public track record remains honest.

## Files

- `index.html` — page content
- `styles.css` — responsive design
- `app.js` — calculations, table and chart
- `data.js` — the only daily-edit file

## One-hour launch: GitHub and Vercel

### Minutes 0–10: create the GitHub repository

1. Sign in to GitHub and choose **New repository**.
2. Name it `pakistan-petrol-forecast`.
3. Choose **Public** or **Private**, then create it.
4. Unzip this package on your computer.
5. In the new GitHub repository, choose **Add file → Upload files**.
6. Drag the four website files and this README into the upload area.
7. Choose **Commit changes**.

### Minutes 10–25: deploy on Vercel

1. Sign in to Vercel using GitHub.
2. Choose **Add New → Project**.
3. Import `pakistan-petrol-forecast`.
4. If Vercel asks for a framework, select **Other**.
5. Leave the build command and output directory empty.
6. Choose **Deploy**.
7. Open the supplied `vercel.app` address and check the forecast, table and chart.

There are no environment variables, API keys, packages or build commands.

### Minutes 25–45: connect petrol.ahmednisar.com

1. In Vercel, open the project.
2. Go to **Settings → Domains**.
3. Add `petrol.ahmednisar.com`.
4. Vercel will show the required DNS record.
5. Open the DNS manager for `ahmednisar.com`.
6. Add the record exactly as Vercel displays it. For a subdomain, this is
   commonly a CNAME with name `petrol`, but use Vercel's displayed value.
7. Return to Vercel and choose **Refresh** or **Verify**.

The `vercel.app` address works immediately after deployment. Custom-domain DNS
may take longer to propagate, depending on the DNS provider.

### Minutes 45–60: verify

Check the page on desktop and a phone:

- Forecast price is Rs. 338.04 for the included example.
- Expected increase is Rs. 6.52 and +1.97%.
- Suggested range is Rs. 336.54–339.54.
- The history table begins on 20 July 2026.
- The chart shows predicted and official prices.
- Horizontal scrolling works for the table on a narrow phone.

## Daily update workflow

Edit only `data.js` through GitHub's pencil button.

### After the government price is announced

1. Open `data.js`.
2. Add a compact completed record to the end of `history`.
3. Use the effective price date as `date`.
4. Add the forecast shown publicly as `predictedPrice`.
5. Add the government-announced price as `officialPrice`.
6. Preserve the model version used for that forecast.

Example completed record:

```js
{
  date: "2026-07-25",
  predictedPrice: 338.04,
  officialPrice: 337.50,
  modelVersion: "v2.1-brent-rolling"
}
```

### Create the next forecast

Replace the values inside `currentForecast`. Keep exactly eight consecutive
trading-day closes so the code can build the previous and latest seven-day windows:

```js
currentForecast: {
  forecastDate: "2026-07-26",
  announcementDate: "2026-07-25",
  currentOfficialPrice: 337.50,
  previousFx: 277.90,
  latestFx: 277.88,
  createdAt: "2026-07-24T19:35:00Z",
  brentCloses: [
    { date: "2026-07-15", close: 84.95 },
    { date: "2026-07-16", close: 84.23 },
    { date: "2026-07-17", close: 88.10 },
    { date: "2026-07-20", close: 89.22 },
    { date: "2026-07-21", close: 91.01 },
    { date: "2026-07-22", close: 94.07 },
    { date: "2026-07-23", close: 100.69 },
    { date: "2026-07-24", close: 101.20 }
  ]
}
```

Use one consistent ICE Brent settlement series. Never mix settlement, last-trade,
CFD or different contract series. On a market holiday or weekend, do not invent
a close. Keep the precise contract and source details in your private records.

Choose **Commit changes**. Vercel will automatically publish the update.

## Important operating rules

- Never edit an old prediction after learning the official price.
- Keep the latest eight consecutive valid trading-day Brent settlements.
- Always enter prices as numbers without commas or quotation marks.
- Use dates in `YYYY-MM-DD` format.
- Keep `createdAt` in ISO 8601 format, preferably UTC ending in `Z`.
- The first history row has no earlier official price in this data file, so its
  direction score is shown as unavailable.
- If Chart.js cannot load because the visitor is offline, the forecast and
  history table still work; only the chart is unavailable.
