function displayLastVisit() {
    const lastVisit = document.cookie.replace(
      /(?:(?:^|.*;\s*)lastVisit\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    if (lastVisit) {
      document.getElementById('elementId').textContent = `Last Visit: ${lastVisit}`;
    }
  }
  window.onload = displayLastVisit;