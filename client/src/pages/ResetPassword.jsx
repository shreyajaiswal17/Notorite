import React, { useState } from "react";
import { setUserData } from "../Redux/slices/user-slice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useAxios } from "../hooks/useAxios";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const axios = useAxios();

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const loginUser = async (e) => {
    try {
      e.preventDefault();
      console.log("LogIn button Clicked");
      const user = {
        userEmail,
        userPassword,
      };
      const result = await axios.post('/auth/login', user);
      if(result.data.status==="Error") {
        toast.error("wrong credentials");
        console.log("Error while Log in !!")
      } else{
        toast.success("User Logged in Successfully!");
        console.log("User Logged in Successfully: ", result);
        dispatch(setUserData(result.data));
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      toast.error("Login failed!");
      console.log("Cannot log in the user: ", error);
    }
  };

  const handleForgotPassword = async () => {
    try {
      const result = await axios.post('/auth/forgot-password', { email: forgotEmail });
      if (result.data.status === "Ok") {
        toast.success("Password reset email sent!");
        setShowForgotPasswordModal(false);
      } else {
        toast.error("Error sending reset email.");
      }
    } catch (error) {
      toast.error("Failed to send reset email.");
      console.log("Error in forgot password: ", error);
    }
  };

  return (
    <div className="h-heightWithoutNavbar flex w-full items-center justify-center p-5 bg-gray-100 dark:bg-stone-800">
      <form
        className="flex w-full max-w-[420px] flex-col gap-4 rounded-xl bg-gray-200 dark:bg-stone-700 p-5 shadow-xl"
        onSubmit={loginUser}
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Login</h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-start justify-center">
            <label className="font-bold text-gray-900 dark:text-white" htmlFor="userEmail">Email</label>
            <input
              type="email"
              id="userEmail"
              name="userEmail"
              className="w-full rounded-lg border border-gray-400 bg-gray-100 dark:bg-stone-700 p-2 focus:ring focus:ring-blue-500 text-gray-900 dark:text-gray-200"
              placeholder="your.email@example.com"
              onChange={(e) => setUserEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col items-start justify-center">
            <label className="font-bold text-gray-900 dark:text-white" htmlFor="userPassword">Password</label>
            <input
              type="password"
              id="userPassword"
              name="userPassword"
              className="w-full rounded-lg border border-gray-400 bg-gray-100 dark:bg-stone-700 p-2 focus:ring focus:ring-blue-500 text-gray-900 dark:text-gray-200"
              placeholder="*********"
              onChange={(e) => setUserPassword(e.target.value)}
            />
          </div>
          <Link to="#" onClick={() => setShowForgotPasswordModal(true)}>
            <p className="text-gray-600 dark:text-gray-300 hover:underline">Forgot Password?</p>
          </Link>
        </div>
        <button className="rounded-lg bg-blue-500 px-5 py-2 font-bold text-white hover:bg-blue-600" type="submit">
          Log In
        </button>
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <p className="">New to Notorite?</p>
          <Link to="/signup">
            <p className="font-bold hover:underline">Create an account</p>
          </Link>
        </div>
      </form>

      {showForgotPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-3">Forgot Password</h2>
            <input
              type="email"
              className="w-full border border-gray-300 p-2 rounded mb-3"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button className="rounded-lg bg-gray-500 text-white px-4 py-2" onClick={() => setShowForgotPasswordModal(false)}>Cancel</button>
              <button className="rounded-lg bg-blue-500 px-5 py-2 text-white hover:bg-blue-600" onClick={handleForgotPassword}>Send Reset Link</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Login;