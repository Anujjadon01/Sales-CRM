import './App.css'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"

import Login from './componants/Login'
import Register from './componants/Register'
import Dashboard from './componants/Dashboard'
import ContactP from './componants/Contact'

import Setting from './componants/Setting'
import Layout from './componants/Layout'

import ProtectedRoute from './Routes/ProtectedRoutes'
import AuthRoute from './Routes/AuthRoute'
import Pipeline from './componants/Pipeline'
import "./index.css"
import { useAuth } from './context/AuthContext'
import Home from './componants/Home'
function App() {
 const { loading } = useAuth();

  // 🔴 CRITICAL: block rendering until auth is resolved
 


  return (
    <>
      <ToastContainer />

      <Routes>
        {/* 🔁 AUTH ROUTES (BLOCK IF LOGGED IN) */}
        <Route
          path="/"
          element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          }
        />

        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />

        {/* 🔐 PROTECTED ROUTES */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={
            <ProtectedRoute role="admin">
             <Dashboard />
            </ProtectedRoute>
            } />
          <Route path="/contact" element={<ContactP />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/setting" element={<Setting />} />
          
          <Route path="/home" element={
            <ProtectedRoute role="user">
              <Home />
            </ProtectedRoute>
            } />
        </Route>
      </Routes>
    </>
  )
}

export default App
