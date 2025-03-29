import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import axios from "axios"; // Optional

const stripePromise = loadStripe("pk_test_lgpHO4zFKz0zPjFoNNVMjCSB");

const App: React.FC = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    // Function to call the API
    const fetchPaymentIntent = async () => {
      try {
        const response = await axios.post("https://stripetest-pl0s.onrender.com/create-payment-intent", {
          amount: 1000, // Amount in cents (e.g., $10.00)
          currency: "usd", // Currency
        });
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
      }
    };

    fetchPaymentIntent();
  }, []);

  // Options for the Elements provider
  const options = clientSecret ? { clientSecret } : undefined;

  return (
    <div>
      <h1>Stripe Checkout</h1>
      {clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;
