import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
    InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import {showSuccessToast, showErrorToast} from '@/lib/toastUtils';

export default function Otp() {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        if (otp.length !== 6) {
            showErrorToast("Please enter the 6-digit OTP.");
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/verifyOtp`, {
                email,
                otp,
            });

            
            if (response.status === 200) {
                showSuccessToast("OTP verified!");
                setTimeout(() => {
                    navigate('/user/login');
                }, 2000);
            }
        } catch (error) {
            showErrorToast(error.response.data.message || error);
        }
    };


    if(!email){
        navigate('/user/login');
    }

    return (
        <section className="my-15 flex items-center justify-center bg-gray-100 py-10">
            <Toaster richColors position="top-center" />
            <motion.form
                onSubmit={handleVerifyOtp}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 flex flex-col justify-center items-center rounded-lg shadow-[0px_0px_40px_8px_rgb(255,205,205)] w-full max-w-md space-y-6"

            >
                <h1 className="text-2xl font-bold text-gray-800 text-center">Verify OTP</h1>
                <p className="text-gray-600 text-center text-sm">
                    Enter the 6-digit OTP sent to <strong>{email}</strong>
                </p>

                <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    className="flex justify-center"
                >
                    <InputOTPGroup className="flex gap-2">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSeparator />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
                <Button
                    type="submit"
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2"
                >
                    Verify OTP
                </Button>
            </motion.form>
        </section>
    );
}
