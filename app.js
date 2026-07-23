(() => {
  "use strict";

  const data = window.PETROL_DATA;
  if (!data || !data.model || !data.currentForecast || !Array.isArray(data.history)) {
    document.body.innerHTML = "<p style='padding:2rem'>Forecast data could not be loaded.</p>";
    return;
  }

  const money = value => `Rs. ${Number(value).toFixed(2)}`;
  const round2 = value => Math.round((value + Number.EPSILON) * 100) / 100;
  const dateLabel = value => new Intl.DateTimeFormat("en-GB", {
    day: "numeric", month: "short", year: "numeric", timeZone: "UTC"
  }).format(new Date(`${value}T12:00:00Z`));
  const dateLabelLong = value => {
    const date = new Date(`${value}T12:00:00Z`);
    const day = date.getUTCDate();
    const suffix = day % 10 === 1 && day !== 11 ? "st"
      : day % 10 === 2 && day !== 12 ? "nd"
      : day % 10 === 3 && day !== 13 ? "rd" : "th";
    const monthYear = new Intl.DateTimeFormat("en-GB", {
      month: "long", year: "numeric", timeZone: "UTC"
    }).format(date);
    return `${day}${suffix} ${monthYear}`;
  };

  const { slope, intercept, barrelLitres, version } = data.model;
  const forecast = data.currentForecast;
  const predictedPrice = round2(
    slope * ((forecast.brentClose * forecast.usdPkr) / barrelLitres) + intercept
  );
  const change = round2(predictedPrice - forecast.previousOfficialPrice);
  const changePercent = round2((change / forecast.previousOfficialPrice) * 100);

  document.querySelector("#forecast-date").textContent =
    `Predicted petrol price for ${dateLabelLong(forecast.forecastDate)}`;
  document.querySelector("#predicted-price").textContent = money(predictedPrice);
  document.querySelector("#current-price").textContent = money(forecast.previousOfficialPrice);
  document.querySelector("#change-amount").textContent = money(Math.abs(change));
  document.querySelector("#change-percent").textContent = `${change >= 0 ? "+" : ""}${changePercent.toFixed(2)}%`;
  document.querySelector("#forecast-created").textContent =
    `Forecast recorded ${new Intl.DateTimeFormat("en-GB", {
      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
      timeZone: "UTC", timeZoneName: "short"
    }).format(new Date(forecast.createdAt))}`;
  document.querySelector("#model-version").textContent = `Model ${version}`;

  const alert = document.querySelector("#change-alert");
  if (change > 0) {
    document.querySelector("#change-arrow").textContent = "↑";
    document.querySelector("#change-label").textContent = "Expected increase";
  } else if (change < 0) {
    alert.classList.add("decrease");
    document.querySelector("#change-arrow").textContent = "↓";
    document.querySelector("#change-label").textContent = "Expected decrease";
  } else {
    alert.classList.add("neutral");
    document.querySelector("#change-arrow").textContent = "→";
    document.querySelector("#change-label").textContent = "No change expected";
  }

  const chronological = [...data.history].sort((a, b) => a.date.localeCompare(b.date));
  const evaluated = chronological.map((row, index) => {
    const signedError = round2(row.predictedPrice - row.officialPrice);
    const absoluteError = Math.abs(signedError);
    let directionCorrect = null;
    if (index > 0) {
      const previousOfficial = chronological[index - 1].officialPrice;
      directionCorrect =
        Math.sign(row.predictedPrice - previousOfficial) === Math.sign(row.officialPrice - previousOfficial);
    }
    return { ...row, signedError, absoluteError, directionCorrect };
  });

  document.querySelector("#history-body").innerHTML = [...evaluated].reverse().map(row => {
    const side = row.signedError > 0 ? "high" : row.signedError < 0 ? "low" : "exact";
    const signed = `${row.signedError > 0 ? "+" : row.signedError < 0 ? "−" : ""}${money(Math.abs(row.signedError))} ${side}`;
    const direction = row.directionCorrect === null ? "—" : row.directionCorrect ? "Correct" : "Missed";
    const directionClass = row.directionCorrect === null ? "direction-na" : row.directionCorrect ? "direction-yes" : "error-high";
    return `<tr>
      <td>${dateLabel(row.date)}</td>
      <td>${money(row.predictedPrice)}</td>
      <td>${money(row.officialPrice)}</td>
      <td class="${row.signedError >= 0 ? "error-high" : "error-low"}">${signed}</td>
      <td>${money(row.absoluteError)}</td>
      <td class="${directionClass}">${direction}</td>
    </tr>`;
  }).join("");

  const mae = evaluated.reduce((sum, row) => sum + row.absoluteError, 0) / evaluated.length;
  const withinOne = evaluated.filter(row => row.absoluteError <= 1).length;
  const directionRows = evaluated.filter(row => row.directionCorrect !== null);
  const directionsCorrect = directionRows.filter(row => row.directionCorrect).length;
  document.querySelector("#metric-mae").textContent = money(mae);
  document.querySelector("#metric-within-one").textContent = `${withinOne} of ${evaluated.length}`;
  document.querySelector("#metric-direction").textContent =
    directionRows.length ? `${directionsCorrect} of ${directionRows.length}` : "Not enough data";

  if (window.Chart) {
    new Chart(document.querySelector("#price-chart"), {
      type: "line",
      data: {
        labels: evaluated.map(row => dateLabel(row.date)),
        datasets: [
          {
            label: "Official price",
            data: evaluated.map(row => row.officialPrice),
            borderColor: "#264653",
            backgroundColor: "#264653",
            borderWidth: 3,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: .28
          },
          {
            label: "Predicted price",
            data: evaluated.map(row => row.predictedPrice),
            borderColor: "#e76f51",
            backgroundColor: "#e76f51",
            borderWidth: 3,
            borderDash: [8, 7],
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: .28
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(context) {
                return `${context.dataset.label}: ${money(context.parsed.y)}`;
              },
              afterBody(items) {
                if (!items.length) return "";
                const row = evaluated[items[0].dataIndex];
                return `Difference: ${money(Math.abs(row.signedError))} ${row.signedError >= 0 ? "high" : "low"}`;
              }
            }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: "#60716e" } },
          y: {
            grace: "12%",
            grid: { color: "rgba(12,33,30,.08)" },
            ticks: { color: "#60716e", callback: value => `Rs. ${value}` }
          }
        }
      }
    });
  }
})();
