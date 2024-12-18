import React from 'react'
import { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { Link } from 'react-router-dom'

const LoginForm = () => {

  const [showPassword, setShowPassword] = useState(false)
  const[formData , setFormData] = useState({email:"" , password:""})

  function handleOnChange(e){
    setFormData((prevData)=>({
        ...prevData,
        [e.target.name]: e.target.value
    }))
  }

  function handleOnSubmit(e){
    e.preventDefault()
    console.log(formData)
  }

  return (
    <form  onSubmit={handleOnSubmit} className='mt-6 flex w-full flex-col gap-y-4'>
        
        <label className='w-full'>
            <p className='mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5'>
                Email Address <sup className='text-pink-200'>*</sup>
            </p>
  
            <input required type='text' name='email' placeholder='Enter email address' value={formData.email} onChange={handleOnChange}
                    style={{ boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)"}}
                className='w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5 outline-none' >          
            </input>
        </label>

        <label className='relative'>
            <p className='mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5'>
                Password <sup className='text-pink-200'>*</sup>
            </p>

            <input required type={showPassword?"text":"password"} name='password' placeholder='Enter password' value={formData.password} onChange={handleOnChange}
                  style={{ boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)"}}
                  className='w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5 outline-none' >  
            </input>

            <span  onClick={() => setShowPassword((prev) => !prev)} className='absolute right-3 top-[38px] z-[10] cursor-pointer'>
                {
                    showPassword?  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" /> : <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                }
            </span>

            <Link to='/forgot-password'>
               <p className="mt-1 ml-auto max-w-max text-xs text-blue-100">Forgot Password</p>      
            </Link>

        </label>

        <button type="submit"className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900">
           Sign In
        </button>

    </form>

    
  )
}

export default LoginForm