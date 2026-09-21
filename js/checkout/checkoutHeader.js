import { cart } from '../../data/cart.js';



export function getCheckoutHeaderHTML() {

  let cartQuantity = 0;



  cart.forEach((item) => {

    cartQuantity += item.quantity;

  });



  const cartQuantityText = cartQuantity > 0 ? `${cartQuantity} items` : '';



  return `

    <div class="header-content">

      <div class="checkout-header-left-section">

        <a href="index.html">

          <img class="amazon-logo" src="images/amazon-logo.png">

          <img class="amazon-mobile-logo" src="images/amazon-mobile-logo.png">

        </a>

      </div>



      <div class="checkout-header-middle-section">

        Checkout (<a class="return-to-home-link checkout-count-js-2"

          href="index.html">${cartQuantityText}</a>)

      </div>



      <div class="checkout-header-right-section">

        <img src="images/icons/checkout-lock-icon.png">

      </div>

    </div>

  `;

}



export function renderCheckoutHeader() {

  const checkoutHeaderElement = document.querySelector('.js-checkout-header');



  if (checkoutHeaderElement) {

    checkoutHeaderElement.innerHTML = getCheckoutHeaderHTML();

  }

}

