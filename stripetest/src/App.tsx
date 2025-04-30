import React, { useEffect, useState } from "react";
import { StripeElementsOptionsMode, loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios"; // Optional
import CheckoutFormBoth from "./CheckoutFormBoth";
const apiUrl = import.meta.env.VITE_STRIPE_PUB_KEY;
const stripePromise = loadStripe(apiUrl);

const App: React.FC = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [clientSecretX, setClientSecretX] = useState<string | null>(null);
  const [directDebit, setdirectDebit] = useState<boolean>(true);



  useEffect(() => {
    // Function to call the API
    const fetchPaymentIntent = async () => {
      try {
        const response = await axios.post("https://stripetest-pl0s.onrender.com/create-payment-intent-express", {
          amount: 100, // Amount in cents (e.g., $10.00)
          currency: "usd", // Currency
        });
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
      }
    };

    // fetchPaymentIntent();
  }, []);
  useEffect(() => {
    // Function to call the API
    const fetchPaymentIntentX = async () => {
      try {
        const response = await axios.post("https://stripetest-pl0s.onrender.com/create-setup-intent-express", {
          customerId: "cus_RnanFK87tc6FxT", // Currency
        });
        setClientSecretX(response.data.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
      }
    };

    // fetchPaymentIntentX();
  }, []);

  // Options for the Elements provider
  const options = clientSecret ? { clientSecret } : undefined;
  const optionsxx:StripeElementsOptionsMode = {
    mode: 'payment',
    amount: 1099,
    currency: 'usd',
    // Customizable with appearance API.
  };
  const options1 = clientSecretX ? { clientSecret:clientSecretX,applePay: {
    recurringPaymentRequest: {
      paymentDescription: "Direct Debit Subscription",
      regularBilling: {
        amount: 0,
        recurringPaymentIntervalUnit: "month",
        recurringPaymentIntervalCount: 1,
        label:"direct debit setup"
      },
      billingAgreement: "billing agreement",
      managementURL: "https://stripe.com",
    },
  }, } : undefined;


  return (
    <div>
      <h1>Stripe Checkout</h1>
      <button onClick={() => {
        setdirectDebit(!directDebit)
      }}>

        {
          directDebit && 'Go to Normal Flow'
        }

        {
          !directDebit && 'Go to Direct debit Flow'
        }
      </button>


      {clientSecret && !directDebit && (
        <Elements stripe={stripePromise} options={optionsxx}>
          <CheckoutFormBoth directDebit={directDebit}/>
        </Elements>
      )}
      {clientSecretX && directDebit && (
        <Elements stripe={stripePromise} options={options1}>
          <CheckoutFormBoth directDebit={directDebit}/>
        </Elements>
      )}
      {
        !clientSecret || !clientSecretX && (
          <p>Loading.......</p>
        )

      }

    </div>
  );
};

export default App;
