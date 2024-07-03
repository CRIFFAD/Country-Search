(function () {
  "use strict";

  // DOM Elements
  const darktheme = document.getElementById("dark-toggle");
  const navbarImg = document.querySelector("header nav img");
  const filterImg = document.querySelector("#filter-chevron");
  const filterchevron = document.querySelector(".filter-search img");
  const filterDropdown = document.querySelector("#filter");
  const filterTarget = document.querySelector("#filter-target");
  const filterDropOtions = document.querySelectorAll(".filter-options ul li");
  const searchDiv = document.querySelector(".search");
  const searchInput = document.getElementById("search-countries");
  const container = document.querySelector(".countries");
  const detailsContainer = document.querySelector(".country-details");

  // Functions
  function createSkeletonLoader() {
    const skeletonLoader = document.createElement("div");
    skeletonLoader.classList.add("country-card", "skeleton");
    skeletonLoader.innerHTML = `
    <div class="skeleton-flag"></div>
    <div class="country-info">
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
    </div>
  `;
    return skeletonLoader;
  }

  // Update displayCountries function
  function displayCountries(country) {
    const countryCard = document.createElement("div");
    countryCard.classList.add("country-card");
    countryCard.innerHTML = `
  <img src="${country.flags.png}" alt="flag" />
  <div class="country-info">
    <h2>${country.name.common}</h2>
    <p><span>Population:</span> ${country.population}</p>
    <p><span>Region:</span> ${country.region}</p>
    <p><span>Capital:</span> ${country.capital}</p>
  </div>
`;
    countryCard.addEventListener("click", () => {
      container.style.display = "none";
      searchDiv.style.display = "none";
      displayDetails(country);
    });
    container.appendChild(countryCard);
  }

  function displayDetails(country) {
    let currencies = country.currencies
      ? Object.values(country.currencies)
          .map((currency) => currency.name)
          .join(", ")
      : "";
    let languages = country.languages
      ? Object.values(country.languages).join(", ")
      : "";
    let borderCountries = country.borders
      ? country.borders
          .map((border) => {
            const borderCountry = data.find((c) => c.cca3 === border);
            return borderCountry
              ? `<button class="border-country" data-country-code="${borderCountry.cca3}">
            <img src="${borderCountry.flags.png}" alt="flag" />
            ${borderCountry.cca3}
           </button>`
              : "";
          })
          .join("")
      : `<p class ="no-border"> ${country.name.common} has no borders </p>`;

    let nativeName = country.name.nativeName
      ? Object.values(country.name.nativeName)
          .map((name) => name.common)
          .join(", ")
      : "";
    let capital = country.capital || "";
    let region = country.region || "";
    let population = country.population || "";

    detailsContainer.innerHTML = `
    <div class="btn-container">
        <button id="back-button"><img src="./images/arrow-back-outline.svg" alt="arrow">Back</button>
    </div>
    <div class="country-details-container">
        <div class="country-flag">
            <img src="${country.flags.png}" alt="${country.flags.alt}">
        </div>
        <div class="flex-items">
            <div class="flex-items2">
                <div class="details">
                    <h2>${country.name.common}</h2>
                    <p><span>Native Name: </span> ${nativeName}</p>
                    <p> <span>Population: </span> ${population} </p>
                    <p><span>Region: </span> ${region}</p>
                    <p><span> Sub Region: </span> ${country.subregion}</p>
                    <p><span>Capital: </span> ${capital}</p>
                </div>
                <div class="domains">
                    <p><span>Top Level Domain: </span> ${country.tld}</p>
                    <p><span>Currencies: </span> ${currencies}</p>
                    <p><span>Languages: </span> ${languages}</p>
                </div>
            </div>
            <div class="border">
                <h3>Border Countries:</h3>
                <div class="botton-container">
                    ${borderCountries}
                </div>
            </div>
        </div>
    </div>
  `;
    detailsContainer.querySelectorAll(".border-country").forEach((button) => {
      button.addEventListener("click", () => {
        const countryCode = button.getAttribute("data-country-code");
        const borderCountry = data.find((c) => c.cca3 === countryCode);
        if (borderCountry) {
          displayDetails(borderCountry);
        }
      });
    });

    detailsContainer.style.display =
      detailsContainer.getAttribute("data-display");

    const backButton = document.querySelector("#back-button");
    backButton.addEventListener("click", () => {
      detailsContainer.style.display = "none";
      container.style.display = container.getAttribute("data-display");
      searchDiv.style.display = searchDiv.getAttribute("data-display");
    });
  }

  // Event Listeners

  filterImg.addEventListener("click", (evt) => {
    evt.stopPropagation();
    filterDropdown.classList.toggle("show");
    filterchevron.classList.toggle("rotate");
  });

  document.addEventListener("click", function (event) {
    var isClickInside = filterDropdown.contains(event.target);

    if (!isClickInside && filterDropdown.classList.contains("show")) {
      // The click was outside the filterDropdown, hide it
      filterDropdown.classList.remove("show");
      filterchevron.classList.remove("rotate");
    }
  });

  darktheme.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
      navbarImg.src = "./images/moon.svg";
      localStorage.setItem("darkMode", "true");
    } else {
      navbarImg.src = "./images/moon-outline.svg";
      localStorage.setItem("darkMode", "false");
    }
  });

  // Initial setup
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
    navbarImg.src = "./images/moon.svg";
  } else {
    navbarImg.src = "./images/moon-outline.svg";
  }

  for (let i = 0; i < 12; i++) {
    container.appendChild(createSkeletonLoader());
  }

  let data;

  // Fetch data
  setTimeout(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .catch((error) => {
        console.log(
          "API fetch failed, falling back to local JSON file:",
          error
        );
        return fetch("./data.json").then((response) => response.json());
      })
      .then((fetchedData) => {
        data = fetchedData;
        document
          .querySelectorAll(".skeleton")
          .forEach((loader) => loader.remove());
        data.forEach(displayCountries);

        // Filter
        filterDropOtions.forEach((option) => {
          option.addEventListener("click", () => {
            filterTarget.innerHTML = option.innerHTML;
            container.innerHTML = "";
            let filteredData;
            if (option.innerHTML.toLowerCase() === "all") {
              filteredData = data;
            } else {
              filteredData = data.filter(
                (country) =>
                  country.region.toLowerCase() ===
                  option.innerHTML.toLowerCase()
              );
            }
            filteredData.forEach(displayCountries);
          });
        });

        // Search
        searchInput.addEventListener("input", (evt) => {
          const searchValue = evt.target.value.toLowerCase();
          container.innerHTML = "";
          const filteredData = data.filter((country) =>
            country.name.common.toLowerCase().includes(searchValue)
          );
          filteredData.forEach(displayCountries);
        });
      })
      .catch((error) => console.error("Fetch Error:", error));
  }, 1000);
})();
