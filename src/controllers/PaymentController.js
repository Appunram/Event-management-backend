const stripe = require("stripe")(process.env.PAYMENT_KEY);


module.exports = {
    async PaymentGateway(req, res) {
        try {
            const {event} = req.body;
            const paymentIntent = await stripe.paymentIntents.create({
                amount: event.price*100,
                currency: "inr",
                description: `Registration of ${event.title}`,
            });
            res.status(200).send(paymentIntent.client_secret);
        } catch (err) {
            console.log(err)
            res.status(500).json({ statusCode: 500, message: err.message });
        }
    }
}