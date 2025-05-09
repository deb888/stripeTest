const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
console.log('Stripe Secret Key:', stripeSecretKey);
const stripe = require("stripe")(stripeSecretKey);

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Endpoint to create a Payment Intent
app.post("/create-payment-intent", async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency,
      payment_method_types: ["card"],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});
// Create Payment Intent for Express Checkout
app.post("/create-payment-intent-express", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount, // Amount in cents
      currency: req.body.currency, // Currency
      payment_method_types: ["card"],
      // automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating Express Checkout Payment Intent:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/create-setup-intent-express", async (req, res) => {
  const { customerId } = req.body; // Retrieve the customer ID from the request

  try {
    const setupIntent = await stripe.setupIntents.create({
      payment_method_types: ["card"],
      customer: customerId, // Associate the setup intent with the provided customer ID
    });

    res.json({ clientSecret: setupIntent.client_secret });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
