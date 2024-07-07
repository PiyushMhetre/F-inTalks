import { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";


function ForgotPassword() {
  const { register, handleSubmit } = useForm();
  const [step, setStep] = useState(1); // 1: email input, 2: OTP verification, 3: new password input
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const handleEmailSubmit = async (data) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_BASE_ROUTE}/forgotPassword`,
        { email: data.email }
      );
      setEmail(data.email);
      setStep(2);
      toast.success('OTP sent to your email');
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('Failed to send OTP');
    }
  };

  const handleOtpSubmit = async (data) => {
    if (data.otp === otp) {
      setStep(3);
      toast.success('OTP verified');
    } else {
      toast.error('Invalid OTP');
    }
  };

  const handleNewPasswordSubmit = async (data) => {
    try {
       await axios.put(
        `${process.env.REACT_APP_BASE_ROUTE}/resetPassword`,
        { email, password: data.password }
      );
      toast.success('Password updated successfully');
      //setStep(1);
      navigate("/")
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Failed to reset password');
    }
  };

  return (
    <div className="flex flex-col items-center mt-3 mx-[10%] laptop:mx-[20%] w-[80%] laptop:w-[60%] text-sm bg-white p-6 rounded-lg shadow-md">
    <Toaster/>
      {step === 1 && (
        <form
          onSubmit={handleSubmit(handleEmailSubmit)}
          className="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-md w-full"
        >
          <label className="self-start mb-2 text-gray-700 font-semibold">Email</label>
          <input
            type="email"
            {...register('email')}
            placeholder="Enter your email"
            className="mb-2 p-2 w-full border rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 mt-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          >
            Send OTP
          </button>
        </form>
      )}
      {step === 2 && (
        <form
          onSubmit={handleSubmit(handleOtpSubmit)}
          className="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-md w-full"
        >
          <label className="self-start mb-2 text-gray-700 font-semibold">OTP</label>
          <input
            type="text"
            {...register('otp')}
            placeholder="Enter OTP"
            className="mb-2 p-2 w-full border rounded-lg focus:outline-none focus:border-blue-500"
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 mt-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          >
            Verify OTP
          </button>
        </form>
      )}
      {step === 3 && (
        <form
          onSubmit={handleSubmit(handleNewPasswordSubmit)}
          className="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-md w-full"
        >
          <label className="self-start mb-2 text-gray-700 font-semibold">New Password</label>
          <input
            type="password"
            {...register('password')}
            placeholder="Enter new password"
            className="mb-2 p-2 w-full border rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 mt-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          >
            Reset Password
          </button>
        </form>
      )}
    </div>
  );
}

export default ForgotPassword;
