import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/core/Dashboard/Sidebar'
import { CgMenuLeftAlt } from "react-icons/cg";
import {AiOutlineClose } from "react-icons/ai";
import useOnClickOutside from '../hooks/useOnClickOutside';
import { useRef } from 'react';


const Dashboard = () => {
    const{loading:authLoading} = useSelector((state)=>state.auth)
    const{loading:profileLoading} = useSelector((state)=>state.profile)
    const ref = useRef(null)

    const[showMobileMenu , setShowMobileMenu] = useState(false)

    useOnClickOutside(ref, () => setShowMobileMenu(false))  //if we click outside the ref={ref} div then it become false

    if(authLoading || profileLoading){
        return(
            <div className='mt-10'>
                Loading.... 
            </div>
        )
    }

     



  return (
    <div className='relative flex min-h-[calc(100vh-3.5rem)]'>
 

        <div className='hidden md:block'>
            <Sidebar setShowMobileMenu={setShowMobileMenu}/>
        </div>

        {/* Handle sidebar menu for mobiles screens */}
      <div ref={ref}>
            {
                showMobileMenu && (
                    <div  className='absolute md:hidden block z-[2] '>
                        <Sidebar  setShowMobileMenu={setShowMobileMenu}/>
                    </div>
                )
            }



            <div   className='absolute z-[2] block md:hidden text-4xl text-richblack-50 mt-2 ml-2'>
                {
                    showMobileMenu ? <AiOutlineClose className='text-3xl' onClick={()=>setShowMobileMenu(false)} /> : <CgMenuLeftAlt onClick={()=>setShowMobileMenu(true)}/>
                }      
           </div>
           
        </div>
         
        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-x-hidden overflow-y-auto">
            <div className="mx-auto w-11/12 max-w-[1000px] py-10 mt-5">
                <Outlet/>
            </div>
        </div>

    </div>
  )
}

export default Dashboard