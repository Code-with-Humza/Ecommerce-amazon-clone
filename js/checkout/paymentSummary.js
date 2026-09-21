import { cart, removeFromCart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { formatCurrency } from '../utils/money.js'
export function renderPaymentSummary(){
    let productPriceCents = 0;
    let shippingPriceCents = 0;
    let cartQuantity = 0;

    cart.forEach((cartItem)=>{
        cartQuantity += cartItem.quantity;
        const product = getProduct(cartItem.productId);
        if (!product) {
            return;
        }
        productPriceCents += product.priceCents * cartItem.quantity;
        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        shippingPriceCents += deliveryOption.priceCents;
    });
   const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
   const taxCents = totalBeforeTaxCents * 0.1;
   const totalCents = totalBeforeTaxCents + taxCents;

    const paymentSummaryHTML = `
                <div class="payment-summary-title">
                    Order Summary
                </div>

                <div class="payment-summary-row">
                    <div>Items (${cartQuantity}):</div>
                    <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
                </div>

                <div class="payment-summary-row">
                    <div>Shipping &amp; handling:</div>
                    <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
                </div>

                <div class="payment-summary-row subtotal-row">
                    <div>Total before tax:</div>
                    <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
                </div>

                <div class="payment-summary-row">
                    <div>Estimated tax (10%):</div>
                    <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
                </div>

                <div class="payment-summary-row total-row">
                    <div>Order total:</div>
                    <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
                </div>

                <button class="place-order-button button-primary" type="button">
                    Place your order
                </button>
    `;
    const paymentSummaryElement = document.querySelector('.js-payment-summary');
    if (!paymentSummaryElement) {
        return;
    }

    paymentSummaryElement.innerHTML = paymentSummaryHTML;
    paymentSummaryElement.querySelector('.place-order-button').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty.');
            return;
        }

        cart.slice().forEach((cartItem) => removeFromCart(cartItem.productId));
        window.location.href = 'orders.html';
    });
}