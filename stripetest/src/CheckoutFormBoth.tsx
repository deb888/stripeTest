import React from "react";
import { useStripe, useElements, ExpressCheckoutElement, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import { StripeExpressCheckoutElementConfirmEvent } from "@stripe/stripe-js";
import axios from "axios";
interface props {
  directDebit: boolean
}

const CheckoutFormBoth: React.FC<props> = ({ directDebit }) => {
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
    <>
    
    <h1>Checkout</h1>
    <div className="container">
     
      <div>
        <h2>Express Checkout</h2>
        <form onSubmit={handleSubmitExpressCheckout}>
          <ExpressCheckoutElement options={{
            buttonType: {
              googlePay: "buy",
              applePay:"buy"
            },
            buttonHeight:48,
            buttonTheme:{
              applePay:"white-outline"
            },
            wallets:{
              applePay:"always",
              googlePay:"always"
            },
            layout: {
              maxRows: 0,
            },
          }} onCancel={(event) => {
            console.log('====================================');
            console.log(event);
            console.log('====================================');
            if (stripe && elements) {

              stripe.confirmPayment({
                elements,
                confirmParams: {
                  return_url: window.location.href, // No return URL
                },
                redirect: "if_required"
              })
                .then(function (result) {
                  console.log('====================================');
                  console.log(result, "results");
                  console.log('====================================');
                  if (result.error) {
                    // Inform the customer that there's an error.
                  }
                });
            }
          }} onConfirm={function (event: StripeExpressCheckoutElementConfirmEvent) {
            console.log('====================================');
            console.log(event);
            if (stripe && elements) {
              if (directDebit) {
                 
                stripe.confirmSetup({
                  elements,
                  confirmParams: {
                    return_url: window.location.href, // No return URL
                  },
                  redirect: "if_required"
                })
                  .then(function (result) {
                    console.log('====================================');
                    console.log(result, "results");
                    console.log('====================================');
                    if (result.error) {
                      // Inform the customer that there's an error.
                    }
                  });
              } else {
                axios.post("https://stripetest-pl0s.onrender.com/create-payment-intent-express", {
                        amount: 100, // Amount in cents (e.g., $10.00)
                         currency: "usd", // Currency
                       }).then((_dt)=>{
                        stripe.confirmPayment({
                          clientSecret:_dt.data.clientSecret,
                          elements,
                          confirmParams: {
                            return_url: window.location.href, // No return URL
                          },
                          redirect: "if_required"
                        })
                          .then(function (result) {
                            console.log('====================================');
                            console.log(result, "results");
                            console.log('====================================');
                            if (result.error) {
                              // Inform the customer that there's an error.
                            }
                          });
                       })
               
              }

            }
            console.log('====================================');
          }} />
          <button type="submit">Pay with Express Checkout</button>
        </form>
      </div>
      <div>
        <button className="paypal-btn">Paypal</button> 
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
    </>
  );
};
// https://example.com/?payment_intent=pi_3R8rhFFU4XJK6pn72gxu20XS&payment_intent_client_secret=pi_3R8rhFFU4XJK6pn72gxu20XS_secret_f6PqWefd72fqNF16EA476ApGA&redirect_status=succeeded
export default CheckoutFormBoth;
