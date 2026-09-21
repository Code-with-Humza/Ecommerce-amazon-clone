(function updateCartCounts() {
  let cart = [];

  try {
    const storedCart = JSON.parse(localStorage.getItem("cart"));
    if (Array.isArray(storedCart)) {
      cart = storedCart;
    }
  } catch (error) {
    cart = [];
  }

  const quantity = cart.reduce((total, item) => {
    return total + (Number.isInteger(item.quantity) && item.quantity > 0 ? item.quantity : 0);
  }, 0);

  document.querySelectorAll(".js-cart-quantity, .cart-quantity").forEach((element) => {
    element.textContent = quantity;
  });
})();