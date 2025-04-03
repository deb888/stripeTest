const express = require('express');
const bodyParser = require('body-parser');
const paypal = require('@paypal/checkout-server-sdk');

const app = express();
app.use(bodyParser.json()); // Parse JSON payloads

// PayPal credentials (replace with your own)
const environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_KEY, process.env.PAYPAL_SECRET_KEY);
const client = new paypal.core.PayPalHttpClient(environment);

// PayPal Webhook ID
const WEBHOOK_ID = 'YOUR_WEBHOOK_ID';

// Webhook endpoint
app.post('/paypal-webhook', async (req, res) => {
    const transmissionId = req.headers['paypal-transmission-id'];
    const timestamp = req.headers['paypal-transmission-time'];
    const certUrl = req.headers['paypal-cert-url'];
    const authAlgo = req.headers['paypal-auth-algo'];
    const transmissionSig = req.headers['paypal-transmission-sig'];
    const eventBody = JSON.stringify(req.body);

    const webhookEvent = {
        transmissionId,
        timestamp,
        webhookId: WEBHOOK_ID,
        eventBody,
        certUrl,
        authAlgo,
        transmissionSig,
    };

    try {
        // Verify PayPal webhook signature
        const request = new paypal.notifications.VerifyWebhookSignatureRequest();
        request.requestBody(webhookEvent);

        const response = await client.execute(request);

        if (response.result.verification_status === 'SUCCESS') {
            console.log('Webhook verified:', req.body);

            // Handle specific events
            switch (req.body.event_type) {
                case 'PAYMENT.SALE.COMPLETED':
                    console.log('Payment completed:', req.body);
                    break;
                case 'PAYMENT.SALE.DENIED':
                    console.log('Payment denied:', req.body);
                    break;
                default:
                    console.log('Unhandled event:', req.body.event_type);
            }

            res.sendStatus(200); // Acknowledge the webhook event
        } else {
            console.error('Webhook verification failed.');
            res.sendStatus(400);
        }
    } catch (error) {
        console.error('Error verifying webhook:', error);
        res.sendStatus(500);
    }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
