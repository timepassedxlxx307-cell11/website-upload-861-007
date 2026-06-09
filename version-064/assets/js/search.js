(function () {
  var input = document.getElementById("searchInput");
  var typeFilter = document.getElementById("typeFilter");
  var yearFilter = document.getElementById("yearFilter");
  var categoryFilter = document.getElementById("categoryFilter");
  var resetButton = document.getElementById("resetFilters");
  var resultCount = document.getElementById("resultCount");
  var cards = Array.prototype.slice.call(document.querySelectorAll("#searchGrid .movie-card"));
  var params = new URLSearchParams(window.location.search);
  var initialKeyword = params.get("q") || "";

  if (input && initialKeyword) {
    input.value = initialKeyword;
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function applyFilters() {
    var keyword = normalize(input ? input.value : "");
    var typeValue = typeFilter ? typeFilter.value : "";
    var yearValue = yearFilter ? yearFilter.value : "";
    var categoryValue = categoryFilter ? categoryFilter.value : "";
    var visible = 0;

    cards.forEach(function (card) {
      var text = normalize(card.getAttribute("data-search-text"));
      var type = card.getAttribute("data-type") || "";
      var year = card.getAttribute("data-year") || "";
      var category = card.getAttribute("data-category") || "";
      var matched = true;

      if (keyword && text.indexOf(keyword) === -1) {
        matched = false;
      }

      if (typeValue && type !== typeValue) {
        matched = false;
      }

      if (yearValue && year !== yearValue) {
        matched = false;
      }

      if (categoryValue && category !== categoryValue) {
        matched = false;
      }

      card.classList.toggle("is-hidden-by-filter", !matched);

      if (matched) {
        visible += 1;
      }
    });

    if (resultCount) {
      resultCount.textContent = String(visible);
    }
  }

  [input, typeFilter, yearFilter, categoryFilter].forEach(function (control) {
    if (control) {
      control.addEventListener("input", applyFilters);
      control.addEventListener("change", applyFilters);
    }
  });

  if (resetButton) {
    resetButton.addEventListener("click", function () {
      if (input) {
        input.value = "";
      }

      if (typeFilter) {
        typeFilter.value = "";
      }

      if (yearFilter) {
        yearFilter.value = "";
      }

      if (categoryFilter) {
        categoryFilter.value = "";
      }

      applyFilters();
    });
  }

  applyFilters();
})();
