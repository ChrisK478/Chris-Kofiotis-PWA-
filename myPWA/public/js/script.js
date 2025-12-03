function fixPath(path) {
  if (!path) return "";
  const i = path.indexOf("images/");
  if (i !== -1) return path.slice(i);

  const j = path.indexOf("icons/");
  if (j !== -1) return path.slice(j);

  return path;
}

// LIVE SEARCH
async function searchProducts() {
  const query = document.getElementById("searchBar").value;

  const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
  const products = await res.json();

  displayProducts(products);
}

// DISPLAY CARDS
function displayProducts(products) {
  const container = document.getElementById("productContainer");
  container.innerHTML = "";

  // If no results → show fallback message
  if (products.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <p>No products found. Try another search.</p>
      </div>
    `;
    return;
  }

  // Otherwise, show product cards
  products.forEach((p) => {
    const link = p.hyperlink?.startsWith("http") ? p.hyperlink : "";

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${fixPath(p.image)}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>Brand: ${p.brand || ""}</p>
      <p>Price: $${p.price || "TBD"}</p>
      ${p.legacy ? `<p>Legacy: ${p.legacy}</p>` : ""}
      ${link ? `<a href="${link}" target="_blank">View Product</a>` : ""}
    `;

    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          obs.unobserve(entry.target); // run once
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
  );

  document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));

  // Populate products immediately on page load
  searchProducts();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("serviceWorker.js")
      .then(() => console.log("✔ Service Worker Registered"))
      .catch((err) => console.error("SW Registration Failed:", err));
  });
}
const basketballBtn = document.getElementById("basketballBtn");
if (basketballBtn) {
  basketballBtn.addEventListener("click", () => {
    window.location.href = "basketball.html";
  });
}

const searchBar = document.getElementById("searchBar");
if (searchBar) {
  searchBar.addEventListener("input", searchProducts);
}
