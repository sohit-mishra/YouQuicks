const Order = require("@/models/Order");
const Coin = require("@/models/SetCoin");
const User = require("@/models/User");

const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { orderType, title, total, videoUrl } = req.body;

    if (!orderType || !title || !total || !videoUrl) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    const coinData = await Coin.findOne(); 
    if (!coinData) return res.status(400).json({ error: "Coin settings not found." });

    const coinMap = {
      Likes: "likesCoinPay",
      Subscriber: "subscribersCoinPay",
      Comment: "commentsCoinPay",
      "Watch Minutes": "watchMinutesCoinPay",
    };

    const field = coinMap[orderType];
    if (!field || coinData[field] === undefined) {
      return res.status(400).json({ error: "Invalid order type." });
    }

    const costPerUnit = coinData[field];
    const totalCost = costPerUnit * Number(total);

    if (user.coin < totalCost) {
      return res.status(400).json({ error: "Insufficient coin balance." });
    }

    user.coin -= totalCost;
    await user.save();

    const newOrder = new Order({
      userId,
      orderType,
      title,
      quantity: 0,
      videoUrl,
      coinUsed: totalCost,
      total,
      cost: costPerUnit,
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order created successfully.",
      order: newOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};


const AllOrder = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
};

const updateStatusOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update order status." });
  }
};

const DeleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const deleted = await Order.findByIdAndDelete(orderId);

    if (!deleted) {
      return res.status(404).json({ error: "Order not found." });
    }


    if (deleted.status === "Completed") {
      return res.status(200).json({
        message: "Order deleted and coins refunded successfully.",
        refundedCoins: 0,
      });
    }

    const refundedCoinsAmount =  deleted.coinUsed - deleted.total * deleted.quantity;

    const user = await User.findById(deleted.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found to refund coins." });
    }

    user.coin = user.coin + refundedCoinsAmount;
    await user.save();

    res.status(200).json({
      message: "Order deleted and coins refunded successfully.",
      refundedCoins: refundedCoinsAmount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete order." });
  }
};

const nextOrder = async (req, res) => {
  try {
    const workerId = req.user.userId;

    const existing = await Order.findOne({ status: "In Progress", assignedTo: workerId });
    if (existing) {
      return res.json({ order: existing });
    }

    const next = await Order.findOneAndUpdate(
      {
        status: "Pending",
        userId: { $ne: workerId },      
        assignedTo: { $exists: false }  
      },
      {
        status: "In Progress",
        assignedTo: workerId,
        startTime: new Date()
      },
      {
        sort: { createdAt: 1 },
        new: true
      }
    );

    if (!next) {
      return res.status(404).json({ message: "No tasks available" });
    }

    res.json({ order: next });

  } catch (err) {
    console.error("nextOrder error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const AllOrderEmployeeAndAdmin = async(req,res)=>{
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
}


module.exports = { createOrder, AllOrder, updateStatusOrder, DeleteOrder, nextOrder, AllOrderEmployeeAndAdmin };
