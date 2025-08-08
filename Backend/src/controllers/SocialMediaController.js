const SocialMedia = require('@/models/SocialMedia');

const GetSocialMedia = async (req, res) => {
    try {
        const socialMedia = await SocialMedia.findOne().select('-__v');;
        if (!socialMedia) {
            return res.status(404).json({ message: "No social media details found and Please add Social Media Link" });
        }
        res.status(200).json(socialMedia);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const UpdateSocialMedia = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'ADMIN') {
            return res.status(404).json({ message: "Access denied. Admins only!" });
        }

        const { email, whatsAppPhone, facebook, instagram, telegram } = req.body;
        let socialMedia = await SocialMedia.findOne();

        if (!socialMedia) {
            return res.status(404).json({ message: "No social media record found. Please create one first." });
        }

        if (email) socialMedia.email = email;
        if (whatsAppPhone) socialMedia.whatsAppPhone = whatsAppPhone;
        if (facebook) socialMedia.facebook = facebook;
        if (instagram) socialMedia.instagram = instagram;
        if (telegram) socialMedia.telegram = telegram;

        await socialMedia.save();
        res.status(200).json({ message: "Social media details updated successfully!", data: socialMedia });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { GetSocialMedia, UpdateSocialMedia };
