require('module-alias/register');
const express = require('express');
const cors = require('cors');
const connectToDatabase = require('@/config/db');
const config = require('@/config/env');
const UserAuthRoutes = require('@/routes/UserAuthRoutes');
const EmployeeAuthRoutes = require('@/routes/EmployeeAuthRoutes');
const AdminAuthRoutes = require('@/routes/AdminAuthRoutes');
const AdminRoutes = require('@/routes/adminRoutes');
const contactRoutes = require('@/routes/contactRoutes');
const socialMediaRoutes = require('@/routes/socialmediaRoutes');
const premiumServicesRoutes = require('@/routes/premiumservicesRoutes');
const userRoutes = require('@/routes/userRoutes');
const OrderRoutes = require('@/routes/OrderRoutes');
const CoinRoutes = require('@/routes/coinRoutes');
const EmployeeRoutes = require('@/routes/EmployeeRoutes');
const CouponRoutes = require('@/routes/CouponRoutes');
const PaymentRoutes = require('@/routes/PaymentRoutes');
const BlogRoute = require('@/routes/BlogRoute');
const GraphRoute = require('@/routes/GraphRoute');
const EmployeeGraphRoute = require('@/routes/EmployeeGraphRoute');



const app = express();
const PORT = config.PORT;

connectToDatabase();

app.use(cors({
    origin: config.FRONTED_URL,  
    credentials: true          
  }));

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello World");
});

app.use('/api/auth', UserAuthRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api/auth/admin', AdminAuthRoutes);
app.use('/api/auth/employee', EmployeeAuthRoutes);
app.use('/api/employee', EmployeeRoutes);
app.use('/api/employee-grapgh', EmployeeGraphRoute);
app.use('/api/contact', contactRoutes);
app.use('/api/coupon', CouponRoutes);
app.use('/api/social-media', socialMediaRoutes);
app.use('/api/premium-services', premiumServicesRoutes);
app.use('/api/user', userRoutes);
app.use('/api/payment', PaymentRoutes);
app.use('/api/graph', GraphRoute);

app.use('/api/blog', BlogRoute);
app.use('/api/order', OrderRoutes);
app.use('/api/coin', CoinRoutes);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
