const Contact = require('@/models/Contact');
const {sendEmailContact} = require('@/utils/Email');

const CreateContact = async (req, res) => {
    try {
        const { name, email, link, request, Subject, message } = req.body;
        
        const existingContact = await Contact.findOne({ email });

        if (existingContact && !existingContact.close) {
            return res.status(400).json({ message: "You already have an open contact request!" });
        }

        
        const newContact = new Contact({ name, email, link, request, Subject, message });
        await newContact.save();

        res.status(201).json({ message: "Contact request created successfully!", contact: newContact });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const GetAllContact = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const GetSingleContact = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findById(id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact request not found' });
        }

        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const SendContactMail = async (req, res) => {
    const { id } = req.params;
    const { subject, body } = req.body;

    try {
        const adminEmail = req.user?.email;

        if (!adminEmail) {
            return res.status(403).json({ message: "Unauthorized: Admin email missing" });
        }

        const contact = await Contact.findById(id);

        if (!contact) {
            return res.status(404).json({ message: "Contact request not found" });
        }

        await sendEmailContact(contact.email, adminEmail, subject, body);

        res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const CloseContact = async (req, res) => {
    const { id } = req.params;
    try {
        const contact = await Contact.findById(id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact request not found' });
        }

        contact.status = 'Completed';
        contact.close = true;
        await contact.save();

        res.status(200).json({ message: "Contact request closed successfully!", contact });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {CreateContact, GetAllContact, GetSingleContact , SendContactMail, CloseContact};