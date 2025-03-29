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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
