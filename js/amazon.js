// Save the data
// Generate the HTML
// Combine this HTML together
// Put it on the web page (using DOM)
// Make it interactive

// Create a Module
// 1- Create a file
// 2- Don't load the file with <script>
// Any variable we create inside the file, will be contained inside the file

// How to get a variable out of a file/module
// 3 steps
// 1- Add type="module" attribute
// 2- Export
// 3- Import

// type="module" attribute
// let's this file get variables out of other files

// export
// write export keyword before variable which is being accessed

// import
// import variable in file where it is needed to be imported using below syntax

import { cart /*as myCart*/, addToCart } from "../data/cart.js";
// const cart = [];

import { products, loadProducts } from "../data/products.js";

import { formatCurrency } from "./utils/money.js";

loadProducts(renderProductsGrid);

// How to use modules
// In order to modules to work
// Put all imports at the top of the file
// We need to use live server
// Modules don't work if we open html file directly on the browser
// Also use aliases to remove conficts between same named variables

// Benefits of Modules
// 1- Help us avoid naming conflicts between variables
// 2- Don't have to worry about order of files

// Modules = Better way to organize our code especially in bigger projects

// Entry Point
// JavaScript file that imports other files variables is called 'entry point'.

function renderProductsGrid() {
  let productsHTML = "";
  // Loop through array with forEach loop
  products.forEach((product) => {
    productsHTML =
      productsHTML +
      `
        <div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="${product.getStarsUrl()}">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            ${product.getPrice()}
          </div>

          <div class="product-quantity-container">
            <select class="js-quantity-selector-${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          ${product.extraInfoHTML()}

          <div class="product-spacer"></div>

          <div class="added-to-cart js-added-to-cart-${product.id}">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart"
          data-product-id = "${product.id}">
            Add to Cart
          </button>
        </div>
    `;
  });

  console.log(productsHTML);
  document.querySelector(".js-products-grid").innerHTML = productsHTML;

  // How do we know which product to add to the cart?

  // Data Attribute
  // is just another HTML attribute
  // allows us to attach any information to an element when click a button

  // Syntax rules for Data attribute
  // 1. Must start with data-
  // 2. Can have any name after the dash
  // 3. Can have any value

  // Check if product is already in the cart
  // If it is in the cart , increase the quantity
  // else add it to the cart

  function updateCartQuantity() {
    let cartQuantity = 0;
    cart.forEach((item) => {
      cartQuantity += item.quantity;
    });

    const cartQuantityElement = document.querySelector(".js-cart-quantity");
    if (cartQuantityElement) {
      cartQuantityElement.textContent = cartQuantity > 0 ? cartQuantity : "";
    }
  }
  document.querySelector(".js-products-grid").innerHTML = productsHTML;
  updateCartQuantity();

  document.querySelectorAll(".js-add-to-cart").forEach((button) => {
    let intervalId; // Move outside click listener, inside forEach
    button.addEventListener("click", () => {
      let { productId } = button.dataset; // let productId = button.dataset.productId;

      let SelectedQuantity = Number(
        document.querySelector(`.js-quantity-selector-${productId}`).value,
      );
      let thisMessage = document.querySelector(
        `.js-added-to-cart-${productId}`,
      );
      //  console.log(thisMessage);
      thisMessage.classList.add("change-css");
      // console.log(thisMessage);

      addToCart(productId, SelectedQuantity);

      function handleClick() {
        clearTimeout(intervalId);
        intervalId = setTimeout(function () {
          thisMessage.classList.remove("change-css");
        }, 2000);
      }
      handleClick();

      // There may be multiple products in an ecommerce website with same name
      // give each product an id
      // this id should be unique

      // Create cart quantity section on web page
      // Steps
      // 1- Calculate the quantity
      // 2- Put the quantity on the page (using DOM)

      updateCartQuantity();

      // console.log(cartQuantity);
      // console.log(cart);
    });
  });
}
