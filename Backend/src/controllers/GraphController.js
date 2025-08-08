const Payment = require("@/models/PaymentCoin");
const PaymentSubscription = require("@/models/PaymentSubscription");
const Coupon = require("@/models/Coupon");
const User = require("@/models/User");
const Premium = require("@/models/Premium");
const Employee = require("@/models/Employee");
const Order = require("@/models/Order");
const Contact = require('@/models/Contact');

const adminDashboard = async (req, res) => {
  try {
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
    const totalCoinsIssued = coinResult?.totalCoins || 0;
    const totalSubAmount = subResult?.total || 0;
    const totalPayments = totalCoinAmount + totalSubAmount;

    const totalPremiumUsers = await User.countDocuments({
      premium: { $ne: "Free" },
    });

    const totalNormalUsers = await User.countDocuments({
      premium: "Free",
    });

    const totalCouponsUsed = await Coupon.countDocuments({ isActive: true });

    const totalEmployeeActive = await Employee.countDocuments({
      isActive: true,
    });
    const totalEmployeeInactive = await Employee.countDocuments({
      isActive: false,
    });

    const allPlans = await Premium.find({}, "planName");
    const planNames = allPlans.map((plan) => plan.planName);

    const totalProUsers =
      (await User.countDocuments({
        premium: "Pro",
      })) || 0;

    const totalBasicUsers =
      (await User.countDocuments({
        premium: "Basic",
      })) || 0;

    const totalAllPremiumUsers =
      (await User.countDocuments({
        premium: "Premium",
      })) || 0;

    const coinPurchasesByMonth = await Payment.aggregate([
      {
        $match: {
          status: "completed",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalCoins: { $sum: "$coins" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    const monthLabels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const Coinlabels = [];
    const Coindata = [];

    coinPurchasesByMonth.forEach((item) => {
      const monthName = monthLabels[item._id.month - 1];
      const label = `${monthName} ${item._id.year}`;
      Coinlabels.push(label);
      Coindata.push(item.totalCoins);
    });

    const summary = [
      { title: "Total Payments", value: `$ ${totalPayments.toLocaleString()}` },
      { title: "Coins Issued", value: totalCoinsIssued.toLocaleString() },
      { title: "Active Subscriptions", value: totalPremiumUsers },
      { title: "Coupons Active", value: totalCouponsUsed },
    ];

    const userPieData = {
      labels: ["Premium Users", "Normal Users"],
      title: "User Types",
      data: [totalPremiumUsers, totalNormalUsers],
    };

    const premiumUserData = {
      labels: planNames,
      title: "Premium Types",
      data: [
        totalBasicUsers,
        totalNormalUsers,
        totalProUsers,
        totalAllPremiumUsers,
      ],
    };

    const coinBuyUserData = {
      labels: Coinlabels,
      title: "User Coin Buy",
      data: Coindata,
    };

    const paymentgraph = {
      coin: totalCoinAmount,
      subscription: totalSubAmount,
    };

    const employeStatus = {
      active: totalEmployeeActive,
      noactive: totalEmployeeInactive,
    };

    const ordersPerMonth = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const OrderMonthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const Orderlabels = ordersPerMonth.map((item) => {
      const monthName = OrderMonthNames[item._id.month - 1];
      return `${monthName} ${item._id.year}`;
    });

    const OrderData = ordersPerMonth.map((item) => item.totalOrders);

    const orderGraph = {
      label: Orderlabels,
      data: OrderData
    }

    return res.status(200).json({
      summary,
      userPieData,
      premiumUserData,
      coinBuyUserData,
      paymentgraph,
      employeStatus,orderGraph
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({ message: "Server Error", error });
  }
};


const orderGraph = async (req, res) => {
  const { groupBy } = req.query;

  try {
    let groupStage;
    let labelFormatter;

    switch (groupBy) {
      case 'week':
        groupStage = {
          year: { $year: "$createdAt" },
          dayOfWeek: { $dayOfWeek: "$createdAt" },
        };
        labelFormatter = (item) => {
          const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          return `${dayNames[item._id.dayOfWeek - 1]} ${item._id.year}`;
        };
        break;

      case 'month':
        groupStage = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        };
        labelFormatter = (item) => {
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          return `${monthNames[item._id.month - 1]} ${item._id.year}`;
        };
        break;

      case 'year':
        groupStage = {
          year: { $year: "$createdAt" },
        };
        labelFormatter = (item) => `${item._id.year}`;
        break;

      default:
        return res.status(400).json({ message: "Invalid groupBy value. Use 'week', 'month', or 'year'." });
    }


    const orders = await Order.aggregate([
      { $match: {} },
      {
        $group: {
          _id: groupStage,
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.dayOfWeek": 1 } }
    ]);


    const labels = orders.map(labelFormatter);
    const data = orders.map(item => item.totalOrders);

    return res.status(200).json({ labels, data });

  } catch (error) {
    console.error("Error generating order graph:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



const paymentGraph = async (req, res) => {
  const { groupBy } = req.query;

  try {
    let groupStage;
    let labelFormatter;

    switch (groupBy) {
      case "week":
        groupStage = {
          year: { $year: "$createdAt" },
          week: { $week: "$createdAt" },
          status: "$status",
        };
        labelFormatter = (item) => `W${item._id.week}-${item._id.year}`;
        break;
      case "month":
        groupStage = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          status: "$status",
        };
        labelFormatter = (item) => {
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          return `${months[item._id.month - 1]} ${item._id.year}`;
        };
        break;
      case "year":
        groupStage = {
          year: { $year: "$createdAt" },
          status: "$status",
        };
        labelFormatter = (item) => `${item._id.year}`;
        break;
      default:
        return res.status(400).json({ message: "Invalid groupBy. Use 'week', 'month', or 'year'." });
    }

    const results = await Payment.aggregate([
      {
        $group: {
          _id: groupStage,
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.week": 1 } },
    ]);

    const labelsSet = new Set();
    const statusBuckets = {
      completed: {},
      pending: {},
      failed: {},
    };

    results.forEach((item) => {
      const label = labelFormatter(item);
      labelsSet.add(label);
      const status = (item._id.status || "").toLowerCase();
      if (statusBuckets[status]) {
        statusBuckets[status][label] = item.count;
      }
    });

    const sortedLabels = Array.from(labelsSet).sort();

    const data = {
      completed: sortedLabels.map((label) => statusBuckets.completed[label] || 0),
      pending: sortedLabels.map((label) => statusBuckets.pending[label] || 0),
      failed: sortedLabels.map((label) => statusBuckets.failed[label] || 0),
    };

    return res.status(200).json({ labels: sortedLabels, data });
  } catch (error) {
    console.error("Error in paymentGraph:", error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

const contactGraph= async (req, res) => {
  const { groupBy } = req.query;

  try {
    let groupStage, labelFormatter, sortStage;

    switch (groupBy) {
      case "week":
        groupStage = {
          year: { $year: "$createdAt" },
          week: { $week: "$createdAt" },
          close: "$close"
        };
        labelFormatter = (item) => `W${item._id.week}-${item._id.year}`;
        sortStage = { "_id.year": 1, "_id.week": 1 };
        break;

      case "month":
        groupStage = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          close: "$close"
        };
        labelFormatter = (item) => {
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          return `${months[item._id.month - 1]} ${item._id.year}`;
        };
        sortStage = { "_id.year": 1, "_id.month": 1 };
        break;

      case "year":
        groupStage = {
          year: { $year: "$createdAt" },
          close: "$close"
        };
        labelFormatter = (item) => `${item._id.year}`;
        sortStage = { "_id.year": 1 };
        break;

      default:
        return res.status(400).json({
          message: "Invalid groupBy. Use 'week', 'month', or 'year'."
        });
    }

    const results = await Contact.aggregate([
      {
        $match: {
          createdAt: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: groupStage,
          count: { $sum: 1 }
        }
      },
      { $sort: sortStage }
    ]);

    const labelsSet = new Set();
    const buckets = {
      closed: {},
      open: {}
    };

    results.forEach((item) => {
      const label = labelFormatter(item);
      labelsSet.add(label);

      const statusKey = item._id.close ? "closed" : "open";
      buckets[statusKey][label] = item.count;
    });

    const sortedLabels = Array.from(labelsSet).sort((a, b) => {
      const extract = (str) => str.match(/\d+/g)?.map(Number) || [];
      const [a1, a2] = extract(a), [b1, b2] = extract(b);
      if (a1 !== b1) return a1 - b1;
      return (a2 || 0) - (b2 || 0);
    });

    const data = {
      closed: sortedLabels.map(label => buckets.closed[label] || 0),
      open: sortedLabels.map(label => buckets.open[label] || 0)
    };

    return res.status(200).json({ labels: sortedLabels, data });

  } catch (error) {
    console.error("Error in contactGraphByClose:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error"
    });
  }
};





const employeeGraph = async (req, res) => {
  const { groupBy } = req.query;

  try {
    let groupStage;
    let labelFormatter;

    switch (groupBy) {
      case "week":
        groupStage = {
          year: { $year: "$createdAt" },
          week: { $week: "$createdAt" },
          active: "$isActive",
        };
        labelFormatter = (item) => `W${item._id.week}-${item._id.year}`;
        break;
      case "month":
        groupStage = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          active: "$isActive",
        };
        labelFormatter = (item) => {
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          return `${months[item._id.month - 1]} ${item._id.year}`;
        };
        break;
      case "year":
        groupStage = {
          year: { $year: "$createdAt" },
          active: "$isActive",
        };
        labelFormatter = (item) => `${item._id.year}`;
        break;
      default:
        return res.status(400).json({ message: "Invalid groupBy. Use 'week', 'month', or 'year'." });
    }

    const results = await Employee.aggregate([
      {
        $group: {
          _id: groupStage,
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.week": 1 } },
    ]);

    const labelsSet = new Set();
    const buckets = {
      active: {},
      inactive: {},
    };

    results.forEach((item) => {
      const label = labelFormatter(item);
      labelsSet.add(label);
      const statusKey = item._id.active ? "active" : "inactive";
      buckets[statusKey][label] = item.count;
    });

    const sortedLabels = Array.from(labelsSet).sort();

    const data = {
      active: sortedLabels.map((label) => buckets.active[label] || 0),
      inactive: sortedLabels.map((label) => buckets.inactive[label] || 0),
    };

    return res.status(200).json({ labels: sortedLabels, data });
  } catch (error) {
    console.error("Error in employeeGraph:", error);
    return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};


module.exports = {
  adminDashboard,
  orderGraph,
  paymentGraph,
  contactGraph,
  employeeGraph
};
