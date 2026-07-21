(function () {
  "use strict";

  var STORAGE_KEY = "msf-theme";
  var root = document.documentElement;

  function getStoredTheme() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark" || stored === "system") return stored;
    } catch (e) {}
    return "system";
  }

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {}
    document.querySelectorAll("[data-theme-option]").forEach(function (el) {
      el.classList.toggle("is-active", el.getAttribute("data-theme-option") === theme);
    });
  }

  // Applied again on DOMContentLoaded (a blocking inline script in <head>
  // already set data-theme before first paint to avoid a flash).
  document.addEventListener("DOMContentLoaded", function () {
    setTheme(getStoredTheme());

    document.querySelectorAll("[data-theme-option]").forEach(function (el) {
      el.addEventListener("click", function () {
        setTheme(el.getAttribute("data-theme-option"));
      });
    });
  });
})();
