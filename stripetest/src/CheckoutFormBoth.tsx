import React from "react";
import { useStripe, useElements, ExpressCheckoutElement, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import { StripeExpressCheckoutElementConfirmEvent } from "@stripe/stripe-js";

const CheckoutFormBoth: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmitExpressCheckout = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "https://your-site.com/success",
      },
    });

    if (error) console.error("Express Checkout Error:", error.message);
  };

  const handleSubmitManualCard = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardNumberElement);
    const { error } = await stripe.confirmCardPayment("your-client-secret", {
      payment_method: { card: cardElement! },
    });

    if (error) console.error("Manual Card Error:", error.message);
  };

  return (
    <div>
      <h1>Checkout</h1>
      <div>
        <h2>Express Checkout</h2>
        <form onSubmit={handleSubmitExpressCheckout}>
          <ExpressCheckoutElement onConfirm={function (event: StripeExpressCheckoutElementConfirmEvent) {
            console.log('====================================');
            console.log(event);
            if(stripe && elements){
              stripe.confirmPayment({
                elements,
                confirmParams: {
                  return_url: 'https://example.com',
                },
              })
              .then(function(result) {
                console.log('====================================');
                console.log(result,"results");
                console.log('====================================');
                if (result.error) {
                  // Inform the customer that there's an error.
                }
              });
            }
            console.log('====================================');
                  } } />
          <button type="submit">Pay with Express Checkout</button>
        </form>
      </div>
      <div>
        <h2>Manual Card Entry</h2>
        <form onSubmit={handleSubmitManualCard}>
          <CardNumberElement />
          <CardExpiryElement />
          <CardCvcElement />
          <button type="submit">Pay with Card</button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutFormBoth;
