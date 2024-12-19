 
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Navbar from './components/common/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OpenRoute from './components/core/auth/OpenRoute';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';

function App() {
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter ">
        <Navbar/>
        
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<OpenRoute><Login/></OpenRoute> }/>
          <Route path='/signup' element={<OpenRoute><Signup/></OpenRoute>}/>
          <Route path='/forgot-password' element={<OpenRoute><ForgotPassword/></OpenRoute>}/>
          <Route path='/update-password' element={<OpenRoute><UpdatePassword/> </OpenRoute>}/>
          
        </Routes>
      
    </div>
  );
}

export default App;
