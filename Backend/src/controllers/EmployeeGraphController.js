const Order = require("@/models/Order");
const Contact = require("@/models/Contact");
const Payment = require("@/models/PaymentCoin");
const PaymentSubscription = require("@/models/PaymentSubscription");
const User = require("@/models/User");

const employeeDrashboard = async (req, res) => {
  try {
    const totalUser = await User.countDocuments();
    const totalOrder = await Order.countDocuments();
    const closedContact = await Contact.countDocuments({ close: true });
    const openContact = await Contact.countDocuments({ close: false });

    const totalPremiumUsers = await User.countDocuments({
      premium: { $ne: "Free" },
    });

    const totalNormalUsers = await User.countDocuments({
      premium: "Free",
    });

    const [coinResult] = await Payment.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          totalCoins: { $sum: "$coins" },
        },
      },
    ]);

    const [subResult] = await PaymentSubscription.aggregate([
      { $match: { paymentStatus: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalCoinAmount = coinResult?.totalAmount || 0;
    const totalSubAmount = subResult?.total || 0;

    const summary = [
      { title: "Total User", value: totalUser },
      { title: "Total Order", value: totalOrder },
      { title: "Closed Contacts", value: closedContact },
      { title: "Open Contacts", value: openContact },
    ];

    const coinandsubscription = {
      labels: ["Payment Coin", "Payment Subscription"],
      data: [totalCoinAmount, totalSubAmount],
    };

    const contactusStatus = {
      labels: ["Open", "Closed"],
      data: [openContact, closedContact],
    };

    const userDistribution = {
      labels: ["User", "Premium User"],
      data: [totalNormalUsers, totalPremiumUsers],
    };

    const orders = await Order.find().sort({ createdAt: 1 });

    const filteredOrders = orders.filter((order) =>
      ["In Progress", "Pending"].includes(order.status)
    );

    const monthlyTotals = {};

    filteredOrders.forEach((order) => {
      const date = new Date(order.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      monthlyTotals[key] = (monthlyTotals[key] || 0) + (order.total || 0);
    });

    const labels = [];
    const data = [];

    if (filteredOrders.length > 0) {
      const startDate = new Date(filteredOrders[0].createdAt);
      const endDate = new Date(
        filteredOrders[filteredOrders.length - 1].createdAt
      );
      const current = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        1
      );

      while (
        current.getFullYear() < endDate.getFullYear() ||
        (current.getFullYear() === endDate.getFullYear() &&
          current.getMonth() <= endDate.getMonth())
      ) {
        const key = `${current.getFullYear()}-${String(
          current.getMonth() + 1
        ).padStart(2, "0")}`;
        labels.push(key);
        data.push(monthlyTotals[key] || 0);
        current.setMonth(current.getMonth() + 1);
      }
    }

    const orderGraph = { labels, data };

    res.status(200).json({
      summary,
      coinandsubscription,
      contactusStatus,
      userDistribution,
      orderGraph,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

module.exports = employeeDrashboard;
