# 📺 YouQuicks – YouTube Engagement & Reward Platform

YouQuicks is a full-stack YouTube engagement platform where users earn virtual coins for interacting with videos (watching, liking, subscribing). Users can also purchase coins or premium memberships via **Razorpay**. The platform supports **Role-Based Access Control (RBAC)** with three roles: **User, Employee, and Admin**.

---

## 🚀 Features
- 🎥 **YouTube Engagement** – Earn coins for watching, liking, and subscribing to YouTube videos.
- 💰 **Buy Coins** – Purchase coins securely using **Razorpay**.
- 💳 **Premium Membership** – Unlock exclusive features with a one-time payment.
- 🔐 **Role-Based Access Control (RBAC)**:
  - **User** – Can interact with videos, earn coins, buy coins, and upgrade to premium.
  - **Employee** – Can review and approve content, manage limited system data.
  - **Admin** – Full system control, including user management and analytics.
- ☁️ **Cloudinary Integration** – Efficient media upload and storage.
- 📧 **Email Support** – Automated emails using **Nodemailer**.
- 📱 **Responsive UI** – Built with React, Tailwind CSS, and shadcn/ui.

---

## 🛠 Tech Stack
**Frontend**:
- React, Vite, Tailwind CSS, shadcn/ui
- HTML5, CSS3
- Axios for API calls

**Backend**:
- Node.js, Express.js, MongoDB
- RESTful APIs
- Cloudinary for media storage
- Razorpay for payment processing
- Nodemailer for email notifications
- JWT for authentication

---

## 💳 Payment Flow (Razorpay Integration)
1. **Buy Coins**:
   - Go to the "Buy Coins" page.
   - Select coin package.
   - Complete payment via Razorpay.
   - Coins are credited to the user account automatically.

2. **Upgrade to Premium**:
   - Navigate to "Premium Membership".
   - Complete one-time Razorpay payment.
   - Account is upgraded instantly with premium features.

---

## 🎯 YouTube Engagement Flow
- User selects a video from the platform.
- Completes action (watch, like, subscribe).
- Coins are credited based on action type.

---

## 👥 Roles & Permissions
| Role      | Permissions |
|-----------|-------------|
| **User**  | Watch videos, earn coins, buy coins, upgrade to premium |
| **Employee** | Approve/reject videos, manage limited data |
| **Admin** | Full control over users, coins, content, and analytics |

---

## 📞 Contact & Support
- LinkedIn: [sohitmishra](https://www.linkedin.com/in/sohitmishra)
- GitHub: [sohit-mishra](https://github.com/sohit-mishra)

---

