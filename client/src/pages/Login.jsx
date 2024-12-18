import React from 'react'
import loginImg from '../assets/images/login.webp'
import Template from '../components/core/auth/Template'

const Login = () => {
  return (
         
    <Template 
      title="Welcome back"
      description1="Build Skills for today, tomorrow, and beyond. "
      description2="Education to future-proof your career."
      image={loginImg}
      formType="login"    
    />
      
  )
}

export default Login