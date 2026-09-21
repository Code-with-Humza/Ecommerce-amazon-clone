import {
  cart,
  removeFromCart,
  updateQuantity,
  updateDeliveryOption,
} from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryOptions.js";
import { calculateDeliveryDate } from "../utils/deliveryOption.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import { renderCheckoutHeader } from "./checkoutHeader.js";

let editingProductId = null;

function saveQuantity(productId) {
  const cartItemContainer = document.querySelector(
    `.js-cart-item-container-${productId}`,
  );

  if (!cartItemContainer) {
    return;
  }

  const inputElement = cartItemContainer.querySelector(".quantity-input");

  if (!inputElement) {
    return;
  }

  const enteredValue = inputElement.value.trim();

  if (!/^\d+$/.test(enteredValue)) {
    alert("Please enter a valid whole number.");
    return;
  }

  const newQuantity = Number(enteredValue);

  if (newQuantity < 0 || newQuantity >= 1000) {
    alert("Quantity must be between 0 and 999.");
    return;
  }

  updateQuantity(productId, newQuantity);
  editingProductId = null;
  renderCheckout();
  renderCheckoutHeader();
  renderPaymentSummary();
}

function deliveryOptionHTML(matchingProduct, cartItem) {
  let html = "";

  deliveryOptions.forEach((deliveryOption) => {
    const dateString = calculateDeliveryDate(deliveryOption);
    const priceString =
      deliveryOption.priceCents === 0
        ? "FREE Shipping"
        : `$${formatCurrency(deliveryOption.priceCents)} - Shipping`;
    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    html += `
        <div class="delivery-option js-delivery-option js-delivery-option-${matchingProduct.id}-${deliveryOption.id}" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
          <input type="radio"
            ${isChecked ? "checked" : ""}
            class="delivery-option-input js-delivery-input-${matchingProduct.id}-${deliveryOption.id}"
            name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString}
          </div>
        </div>
      </div>
    `;
  });

  return html;
}

function getOrderSummaryHTML() {
  let cartSummaryHTML = "";

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingProduct = products.find(
      (product) => product.id === productId,
    );

    if (!matchingProduct) {
      return;
    }

    const deliveryOptionId = cartItem.deliveryOptionId;
    let deliveryOption = deliveryOptions.find(
      (option) => option.id === deliveryOptionId,
    );

    if (!deliveryOption) {
      deliveryOption = deliveryOptions[0];
    }

    const dateString = calculateDeliveryDate(deliveryOption);
    const isEditing = matchingProduct.id === editingProductId;

    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id}${isEditing ? " is-editing-quantity" : ""}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name js-product-name-${matchingProduct.id}">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              ${matchingProduct.getPrice()}
            </div>
            <div class="product-quantity js-product-quantity-${matchingProduct.id}">
              <span>
                Quantity: <span class="quantity-label quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                Update
              </span>
              <input class="quantity-input quantity-input-${matchingProduct.id}" value="${cartItem.quantity}">
              <span class="save-quantity-link link-primary" data-product-id="${matchingProduct.id}">
                Save
              </span>
              <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  return cartSummaryHTML;
}

export function renderOrderSummary() {
  const orderSummaryElement = document.querySelector(".js-order-summary");

  if (orderSummaryElement) {
    orderSummaryElement.innerHTML = getOrderSummaryHTML();
    attachOrderSummaryListeners();
  }
}

function attachOrderSummaryListeners() {
  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      renderCheckout();
      renderCheckoutHeader();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll(".js-update-link").forEach((link) => {
    link.addEventListener("click", () => {
      editingProductId = link.dataset.productId;
      renderCheckout();

      const cartItemContainer = document.querySelector(
        `.js-cart-item-container-${editingProductId}`,
      );
      if (cartItemContainer) {
        const inputElement = cartItemContainer.querySelector(".quantity-input");
        if (inputElement) {
          inputElement.focus();
          inputElement.select();
        }
      }
    });
  });

  document.querySelectorAll(".save-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      saveQuantity(link.dataset.productId);
    });
  });

  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const productId = input
          .closest(".cart-item-container")
          .querySelector(".save-quantity-link").dataset.productId;
        saveQuantity(productId);
      }
    });
  });

  document.querySelectorAll(".delivery-option-input").forEach((input) => {
    input.addEventListener("change", () => {
      const deliveryOptionElement = input.closest(".js-delivery-option");

      if (!deliveryOptionElement) {
        return;
      }

      const productId = deliveryOptionElement.dataset.productId;
      const deliveryOptionId = deliveryOptionElement.dataset.deliveryOptionId;

      updateDeliveryOption(productId, deliveryOptionId);
      renderCheckout();
      renderPaymentSummary();
      renderCheckoutHeader();
    });
  });
}

export function renderCheckout() {
  renderOrderSummary();
}

renderCheckout();
