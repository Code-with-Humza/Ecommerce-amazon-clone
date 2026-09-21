import { renderCheckout } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { renderCheckoutHeader } from "./checkout/checkoutHeader.js";
import { loadProducts } from "../data/products.js";
import "../data/cart-class.js";
import "../data/backend-practice.js";
import { loadFromStorage } from "../data/cart.js";

loadFromStorage();

Promise.all([
  new Promise((resolve) => {
    console.log("promise");
    loadProducts(() => {
      resolve("value1");
    });
  }),
]).then((values)=>{
    console.log(values);
    renderCheckoutHeader();
    renderCheckout();
    renderPaymentSummary();
});

// new Promise((resolve) => {
//   console.log("promise");
//   loadProducts(() => {
//     resolve("value1");
//   });
// })
//   .then((value) => {
//     console.log("next step");
//     console.log(value);
//     return new Promise((resolve) => {
//       loadCart(() => {
//         resolve();
//       });
//     });
//   })
//   .then(() => {
//     renderCheckoutHeader();
//     renderCheckout();
//     renderPaymentSummary();
//   });

// Anonymous function = A function without a name

// loadProducts(() => {
//   loadCart(() => {
//     renderCheckoutHeader();
//     renderCheckout();
//     renderPaymentSummary();
//   });
// });
