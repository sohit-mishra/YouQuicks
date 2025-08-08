require("module-alias/register");
const mongoose = require("mongoose");
const connectToDatabase = require("@/config/db");
const SocialMedia = require("@/models/SocialMedia");
const Premium = require("@/models/Premium");
const Admin = require("@/models/Admin");
const Coin = require("@/models/SetCoin");
const bcrypt = require("bcryptjs");

const AdminSeedData = {
  name: "Sohit Mishra",
  email: "admin@youquicks.com",
  password: "aman7836@",
  profilePicture: "",
};

const CoinSeed = {
  defaultCoin: 0,
  subscribersCoinPay: 50,
  subscribersCoinEarn: 0,
  likesCoinPay: 25,
  likesCoinEarn: 0,
  commentsCoinPay: 75,
  commentsCoinEarn: 0,
  watchMinutesCoinPay: 100,
  watchMinutesCoinEarn: 0,
};

const SocialMediaSeedData = {
  email: "support@youquicks.com",
  whatsAppPhone: "+919671619743",
  facebook: "youquicks",
  instagram: "youquicks",
  telegram: "@youquicks",
};

const premiumPlans = [
  {
    planName: "Free",
    youtubeChannels: 1,
    maxVideoDuration: 5,
    monthlyCoins: 0,
    pricePerMonth: 0,
    durationInMonths: 1,
  },
  {
    planName: "Basic",
    youtubeChannels: 3,
    maxVideoDuration: 15,
    monthlyCoins: 100,
    prioritizedTransactions: false,
    prioritizedService: false,
    transactionCostReduction: 5,
    pricePerMonth: 499,
    durationInMonths: 1,
  },
  {
    planName: "Pro",
    youtubeChannels: 5,
    maxVideoDuration: 30,
    monthlyCoins: 300,
    prioritizedTransactions: true,
    prioritizedService: true,
    transactionCostReduction: 10,
    pricePerMonth: 999,
    durationInMonths: 1,
  },
  {
    planName: "Premium",
    youtubeChannels: 10,
    maxVideoDuration: 60,
    monthlyCoins: 600,
    prioritizedTransactions: true,
    prioritizedService: true,
    transactionCostReduction: 20,
    pricePerMonth: 1999,
    durationInMonths: 1,
  },
];

const seedAll = async () => {
  try {
    await connectToDatabase();

    await Admin.deleteMany();
    const hashedPassword = await bcrypt.hash(AdminSeedData.password, 10);

    const AdminWithHashedPassword = {
      ...AdminSeedData,
      password: hashedPassword,
    };

    const AdminData = await Admin.create(AdminWithHashedPassword);
    console.log("Admin seeded successfully.");

    await SocialMedia.deleteMany();
    const socialMediaSeedWithAdmin = {
      ...SocialMediaSeedData,
      adminId: AdminData._id,
    };
    await SocialMedia.create(socialMediaSeedWithAdmin);
    console.log("Social Media seeded successfully.");

    await Coin.deleteMany();
    const coinSeedWithAdmin = {
      ...CoinSeed,
      adminId: AdminData._id,
    };
    await Coin.create(coinSeedWithAdmin);
    console.log("Coin Added seeded successfully.");

    const packages = [
      { coinAmount: 12000, priceUSD: 5.0 },
      { coinAmount: 25000, priceUSD: 10.0 },
      { coinAmount: 65000, priceUSD: 25.0 },
    ];

    await CoinPackage.insertMany(packages);
    console.log("Seeded coin packages");

    await Premium.deleteMany();
    const premiumPlansWithAdmin = premiumPlans.map((plan) => ({
      ...plan,
      adminId: AdminData._id,
    }));
    await Premium.insertMany(premiumPlansWithAdmin);
    console.log("Premium Plans seeded successfully.");
  } catch (err) {
    console.error("Seeding failed:", err.message || err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

seedAll();
