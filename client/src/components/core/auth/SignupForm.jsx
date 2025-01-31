import React from 'react'
import { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import Tab from '../../common/Tab'
import { ACCOUNT_TYPE } from '../../../utils/constants'
import {toast} from 'react-hot-toast'
import {setSignupData} from '../../../slices/authSlice'
import { useDispatch } from 'react-redux'
import { sendOtp } from '../../../services/operations/authAPI'
import { useNavigate } from 'react-router-dom'

 

const SignupForm = () => {

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [accountType , setAccountType] = useState(ACCOUNT_TYPE.STUDENT)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const { firstName, lastName, email, password, confirmPassword } = formData
   // Handle Form Submission
   const handleOnSubmit = (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords Do Not Match")
      return
    }

    if(password.length <4){
      toast.error("Password must have at least 4 digits")
      return
    }
    
    const signupData = {
      ...formData,
      accountType,
    }

    // Setting signup data to state
    // To be used after otp verification
    dispatch(setSignupData(signupData))
    // // Send OTP to user for verification
    dispatch(sendOtp(formData.email, navigate))

    // Reset
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
    setAccountType(ACCOUNT_TYPE.STUDENT)
    console.log(formData)
  }



  



  // data to pass to Tab component
  const tabData =[
    {
        id:1,
        tabName:"Student",
        type:ACCOUNT_TYPE.STUDENT
    },

    {
        id:2,
        tabName:"Instructor",
        type:ACCOUNT_TYPE.INSTRUCTOR
    }
  ]

  return (
    <div>
        {/* Tab */}
        <Tab tabData={tabData} accountType={accountType} setAccountType={setAccountType} />
        <form className="flex w-full flex-col gap-y-4" onSubmit={handleOnSubmit}>

            <div className='flex gap-x-4'>
                <label>
                    <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                        First Name <sup className="text-pink-200">*</sup>
                    </p>

                    <input required type='text' name='firstName' placeholder='Enter first name' value={formData.firstName} onChange={handleOnChange}
                           style={{ boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)"}}
                           className='w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5 outline-none' />
                </label>

                <label>
                    <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                        Last Name <sup className="text-pink-200">*</sup>
                    </p>

                    <input required type='text' name='lastName' placeholder='Enter Last name' value={formData.lastName} onChange={handleOnChange}
                           style={{ boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)"}}
                           className='w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5 outline-none' />
                </label>

            </div>

            <label className='w-full'>
                <p className='mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5'>
                    Email Address <sup className='text-pink-200'>*</sup>
                </p>
    
                <input required type='text' name='email' placeholder='Enter email address' value={formData.email} onChange={handleOnChange}
                        style={{ boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)"}}
                    className='w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5 outline-none' >          
                </input>
            </label>

            <div className='flex gap-x-4'>

                <label className='relative'>
                    <p className='mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5'>
                        Create Password <sup className="text-pink-200">*</sup>
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

                </label>

                <label className='relative'>
                    <p className='mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5'>
                        Confirm Password <sup className="text-pink-200">*</sup>
                    </p>

                    <input required type={showConfirmPassword?"text":"password"} name='confirmPassword' placeholder='Confirm password' value={formData.confirmPassword} onChange={handleOnChange}
                           style={{ boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)"}}
                           className='w-full rounded-[0.5rem] bg-richblack-700 p-[12px] text-richblack-5 outline-none' >  
                   </input>

                   <span  onClick={() => setShowConfirmPassword((prev) => !prev)} className='absolute right-3 top-[38px] z-[10] cursor-pointer'>
                        {
                         showPassword?  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" /> : <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                        }
                    </span>

                </label>

            </div>

            <button type="submit"className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900">
              Create Account
            </button>

            <div className='text-white text-center'>
               Already have an account ? 
               <span onClick={()=>navigate('/login')} className='text-blue-100 cursor-pointer'> Login here</span>
            </div>

        </form>
    </div>
  )
}

export default SignupForm