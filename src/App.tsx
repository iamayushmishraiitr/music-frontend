import { Toaster } from 'react-hot-toast';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Space from './pages/Space';
import { useSelector } from 'react-redux';
import { getToken } from './Redux/Slice/token';

function App() {
  const token = useSelector(getToken) ;
  return (
    <>
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/dashboard" /> : <Signin />}
        />
        <Route
          path="/signup"
          element={token ? <Navigate to="/dashboard" /> : <Signup />}
        />

        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/spaces/:id"
          element={token ? <Space /> : <Navigate to="/" />}
        />

        <Route
          path="*"
          element={<Navigate to={token ? "/dashboard" : "/"} />}
        />
      </Routes>
    </>
  );
}

export default App;
