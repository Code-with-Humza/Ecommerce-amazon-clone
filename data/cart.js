import { deliveryOptions } from "./deliveryOptions.js";

const DEFAULT_CART = [
  {
    productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity: 2,
    deliveryOptionId: "1",
  },
  {
    productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity: 1,
    deliveryOptionId: "2",
  },
];

export let cart = DEFAULT_CART.slice();

export function loadFromStorage() {
  const stored = JSON.parse(localStorage.getItem("cart"));
  cart = stored || DEFAULT_CART.slice();
}

function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(productId, SelectedQuantity) {
  let matchingItem;
  cart.forEach((item) => {
    if (productId === item.productId) {
      matchingItem = item;
    }
  });
  if (matchingItem) {
    matchingItem.quantity = matchingItem.quantity + SelectedQuantity;
  } else {
    cart.push({
      productId, // productId: productId,
      quantity: SelectedQuantity,
      deliveryOptionId: "1",
    });
  }
  saveToStorage();
}

// 1- create a new array
// 2- Loop through the cart
// 3- Add each product to the new array , except for this productId

export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });
  cart = newCart;

  saveToStorage();
}

export function updateQuantity(productId, newQuantity) {
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      cartItem.quantity = newQuantity;
    }
  });

  saveToStorage();
}

// localStorage.clear();

// 1- Loop through the cart and find the product
// 2- Update the deliveryOptionId of the product

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;
  cart.forEach((item) => {
    if (productId === item.productId) {
      matchingItem = item;
    }
  });

  if (!matchingItem) {
    return;
  }

  // validate deliveryOptionId exists before updating
  const found = deliveryOptions.find((opt) => opt.id === deliveryOptionId);
  if (!found) {
    return;
  }

  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}

export function loadCart(fun) {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", () => {
    console.log(xhr.response);
    fun();
  });

  xhr.addEventListener("error", () => {
    console.log("load products failed; using default catalog");
    fun();
  });

  xhr.open("GET", "https://supersimplebackend.dev/cart");
  xhr.send();
}