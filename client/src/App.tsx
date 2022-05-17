import { Routes, Route, Navigate } from "react-router-dom";

import { Login } from "./pages/Login";
import useAuth from "./hooks/useAuth";
import { useEffect, useState } from "react";
import axios from "./api/axios";
import { ACTIONS } from "./providers/AuthProvider";
import { Loader } from "@mantine/core";
import { NavbarLayout } from "./components/NavbarLayout";
import { Register } from "./pages/Register";
import { Main } from "./pages/Main";

function App() {
  const { state: auth, dispatch } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/auth/me");
        if (response?.status === 200 && response?.data?.status) {
          dispatch({ type: ACTIONS.USER_LOGGED_IN, payload: response?.data?.data });
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  return loading ? (
    <div className='flex items-center justify-center w-screen h-screen'>
      <Loader />
    </div>
  ) : (
    <Routes>
      {/* Protected routes with Navbar */}
      {auth?.isAuthenticated === true ? (
        <Route path='/' element={<NavbarLayout />}>
          <Route path='/' element={<Main />} />
          <Route path='*' element={<Navigate to='/' />} />
        </Route>
      ) : (
        <>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='*' element={<Navigate to='/login' />} />
        </>
      )}
    </Routes>
  );
}

export default App;
