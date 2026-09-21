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
let Cart = DEFAULT_CART.slice();

// Class = Object Generator
// class = better way to generate objects in object-oriented programming
class Carting {
  cartItems = Cart;
  #localStorageKey = undefined;

  // Constructor
  // Has to be named "constructor"
  // Should not return anything

  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey;
    // businessCart.localStorageKey = 'cart-business';
  }

  #loadFromStorage() {
    const stored = JSON.parse(localStorage.getItem(this.#localStorageKey));
    this.cartItems = stored || DEFAULT_CART.slice();
  }
  saveToStorage() {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
  }
  addToCart(productId, SelectedQuantity) {
    let matchingItem;
    this.cartItems.forEach((item) => {
      if (productId === item.productId) {
        matchingItem = item;
      }
    });
    if (matchingItem) {
      matchingItem.quantity = matchingItem.quantity + SelectedQuantity;
    } else {
      this.cartItems.push({
        productId, // productId: productId,
        quantity: SelectedQuantity,
        deliveryOptionId: "1",
      });
    }
    this.saveToStorage();
  }
  removeFromCart(productId) {
    const newCart = [];

    this.cartItems.forEach((cartItem) => {
      if (cartItem.productId !== productId) {
        newCart.push(cartItem);
      }
    });
    this.cartItems = newCart;

    this.saveToStorage();
  }
  updateQuantity(productId, newQuantity) {
    this.cartItems.forEach((cartItem) => {
      if (cartItem.productId === productId) {
        cartItem.quantity = newQuantity;
      }
    });
    this.saveToStorage();
  }
  updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;
    this.cartItems.forEach((item) => {
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
    this.saveToStorage();
  }
}

// Object = Instance of a class
const cart = new Carting("cart-oop");
const businessCart = new Carting("cart-business");

// cart.#localStorageKey = 'test'; (Error)

// cart.localStorageKey = 'cart-oop';
// businessCart.localStorageKey = 'cart-business';

console.log(cart);
console.log(businessCart);
console.log(businessCart instanceof Carting);

// const businessCart = {
//   cartItems: Cart,
//   loadFromStorage: function () {
//     const stored = JSON.parse(localStorage.getItem("cart-business"));
//     this.cartItems = stored || DEFAULT_CART.slice();
//   },
//   saveToStorage() {
//     localStorage.setItem("cart-business", JSON.stringify(this.cartItems));
//   },
//   addToCart(productId, SelectedQuantity) {
//     let matchingItem;
//     this.cartItems.forEach((item) => {
//       if (productId === item.productId) {
//         matchingItem = item;
//       }
//     });
//     if (matchingItem) {
//       matchingItem.quantity = matchingItem.quantity + SelectedQuantity;
//     } else {
//       this.cartItems.push({
//         productId, // productId: productId,
//         quantity: SelectedQuantity,
//         deliveryOptionId: "1",
//       });
//     }
//     this.saveToStorage();
//   },
//   removeFromCart(productId) {
//     const newCart = [];

//     this.cartItems.forEach((cartItem) => {
//       if (cartItem.productId !== productId) {
//         newCart.push(cartItem);
//       }
//     });
//     this.cartItems = newCart;

//     this.saveToStorage();
//   },
//   updateQuantity(productId, newQuantity) {
//     this.cartItems.forEach((cartItem) => {
//       if (cartItem.productId === productId) {
//         cartItem.quantity = newQuantity;
//       }
//     });
//     this.saveToStorage();
//   },
//   updateDeliveryOption(productId, deliveryOptionId) {
//     let matchingItem;
//     this.cartItems.forEach((item) => {
//       if (productId === item.productId) {
//         matchingItem = item;
//       }
//     });

//     if (!matchingItem) {
//       return;
//     }

//     // validate deliveryOptionId exists before updating
//     const found = deliveryOptions.find((opt) => opt.id === deliveryOptionId);
//     if (!found) {
//       return;
//     }

//     matchingItem.deliveryOptionId = deliveryOptionId;
//     this.saveToStorage();
//   },
// };
// cart.addToCart('83d4ca15-0f35-48f5-b7a3-1ea210004f2e');

// export let cart = DEFAULT_CART.slice();

// export function loadFromStorage() {
//   const stored = JSON.parse(localStorage.getItem("cart"));
//   cart = stored || DEFAULT_CART.slice();
// }

// 1- create a new array
// 2- Loop through the cart
// 3- Add each product to the new array , except for this productId

// localStorage.clear();

// 1- Loop through the cart and find the product
// 2- Update the deliveryOptionId of the product

// Private Properties and Methods
// Private = It can only be accessed inside the class

// Converting an object into a class
// Converting an array of object into classes

// Inheritance = lets us reuse code between classes
// super() = calls parent class constructor in child class
// By default, child class constructor is parent class constructor

// Discriminator Property

// Built-in classes = classes that are provided by the language
// Example: new Date() = generate an object that represents the current date

// .toLocaleTimeString() = gives the current time

// 'this' lets an object access its own properties
// 'this' can be used anywhere in the code

// Summary
// 1- Object-Oriented Programming (OOP) = organize our code into objects
// 2- Use a function to generate objects
// 3- Classes
// 4- Private properties and methods
// 5- Inheritance
// 6- Method Overriding & Polymorphism