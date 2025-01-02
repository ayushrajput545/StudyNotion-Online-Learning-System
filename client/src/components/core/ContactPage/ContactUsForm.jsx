import React, { useState,useEffect } from 'react'
import {useForm} from 'react-hook-form'
import { apiconnector } from '../../../services/apiconnector';
import { contactusEndpoint } from '../../../services/apis';
import {CountryCode} from '../../../data/countrycode'

const ContactUsForm = () => {
    const[loading , setLoading] = useState();
    const{
        register,
        handleSubmit,
        reset,
        formState:{errors, isSubmitSuccessful}
    } = useForm()

    const submitContactForm=async(data)=>{
        console.log("Loading data",data)
        try{
            setLoading(true)
            const response = await apiconnector("POST" , contactusEndpoint.CONTACT_US_API ,data)
            console.log(response)
            setLoading(false)

        }
        catch(err){
            console.log(err)
            setLoading(false)

        }

    }

    useEffect(()=>{
        if(isSubmitSuccessful){
            reset({
                email:"",
                firstName:"",
                lastName:"",
                message:"",
                phoneNo:""
            })
        }
    },[reset,isSubmitSuccessful])

  return (
    <form  className="flex flex-col gap-7" onSubmit={handleSubmit(submitContactForm)}>
        <div className="flex flex-col gap-5 lg:flex-row">
            {/* FirstName */}
            <div className="flex flex-col gap-2 lg:w-[48%]" >
                <label htmlFor="firstName" className="lable-style">First Name</label>
                <input type="text"  name='firstName' id='firstName' placeholder='Enter first name' {...register("firstName" , {required:true})}  className="form-style"/>
                {
                    errors.firstName && (
                        <span className="-mt-1 text-[12px] text-yellow-100">
                            Please enter your name
                        </span>
                    )
                }

            </div>

            {/* lastName */}
            <div className="flex flex-col gap-2 lg:w-[48%]" >
                <label htmlFor="lastName" className="lable-style">Last Name</label>
                <input type="text"  name='lastName' id='lastName' placeholder='Enter last name(optional)' {...register("lastName")}  className="form-style"/>
            </div>

        </div>

        {/* email */}
        <div className="flex flex-col gap-2" >
                <label htmlFor="email" className="lable-style"> Email Address</label>
                <input type="email"  name='email' id='email' placeholder='Enter your email'  {...register("email" , {required:true})}  className="form-style"/>
                {
                    errors.email && (
                        <span className="-mt-1 text-[12px] text-yellow-100">
                            Please enter your Email address.
                        </span>
                    )
                }

        </div>

        {/* phone number */}
        <div className="flex flex-col gap-2">
            <label htmlFor='phoneNumber' className="lable-style">Phone Number</label>
            <div className="flex gap-5" >
               <div className="flex w-[81px] flex-col gap-2">
                    {/* dropdown */}
              
                    <select  type="text" name="firstName"  id="firstName" {...register("countrycode" , {required:true})}  className="form-style">
                        {
                            CountryCode.map((element,index)=>{
                                return(
                                    <option key={index} value={element.code}>
                                        {element.code} -{element.country}
                                    </option>
                                )
                            })
                        }
                    </select>
                </div>

                <div  className="flex w-[calc(100%-90px)] flex-col gap-2">
    
                    <input type="number" name='phoneNo' id='phoneNumber' placeholder='12345 67890' className='form-style'
                     {...register("phoneNo" ,
                      {required:{value:true , message:"Please Enter Phone Number"} ,
                      maxLength:{value:12 , message:"Invalid Phone Number"}, 
                      minLength:{value:10 , message:"Invalid Phone Number"} })}  />

                 </div>
            
            </div>
            {
                errors.phoneNo &&(
                    <span className="-mt-1 text-[12px] text-yellow-100">
                        {errors.phoneNo.message}
                    </span>
                )
            }
        </div>

        {/* message */}
        <div className="flex flex-col gap-2" >
                <label htmlFor="message" className="lable-style" > Message</label>
                <textarea  className="form-style"  name='message' id='message' placeholder='Enter your message here' cols={30} rows={7} {...register("message" , {required:true})}/>
                {
                    errors.message && (
                        <span className="-mt-1 text-[12px] text-yellow-100">
                            Please enter your message.
                        </span>
                    )
                }

        </div>

        {/* submit button */}
        <button  disabled={loading} type='submit'
         className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
            ${
                !loading &&
                "transition-all duration-200 hover:scale-95 hover:shadow-none"
              }  disabled:bg-richblack-500 sm:text-[16px] `}>

            Send Message
        </button>
        
         



    </form>
  )
}

export default ContactUsForm