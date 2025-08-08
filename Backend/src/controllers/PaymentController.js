const Payment = require("@/models/PaymentCoin");
const PaymentSubscrption = require("@/models/PaymentSubscription");
const Stripe = require("stripe");
const Razorpay = require("razorpay");
const config = require("@/config/env");
const crypto = require("crypto");
const User = require("@/models/User");
const Coin = require('@/models/SetCoin');
const Premium = require('@/models/Premium');

const stripe = new Stripe(config.STRIPE_SECRET_KEY);
const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_KEY_SECRET,
});

const createStripeSession = async (req, res) => {
  try {
    const { coins, price, quantity } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${coins} Coins`,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: quantity || 1,
        },
      ],
      mode: "payment",
      success_url: `${config.FRONTEND_URL}/user/buycoins/success`,
      cancel_url: `${config.FRONTEND_URL}/user/buycoins/cancel`,
      metadata: {
        userId: req.user.id,
        coins,
        method: "stripe",
      },
    });

    console.log(session);

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, coins } = req.body;

    if (!amount || !coins) {
      return res.status(400).json({ error: "Amount and coins are required" });
    }

    const defaultcoins = await Coin.findOne();

    if (coins % defaultcoins.defaultCoin !== 0) {
      return res.status(400).json({ error: "Invalid coin quantity." });
    }

    const expectedAmount = coins / defaultcoins.defaultCoin;

    if (Number(amount) !== expectedAmount) {
      console.log("Mismatch:", amount, expectedAmount);
      return res.status(400).json({ error: "Please try Again" });
    }

    const receipt = `receipt_${Date.now()}`;

    const CreateOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "USD",
      receipt,
      partial_payment: false,
      notes: {
        coins: coins.toString(),
      },
    });

    const payment = new Payment({
      userId: req.user.userId,
      coins: parseInt(coins),
      amount,
      currency: "USD",
      method: "razorpay",
      status: "pending",
      transactionId: CreateOrder.id,
    });

    await payment.save();

    res.status(201).json(CreateOrder);
  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({ error: error.message });
  }
};

const handleWebhook = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ error: error.message });
  }
};

const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const generatedSignature = crypto
      .createHmac("sha256", config.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    const payment = await Payment.findOneAndUpdate(
      { transactionId: razorpay_order_id },
      {
        status: "completed",
        paymentId: razorpay_payment_id,
      },
      { new: true }
    );

    await User.findByIdAndUpdate(payment.userId, {
      $inc: { coin: payment.coins },
    });

    res
      .status(200)
      .json({
        success: true,
        message: "Payment verified and completed",
        id: payment._id,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markPaymentFailed = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;

    if (!razorpay_order_id) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    const payment = await Payment.findOneAndUpdate(
      { transactionId: razorpay_order_id },
      { status: "failed" },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ error: "Payment record not found" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Payment marked as failed",
        id: payment._id,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const AllPayment = async (req, res) => {
  try {
    const payments = await Payment.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const AllPaymentSubscription = async (req, res) => {
  try {
    const payments = await PaymentSubscrption.find().populate('userId', 'name email').populate('planId', 'planName').sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const GetPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id);

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const GetUserById = async (req, res) => {
  try {
    const id = req.user.userId;

    const user = await Payment.find({ userId: id });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createSubRazorpayOrder = async (req, res) => {
  try {
    const { id, planName, durationInMonths, monthlyCoins, maxVideoDuration } = req.body;

    if (!id || !durationInMonths) {
      return res.status(400).json({ error: "id and durationInMonths are required" });
    }

    const findPremium = await Premium.findById(id);
    if (!findPremium) {
      return res.status(404).json({ error: "Plan not found" });
    }

    const amount = findPremium.pricePerMonth * durationInMonths;
    const receipt = `receipt_${Date.now()}`;

    const CreateOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "USD",
      receipt,
      partial_payment: false,
      notes: {
        planName,
        monthlyCoins: monthlyCoins?.toString() || "0",
        maxVideoDuration: maxVideoDuration?.toString() || "0",
      },
    });

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + durationInMonths);

    const payment = new PaymentSubscrption({
      userId: req.user.userId,
      planId: id,
      amount,
      currency: CreateOrder.currency,
      paymentStatus: "Pending",
      paymentGateway: "Razorpay",
      transactionId: CreateOrder.id,
      startDate,
      endDate,
    });

    await payment.save();

    res.status(201).json(CreateOrder);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: error.message });
  }
};


const markPaymentSubFailed = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;

    if (!razorpay_order_id) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    const payment = await PaymentSubscrption.findOneAndUpdate(
      { transactionId: razorpay_order_id },
      { paymentStatus: "Failed" },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ error: "Payment record not found" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Payment marked as failed",
        id: payment._id,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyRazorpaySubPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const generatedSignature = crypto
      .createHmac("sha256", config.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    const payment = await PaymentSubscrption.findOneAndUpdate(
      { transactionId: razorpay_order_id },
      {
        paymentStatus: "completed",
        paymentId: razorpay_payment_id,
      },
      { new: true }
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Payment verified and completed",
        id: payment._id,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createStripeSession,
  createRazorpayOrder,
  handleWebhook,
  markPaymentFailed,
  verifyRazorpayPayment,
  AllPayment,
  GetPaymentById,
  GetUserById,
  createSubRazorpayOrder,
  verifyRazorpaySubPayment,
  markPaymentSubFailed,
  AllPaymentSubscription
};
