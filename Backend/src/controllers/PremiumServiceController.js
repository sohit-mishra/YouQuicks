const Premium = require('@/models/Premium');

const allPremiumServices = async (req, res) => {
    try {
        const plans = await Premium.find().sort({ createdAt: 1 });
        res.status(200).json(plans);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error });
    }
}

const getByIdPremiumServices = async (req, res) => {
    try {
        const { id } = req.params;
        const plan = await Premium.findById(id).select('-createdAt -__v');
        res.status(200).json(plan);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error });
    }
}

const createPremiumServices = async (req, res) => {
    try {
        const {
            planName,
            youtubeChannels,
            maxVideoDuration,
            monthlyCoins,
            prioritizedTransactions,
            prioritizedService,
            transactionCostReduction,
            pricePerMonth,
            durationInMonths
        } = req.body;

        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Access denied. Admins only!" });
        }


        const newPlan = new Premium({
            planName,
            youtubeChannels,
            maxVideoDuration,
            monthlyCoins,
            prioritizedTransactions,
            prioritizedService,
            transactionCostReduction,
            pricePerMonth,
            durationInMonths
        });

        await newPlan.save();

        res.status(201).json({ message: "Premium plan created successfully", data: newPlan });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error });
    }
}

const updatePremiumServices = async (req, res) => {
    try {
        const { id } = req.params;
        const { planName,
            youtubeChannels,
            maxVideoDuration,
            monthlyCoins,
            prioritizedTransactions,
            prioritizedService,
            transactionCostReduction,
            pricePerMonth,
            durationInMonths } = req.body;

        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Access denied. Admins only!" });
        }

        const updated = await Premium.findByIdAndUpdate(id, {
            planName,
            youtubeChannels,
            maxVideoDuration,
            monthlyCoins,
            prioritizedTransactions,
            prioritizedService,
            transactionCostReduction,
            pricePerMonth,
            durationInMonths
        }, { new: true });
        if (!updated) {
            return res.status(404).json({ message: "Premium plan not found." });
        }
        res.status(200).json(updated);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error });
    }
}

const deletePremiumServices = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Access denied. Admins only!" });
        }

        const deleted = await Premium.findByIdandDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: "Premium plan not found." });
        }

        res.status(200).json({ message: "Premium plan deleted successfully." });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}


const UserPremiumServicesList = async(req,res)=>{
    try {
        const PremiumList = User.find();
        res.status(200).json(PremiumList);
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}

 
module.exports = { allPremiumServices, getByIdPremiumServices, createPremiumServices, updatePremiumServices, deletePremiumServices, UserPremiumServicesList};