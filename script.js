"use strict";

const amountInput = document.querySelector("#amount");
const fromCurrencySelector = document.querySelector("#from-currency");
const toCurrencySelector = document.querySelector("#to-currency");
const convertButton = document.querySelector("button");
const finalAmount = document.querySelector(".converted-amount");

const renderResult = function ({ amount, from, result, to }) {
  finalAmount.textContent = `${amount} ${from} = ${result} ${to}`;
  finalAmount.style.opacity = 1;
};

const convert = async function (amount, from, to) {
  try {
    const res = await fetch(
      `https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`
    );

    if (!res.ok) throw new Error("Problem fetching currency");

    const data = await res.json();

    const rate = data.rates[to];
    if (!rate) throw new Error(`No rate found for ${to}`);

    const convertedAmount = amount * rate;
    renderResult({ amount, from, result: convertedAmount, to });
  } catch (err) {
    console.error(`${err}`);
  }
};

convertButton.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = parseFloat(amountInput.value);
  const from = fromCurrencySelector.value;
  const to = toCurrencySelector.value;

  if (isNaN(amount) || amount <= 0) {
    alert("Enter a valid amount");
    return;
  }

  convert(amount, from, to);
});

const updateSelectors = function () {
  const fromValue = fromCurrencySelector.value;
  const toValue = toCurrencySelector.value;
  Array.from(fromCurrencySelector.options).forEach((option) => {
    option.style.display = "";
    if (option.value === toValue) {
      option.style.display = "none";
    }
  });
  Array.from(toCurrencySelector.options).forEach((option) => {
    option.style.display = "";
    if (option.value === fromValue) {
      option.style.display = "none";
    }
  });
};

fromCurrencySelector.addEventListener("change", updateSelectors);
toCurrencySelector.addEventListener("change", updateSelectors);

updateSelectors();
