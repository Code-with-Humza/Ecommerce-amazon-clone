let products = [
  {
    id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    image: "images/products/athletic-cotton-socks-6-pairs.jpg",
    name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
    stars: 4.5,
    ratingCount: 87,
    priceCents: 1090,
  },
  {
    id: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    image: "images/products/intermediate-composite-basketball.jpg",
    name: "Intermediate Size Basketball",
    stars: 4,
    ratingCount: 127,
    priceCents: 2095,
  },
  {
    id: "83d4ca15-0f35-48f5-b7a3-1ea210004f2e",
    image: "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg",
    name: "Adults Plain Cotton T-Shirt - 2 Pack",
    stars: 4.5,
    ratingCount: 56,
    priceCents: 799,
    sizeChartLink: "images/clothing-size-chart.png",
  },
];

const deliveryOptions = [
  { id: "1", deliveryDays: 7, priceCents: 0 },
  { id: "2", deliveryDays: 3, priceCents: 499 },
  { id: "3", deliveryDays: 1, priceCents: 999 },
];

const defaultCart = [
  { productId: products[0].id, quantity: 2, deliveryOptionId: "1" },
  { productId: products[1].id, quantity: 1, deliveryOptionId: "2" },
];

function loadCartFromStorage() {
  try {
    const storedCart = JSON.parse(localStorage.getItem("cart"));
    if (!Array.isArray(storedCart)) {
      return defaultCart.map((item) => ({ ...item }));
    }

    return storedCart.filter((item) =>
      item &&
      typeof item.productId === "string" &&
      Number.isInteger(item.quantity) &&
      item.quantity >= 0,
    );
  } catch (error) {
    return defaultCart.map((item) => ({ ...item }));
  }
}

let cart = loadCartFromStorage();
let editingProductId = null;

function saveCart() {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.warn("Cart could not be saved.", error);
  }
}

function formatCurrency(priceCents) {
  return (Math.round(priceCents) / 100).toFixed(2);
}

function getProduct(productId) {
  return products.find((product) => product.id === productId);
}

function getDeliveryOption(deliveryOptionId) {
  return deliveryOptions.find((option) => option.id === deliveryOptionId) || deliveryOptions[0];
}

function calculateDeliveryDate(deliveryOption) {
  const today = new Date();
  today.setDate(today.getDate() + deliveryOption.deliveryDays);
  return today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

function updateCartQuantity() {
  const quantity = cart.reduce((total, item) => total + item.quantity, 0);
  const element = document.querySelector(".js-cart-quantity");
  if (element) element.textContent = quantity || "";
}

function addToCart(productId, quantity) {
  const matchingItem = cart.find((item) => item.productId === productId);
  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({ productId, quantity, deliveryOptionId: "1" });
  }
  saveCart();
  updateCartQuantity();
}

function renderProducts() {
  const grid = document.querySelector(".js-products-grid");
  if (!grid) return;

  grid.innerHTML = products.map((product) => `
    <div class="product-container">
      <div class="product-image-container"><img class="product-image" src="${product.image}"></div>
      <div class="product-name limit-text-to-2-lines">${product.name}</div>
      <div class="product-rating-container">
        <img class="product-rating-stars" src="images/ratings/rating-${product.stars * 10}.png">
        <div class="product-rating-count link-primary">${product.ratingCount}</div>
      </div>
      <div class="product-price">$${formatCurrency(product.priceCents)}</div>
      <div class="product-quantity-container">
        <select class="js-quantity-selector-${product.id}">
          ${Array.from({ length: 10 }, (_, index) => `<option value="${index + 1}"${index === 0 ? " selected" : ""}>${index + 1}</option>`).join("")}
        </select>
      </div>
      ${product.sizeChartLink ? `<a href="${product.sizeChartLink}" target="_blank">Size Chart</a>` : ""}
      <div class="product-spacer"></div>
      <div class="added-to-cart js-added-to-cart-${product.id}"><img src="images/icons/checkmark.png"> Added</div>
      <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">Add to Cart</button>
    </div>
  `).join("");

  grid.querySelectorAll(".js-add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      const quantity = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);
      addToCart(productId, quantity);
      const message = document.querySelector(`.js-added-to-cart-${productId}`);
      message.classList.add("change-css");
      setTimeout(() => message.classList.remove("change-css"), 2000);
    });
  });
  updateCartQuantity();
}

function renderCheckoutHeader() {
  const element = document.querySelector(".js-checkout-header");
  if (!element) return;
  const quantity = cart.reduce((total, item) => total + item.quantity, 0);
  element.innerHTML = `
    <div class="header-content">
      <div class="checkout-header-left-section"><a href="index.html"><img class="amazon-logo" src="images/amazon-logo.png"><img class="amazon-mobile-logo" src="images/amazon-mobile-logo.png"></a></div>
      <div class="checkout-header-middle-section">Checkout (<a class="return-to-home-link checkout-count-js-2" href="index.html">${quantity} items</a>)</div>
      <div class="checkout-header-right-section"><img src="images/icons/checkout-lock-icon.png"></div>
    </div>`;
}

function renderPaymentSummary() {
  const element = document.querySelector(".js-payment-summary");
  if (!element) return;
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  let quantity = 0;
  cart.forEach((item) => {
    const product = getProduct(item.productId);
    if (!product) return;
    productPriceCents += product.priceCents * item.quantity;
    shippingPriceCents += getDeliveryOption(item.deliveryOptionId).priceCents;
    quantity += item.quantity;
  });
  const beforeTax = productPriceCents + shippingPriceCents;
  const tax = beforeTax * 0.1;
  element.innerHTML = `<div class="payment-summary-title">Order Summary</div>
    <div class="payment-summary-row"><div>Items (${quantity}):</div><div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div></div>
    <div class="payment-summary-row"><div>Shipping &amp; handling:</div><div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div></div>
    <div class="payment-summary-row subtotal-row"><div>Total before tax:</div><div class="payment-summary-money">$${formatCurrency(beforeTax)}</div></div>
    <div class="payment-summary-row"><div>Estimated tax (10%):</div><div class="payment-summary-money">$${formatCurrency(tax)}</div></div>
    <div class="payment-summary-row total-row"><div>Order total:</div><div class="payment-summary-money">$${formatCurrency(beforeTax + tax)}</div></div>
    <button class="place-order-button button-primary" type="button">Place your order</button>`;
  element.querySelector(".place-order-button").addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    cart = [];
    saveCart();
    window.location.href = "orders.html";
  });
}

function renderCheckout() {
  const element = document.querySelector(".js-order-summary");
  if (!element) return;
  element.innerHTML = cart.map((item) => {
    const product = getProduct(item.productId);
    if (!product) return "";
    const option = getDeliveryOption(item.deliveryOptionId);
    const editing = editingProductId === product.id;
    return `<div class="cart-item-container js-cart-item-container-${product.id}${editing ? " is-editing-quantity" : ""}">
      <div class="delivery-date">Delivery date: ${calculateDeliveryDate(option)}</div>
      <div class="cart-item-details-grid"><img class="product-image" src="${product.image}">
      <div class="cart-item-details"><div class="product-name">${product.name}</div><div class="product-price">$${formatCurrency(product.priceCents)}</div>
      <div class="product-quantity">Quantity: <span>${item.quantity}</span> <span class="update-quantity-link link-primary" data-action="update" data-product-id="${product.id}">Update</span>${editing ? `<input class="quantity-input" value="${item.quantity}"><span class="save-quantity-link link-primary" data-action="save" data-product-id="${product.id}">Save</span>` : ""} <span class="delete-quantity-link link-primary" data-action="delete" data-product-id="${product.id}">Delete</span></div></div>
      <div class="delivery-options"><div class="delivery-options-title">Choose a delivery option:</div>${deliveryOptions.map((deliveryOption) => `<div class="delivery-option"><input type="radio" name="delivery-${product.id}" data-action="delivery" data-product-id="${product.id}" data-delivery-option-id="${deliveryOption.id}"${deliveryOption.id === option.id ? " checked" : ""}><div><div class="delivery-option-date">${calculateDeliveryDate(deliveryOption)}</div><div class="delivery-option-price">${deliveryOption.priceCents ? `$${formatCurrency(deliveryOption.priceCents)} - Shipping` : "FREE Shipping"}</div></div></div>`).join("")}</div></div></div>`;
  }).join("");

  element.querySelectorAll("[data-action]").forEach((control) => {
    control.addEventListener("click", () => {
      if (control.dataset.action === "delivery") {
        return;
      }

      const productId = control.dataset.productId;
      if (control.dataset.action === "delete") cart = cart.filter((item) => item.productId !== productId);
      if (control.dataset.action === "update") editingProductId = productId;
      if (control.dataset.action === "save") {
        const input = element.querySelector(`.js-cart-item-container-${productId} .quantity-input`);
        if (!input) {
          return;
        }
        const value = Number(input.value);
        if (Number.isInteger(value) && value >= 0) {
          const item = cart.find((cartItem) => cartItem.productId === productId);
          if (item) item.quantity = value;
          editingProductId = null;
        }
      }
      saveCart(); renderCheckout(); renderCheckoutHeader(); renderPaymentSummary();
    });
    control.addEventListener("change", () => {
      if (control.dataset.action !== "delivery") return;
      const item = cart.find((cartItem) => cartItem.productId === control.dataset.productId);
      if (item) item.deliveryOptionId = control.dataset.deliveryOptionId;
      saveCart(); renderCheckout(); renderPaymentSummary(); renderCheckoutHeader();
    });
  });

  element.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        input.closest(".cart-item-container").querySelector('[data-action="save"]').click();
      }
    });
  });
}

function renderCurrentPage() {
  if (document.querySelector(".js-products-grid")) renderProducts();
  if (document.querySelector(".js-order-summary")) {
    renderCheckoutHeader();
    renderCheckout();
    renderPaymentSummary();
  }
}

async function loadCatalog() {
  renderCurrentPage();

  try {
    const response = await fetch("https://supersimplebackend.dev/products");
    if (!response.ok) {
      return;
    }

    const loadedProducts = await response.json();
    if (!Array.isArray(loadedProducts) || loadedProducts.length === 0) {
      return;
    }

    products = loadedProducts.map((product) => ({
      id: product.id,
      image: product.image,
      name: product.name || "Product",
      stars: product.rating?.stars || 0,
      ratingCount: product.rating?.count || 0,
      priceCents: product.priceCents,
      sizeChartLink: product.sizeChartLink,
    }));

    renderCurrentPage();
  } catch (error) {
    // Keep the local catalog when the backend is unavailable.
  }
}

loadCatalog();
