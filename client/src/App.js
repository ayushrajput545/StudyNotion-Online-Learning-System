import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Navbar from './components/common/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OpenRoute from './components/core/auth/OpenRoute';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import VerifyEmail from './pages/VerifyEmail';
import About from './pages/About';
import MyProfile from './components/core/Dashboard/MyProfile';
import Contact from './pages/Contact';
import PrivateRoute from './components/core/auth/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Settings from './components/core/Dashboard/Settings/Settings';

function App() {
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter ">
        <Navbar/>
        
        <Routes>
          
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<OpenRoute><Login/></OpenRoute> }/>
          <Route path='/signup' element={<OpenRoute><Signup/></OpenRoute>}/>
          <Route path='/forgot-password' element={<OpenRoute><ForgotPassword/></OpenRoute>}/>
          <Route path='/update-password/:id' element={<OpenRoute><UpdatePassword/> </OpenRoute>}/>
          <Route path='/verify-email' element={<OpenRoute><VerifyEmail/></OpenRoute> }/>
          <Route path='/about' element={<About/>}/>
          <Route path='/contact' element={<Contact/>}/>

          <Route element={<PrivateRoute><Dashboard/></PrivateRoute>}>
            <Route path ='/dashboard/my-profile' element={<MyProfile/>}/>
            <Route path='/dashboard/settings' element={<Settings/>}/>
            
             

          </Route>

          
          
        </Routes>
      
    </div>
  );
}

export default App;
