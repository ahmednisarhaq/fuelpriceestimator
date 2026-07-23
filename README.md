# Pakistan Petrol Price Forecast

A static, Vercel-ready forecast website. It uses plain HTML, CSS and JavaScript,
with Chart.js loaded from a CDN. There is no database, backend, login or build
step. For routine updates, edit only `data.js`.

## Model used

```text
predicted price =
2.2183486 × ((Brent close × USD/PKR) / 158.99) − 25.6510436
```

This formula is an experimental model fitted to three observations. Keep each
published forecast unchanged so the public track record remains honest.

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

- Forecast price is Rs. 339.12 for the included example.
- Expected increase is Rs. 12.00 and +3.67%.
- The history table begins on 20 July 2026.
- The chart shows predicted and official prices.
- Horizontal scrolling works for the table on a narrow phone.

## Daily update workflow

Edit only `data.js` through GitHub's pencil button.

### After the government price is announced

1. Open `data.js`.
2. Copy the completed `currentForecast` into a new object at the end of `history`.
3. Rename `forecastDate` to `date`.
4. Add the prediction shown publicly as `predictedPrice`.
5. Add the government-announced price as `officialPrice`.

Example completed record:

```js
{
  date: "2026-07-23",
  brentTradingDate: "2026-07-22",
  brentClose: 94.07,
  usdPkr: 277.91,
  predictedPrice: 339.12,
  officialPrice: 338.75
}
```

### Create the next forecast

Replace the values inside `currentForecast`:

```js
currentForecast: {
  forecastDate: "2026-07-24",
  brentTradingDate: "2026-07-23",
  brentClose: 95.00,
  usdPkr: 277.90,
  previousOfficialPrice: 338.75,
  createdAt: "2026-07-23T22:05:00Z"
}
```

Use the preceding valid ICE Brent trading day's close. On a market holiday or
weekend, use the most recent valid trading-day close. Keep the precise contract
and data-source details in your private records, even though the public page
does not show an input or methodology card.

Choose **Commit changes**. Vercel will automatically publish the update.

## Important operating rules

- Never edit an old prediction after learning the official price.
- Always enter prices as numbers without commas or quotation marks.
- Use dates in `YYYY-MM-DD` format.
- Keep `createdAt` in ISO 8601 format, preferably UTC ending in `Z`.
- The first history row has no earlier official price in this data file, so its
  direction score is shown as unavailable.
- If Chart.js cannot load because the visitor is offline, the forecast and
  history table still work; only the chart is unavailable.
