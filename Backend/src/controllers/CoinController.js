const Coin = require("@/models/SetCoin");

const GetAllCoin = async (req, res) => {
  try {
    const coin = await Coin.findOne().select(
      "-adminId -defaultCoin -subscribersCoinEarn -likesCoinEarn -commentsCoinEarn -watchMinutesCoinEarn"
    );

    if (!coin) {
      return res
        .status(404)
        .json({ message: "No coin record found. Please add a coin." });
    }

    const formattedCoin = {
      _id: coin._id,
      Subscriber: coin.subscribersCoinPay,
      Likes: coin.likesCoinPay,
      Comment: coin.commentsCoinPay,
      "Watch Minutes": coin.watchMinutesCoinPay,
    };

    res.status(200).json(formattedCoin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const UpdateCoin = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied. Admins only!" });
    }

    const {
        _id,
      defaultCoin,
      subscribersCoinPay,
      subscribersCoinEarn,
      likesCoinPay,
      likesCoinEarn,
      commentsCoinPay,
      commentsCoinEarn,
      watchMinutesCoinPay,
      watchMinutesCoinEarn,
    } = req.body;

    if (
      defaultCoin == null ||
      subscribersCoinPay == null ||
      subscribersCoinEarn == null ||
      likesCoinPay == null ||
      likesCoinEarn == null ||
      commentsCoinPay == null ||
      commentsCoinEarn == null ||
      watchMinutesCoinPay == null ||
      watchMinutesCoinEarn == null
    ) {
      return res
        .status(400)
        .json({ message: "All coin configuration fields are required." });
    }

    const updated = await Coin.findByIdAndUpdate(
      _id,
      {
        defaultCoin,
        subscribersCoinPay,
        subscribersCoinEarn,
        likesCoinPay,
        likesCoinEarn,
        commentsCoinPay,
        commentsCoinEarn,
        watchMinutesCoinPay,
        watchMinutesCoinEarn,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Coin updated successfully!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDefaultCoin = async (req, res) => {
  try {
    const findCoin = await Coin.findOne();
    const formattedCoin = {
      coin: findCoin.defaultCoin,
    };
    res.status(200).json(formattedCoin);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const GetAllAdminCoin = async (req, res) => {
  try {
    const allcoin = await Coin.findOne().select(
      "-adminId -createdAt -updatedAt -__v"
    );
    res.status(200).json(allcoin);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};


module.exports = { GetAllCoin, UpdateCoin, getDefaultCoin, GetAllAdminCoin };
