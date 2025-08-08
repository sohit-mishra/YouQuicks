import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "@/router/PrivateRoute";

import Layout from "@/Layouts/AllLayout";
import UserLayout from "@/Layouts/UserLayout";
import AdminLayout from "@/Layouts/AdminLayout";
import EmployeeLayout from "@/Layouts/EmployeeLayout";

import Home from "@/pages/Home";
import Faq from "@/pages/Faq";
import Contact from "@/pages/Contact";
import PremiumServices from "@/pages/PremiumServices";
import Affiliates from "@/pages/Affiliates";
import Blog from "@/pages/Blog";
import BlogPage from "@/pages/BlogPage";
import UnAuthorized from "@/pages/UnAuthorized";
import PageNotFound from "@/pages/PageNotFound";

import UserLogin from "@/pages/User/Auth/Login";
import UserSignUp from "@/pages/User/Auth/Signup";
import UserForgetPassword from "@/pages/User/Auth/Forgetpassword";
import UserResetPassword from "@/pages/User/Auth/ResetPassword";
import UserOtp from "@/pages/User/Auth/Otp";

import EmployeeLogin from "@/pages/Employee/Auth/Login";
import EmployeeForgetPassword from "@/pages/Employee/Auth/ForgetPassword";
import EmployeeResetPassword from "@/pages/Employee/Auth/ResetPassword";

import AdminLogin from "@/pages/Admin/Auth/Login";
import AdminForgetPassword from "@/pages/Admin/Auth/ForgetPassword";
import AdminResetPassword from "@/pages/Admin/Auth/ResetPassword";

import Dashboard from "@/pages/User/Dashboard";
import EarnCoin from "@/pages/User/EarnCoin";
import BuyCoin from "@/pages/User/BuyCoin";
import Order from "@/pages/User/Order";
import Premium from "@/pages/User/Premium";
import PremiumPayment from "@/pages/User/PremiumPayment";
import PaymentHistory from "@/pages/User/PaymentHisotry";
import PaymentStatus from "@/pages/User/PaymentStatus";
import ProfileSetting from "@/pages/User/ProfileSetting";

import AdminDashboard from "@/pages/Admin/Dashboard";
import SocialMedia from "@/pages/Admin/SocialMedia";
import AllAdmin from "@/pages/Admin/Admin/AllAdmin";
import SingleAdmin from "@/pages/Admin/Admin/SingleAdmin";
import AllEmployee from "@/pages/Admin/Employee/AllEmployee";
import UserList from "@/pages/Admin/UserList";
import SingleUserList from "@/pages/Admin/Users/SingleUser";
import PremiumList from "@/pages/Admin/PremiumList";
import Coin from "@/pages/Admin/Coin";
import BlogList from "@/pages/Admin/Blog/BlogList";
import BlogAdd from "@/pages/Admin/Blog/BlogAdd";
import BlogEdit from "@/pages/Admin/Blog/BlogEdit";
import CouponList from "@/pages/Admin/Coupon/CouponList";
import CreateAdmin from "@/pages/Admin/Admin/add/CreateAdmin";
import CreateEmployee from "@/pages/Admin/Employee/add/CreateEmployee";
import SingleEmployee from "@/pages/Admin/Employee/SingleEmployee";
import UpdateEmployee from "@/pages/Admin/Employee/add/UpdateEmployee";
import AddCoupon from "@/pages/Admin/Coupon/AddCoupon";
import UpdateCoupon from "@/pages/Admin/Coupon/UpdateCoupon";
import SingleCoupon from "@/pages/Admin/Coupon/SingleCoupon";
import AdminProfile from "@/pages/Admin/AdminProfile";
import PremiumPlan from "@/pages/Admin/PremiumPlan";
import PremiumPlanDetails from "@/pages/Admin/Premium/PremiumPlanDetails";
import PremiumPlanEdit from "@/pages/Admin/Premium/PremiumPlanEdit";
import PaymentCoin from "@/pages/Admin/PaymentCoin";
import PaymentSubscription from "@/pages/Admin/PaymentSubscription";
import ContactReport from "@/pages/Admin/Report/ContactReport";
import EmployeeReport from "@/pages/Admin/Report/EmployeeReport";
import PaymentReport from "@/pages/Admin/Report/PaymentReport";
import OrderReport from "@/pages/Admin/Report/OrderReport";

import EmployeeDashboard from "@/pages/Employee/EmployeeDashboard";
import EmployeeUserList from "@/pages/Employee/User/EmployeeUserList";
import EmployeeSingleUserList from "@/pages/Employee/User/EmployeeSingleUserList";
import EmployeePremiumUserList from "@/pages/Employee/User/EmployeePremiumUserList";
import EmployeeOrderList from "@/pages/Employee/EmployeeOrderList";
import EmployeeBlogList from "@/pages/Employee/EmployeeBlogList";
import EmployeeContactList from "@/pages/Employee/EmployeeContactList";
import EmployeeSingleContact from "@/pages/Employee/Component/EmployeeSingleContact";
import EmployeeProfileEdit from "@/pages/Employee/EmployeeProfileEdit";
import EmployeeCouponList from "@/pages/Employee/EmployeeCouponList";
import EmployeeSingleCouponList from "@/pages/Employee/Component/EmployeeSingleCouponList";
import EmployeePaymentCoin from "@/pages/Employee/EmployeePaymentCoin";
import EmployeePaymentSubscription from "@/pages/Employee/EmployeePaymentSubscription";

export default function AllRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/premiumservices" element={<PremiumServices />} />
        <Route path="/contactus" element={<Contact />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/affiliates" element={<Affiliates />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPage />} />
        <Route path="/unauthorized" element={<UnAuthorized />} />
        <Route path="*" element={<PageNotFound />} />

        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/signup" element={<UserSignUp />} />
        <Route path="/user/forgetpassword" element={<UserForgetPassword />} />
        <Route path="/user/otp" element={<UserOtp />} />
        <Route
          path="/user/resetpassword/:token"
          element={<UserResetPassword />}
        />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgetpassword" element={<AdminForgetPassword />} />
        <Route
          path="/admin/resetpassword/:token"
          element={<AdminResetPassword />}
        />

        <Route path="/employee/login" element={<EmployeeLogin />} />
        <Route
          path="/employee/forgetpassword"
          element={<EmployeeForgetPassword />}
        />
        <Route
          path="/employee/resetpassword/:token"
          element={<EmployeeResetPassword />}
        />
      </Route>

      <Route
        element={
          <PrivateRoute allowedRoles={["USER"]}>
            <UserLayout />
          </PrivateRoute>
        }
      >
        <Route path="/user/dashboard" element={<Dashboard />} />
        <Route path="/user/earn" element={<EarnCoin />} />
        <Route path="/user/premium" element={<Premium />} />
        <Route path="/user/video/:VideoId" element={<Order />} />
        <Route path="/user/buycoins" element={<BuyCoin />} />
        <Route path="/user/buycoins/payment" element={<PaymentStatus />} />
        <Route path="/user/premium_payment" element={<PremiumPayment />} />
        <Route path="/user/paymenthisotry" element={<PaymentHistory />} />
        <Route path="/user/profile" element={<ProfileSetting />} />
      </Route>

      <Route
        element={
          <PrivateRoute allowedRoles={["ADMIN"]}>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/socialmedia" element={<SocialMedia />} />
        <Route path="/admin/admins" element={<AllAdmin />} />
        <Route path="/admin/sigleadmin/:id" element={<SingleAdmin />} />
        <Route path="/admin/admins/add" element={<CreateAdmin />} />
        <Route path="/admin/employees" element={<AllEmployee />} />
        <Route path="/admin/employees/add" element={<CreateEmployee />} />
        <Route path="/admin/employee/edit/:id" element={<UpdateEmployee />} />
        <Route
          path="/admin/employee/details/:id"
          element={<SingleEmployee />}
        />
        <Route path="/admin/users" element={<UserList />} />
        <Route path="/admin/user/:id" element={<SingleUserList />} />
        <Route path="/admin/premium" element={<PremiumList />} />
        <Route path="/admin/premium-plan" element={<PremiumPlan />} />
        <Route
          path="/admin/premium-plan/details/:id"
          element={<PremiumPlanDetails />}
        />
        <Route
          path="/admin/premium-plan/edit/:id"
          element={<PremiumPlanEdit />}
        />
        <Route path="/admin/blogs" element={<BlogList />} />
        <Route path="/admin/blogs/add" element={<BlogAdd />} />
        <Route path="/admin/blogs/edit/:id" element={<BlogEdit />} />
        <Route path="/admin/payment-coin" element={<PaymentCoin />} />
        <Route
          path="/admin/payment-subscription"
          element={<PaymentSubscription />}
        />

        <Route path="/admin/coupons" element={<CouponList />} />
        <Route path="/admin/coupons/add" element={<AddCoupon />} />
        <Route path="/admin/coupon/:id" element={<SingleCoupon />} />
        <Route path="/admin/coupon/update/:id" element={<UpdateCoupon />} />

        <Route path="/admin/report/payment" element={<PaymentReport />} />
        <Route path="/admin/report/order" element={<OrderReport />} />
        <Route
          path="/admin/report/employee-report"
          element={<EmployeeReport />}
        />
        <Route
          path="/admin/report/contact-report"
          element={<ContactReport />}
        />

        <Route path="/admin/settings/coin" element={<Coin />} />
        <Route path="/admin/settings/socialmedia" element={<SocialMedia />} />
        <Route path="/admin/settings/profile" element={<AdminProfile />} />
      </Route>

      <Route
        element={
          <PrivateRoute allowedRoles={["EMPLOYEE"]}>
            <EmployeeLayout />
          </PrivateRoute>
        }
      >
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/user" element={<EmployeeUserList />} />
        <Route path="/employee/user/:id" element={<EmployeeSingleUserList />} />
        <Route path="/employee/premium" element={<EmployeePremiumUserList />} />
        <Route path="/employee/blog" element={<EmployeeBlogList />} />
        <Route path="/employee/coupon" element={<EmployeeCouponList />} />
        <Route path="/employee/coupon/:id" element={<EmployeeSingleCouponList />} />
        <Route path="/employee/order" element={<EmployeeOrderList />} />
        <Route path="/employee/contact" element={<EmployeeContactList />} />
        <Route path="/employee/contact/:id" element={<EmployeeSingleContact />} />
        <Route path="/employee/payment-subscription" element={<EmployeePaymentSubscription />}/>
        <Route path="/employee/payment-coin" element={<EmployeePaymentCoin />} />
        <Route path="/employee/settings/profile" element={<EmployeeProfileEdit />}/>
      </Route>
    </Routes>
  );
}
