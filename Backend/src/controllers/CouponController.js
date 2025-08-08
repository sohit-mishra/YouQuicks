const Coupon = require('@/models/Coupon');

const GetAllCoupon = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch coupons", error });
  }
};

const GetCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch coupon", error });
  }
};

const CreateCoupon = async (req, res) => {
  const adminId = req.user.id;

  try {
    const { code, discountPercentage, amount, expiryDate, startDate, usageLimit, description, type, } = req.body;

    const existingCoupon = await Coupon.findOne({ code });

    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const newCoupon = new Coupon({code, discountPercentage, amount, expiryDate, startDate, usageLimit, 
      description, type, adminId
    });

    await newCoupon.save();
    res.status(201).json({ message: "Coupon created successfully", coupon: newCoupon });
  } catch (error) {
    res.status(500).json({ message: "Failed to create coupon", error });
  }
};


const UpdateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedCoupon) return res.status(404).json({ message: "Coupon not found" });
    res.status(200).json({ message: "Coupon updated", coupon: updatedCoupon });
  } catch (error) {
    res.status(500).json({ message: "Failed to update coupon", error });
  }
};


const UpdateStatusCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const updated = await Coupon.findByIdAndUpdate(id, { isActive }, { new: true });
    if (!updated) return res.status(404).json({ message: "Coupon not found" });
    res.status(200).json({ message: "Status updated", coupon: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status", error });
  }
};


const DeleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Coupon.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Coupon not found" });
    res.status(200).json({ message: "Coupon deleted", coupon: deleted });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete coupon", error });
  }
};

module.exports = {
  GetAllCoupon,
  GetCouponById,
  CreateCoupon,
  UpdateCoupon,
  UpdateStatusCoupon,
  DeleteCoupon,
};
