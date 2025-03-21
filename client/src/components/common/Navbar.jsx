import React, { useEffect, useState } from 'react'
import Logo from '../../assets/Logo/Logo-Full-Light.png'
import { Link , matchPath } from 'react-router-dom'
import {NavbarLinks} from '../../data/navbar-links'
import { useLocation } from 'react-router-dom'
import {useSelector} from 'react-redux'
import {AiOutlineMenu, AiOutlineShoppingCart,AiOutlineClose } from "react-icons/ai";
import ProfileDropDown from '../core/auth/ProfileDropDown'
import { apiconnector } from '../../services/apiconnector'
import { categories } from '../../services/apis'
import { IoIosArrowDown } from "react-icons/io";
import { ACCOUNT_TYPE } from "../../utils/constants"
import ShowNavLinksModal from './ShowNavLinksModal'
 


const Navbar = () => {

    const location = useLocation();
    const matchRoute= (route)=>{
        return matchPath({path:route}, location.pathname);
    }
    const {token} = useSelector((state)=>state.auth);
    const{user} = useSelector((state)=>state.profile);
    const{totalItems} = useSelector((state)=>state.cart);
    const[subLinks , setSubLinks] = useState([]);
    const [loading, setLoading] = useState(false)
    
    const [showLinks , setShowLinks] = useState(false);
    const [showNavbarLinksModal , setShowNavbarLinksModal] = useState(false)

    const fetchSubLinks =  async()=>{
        try{
            setLoading(true)
            const response =await apiconnector("GET" , categories.CATEGORIES_API)
            console.log(response);
            setSubLinks(response.data.data)
        }
        catch(err){
            
            console.log(" Sorry! Could not fetch Categories.", err)
        }
            setLoading(false)
    }

    useEffect(()=>{
        fetchSubLinks();
    },[])


  return (
    <div className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${ location.pathname !== "/" ? "bg-richblack-800" : ""} transition-all duration-200`}>
        <div className='w-11/12 max-w-maxContent flex items-center justify-between'>

            {/* StudyNotion Logo */}
            <Link to='/'>
               <img src={Logo} alt="Logo" width={160} height={32} loading='lazy'/>           
            </Link>

            {/* NavLinks */}
            <nav className={`hidden md:flex`}>
                <ul className='flex gap-x-6 text-richblack-25'>
                    {
                        NavbarLinks.map((link, index)=>(
                            <li key={index}>
                                {
                                    link.title==='Catalog'?
                                        (
                                            <> 
                                            <div className={`relative flex items-center cursor-pointer gap-1 group ${ matchRoute("/catalog/:catalogName") ? "text-yellow-25":"text-richblack-25"} `}>
                                                {link.title}
                                                <IoIosArrowDown />

                                                <div className='invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5
                                                                p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px] '>
                                                    <div className='absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5  '>
                                                    </div>
                                                    {
                                                        loading ?
                                                        (
                                                            <p className='text-center'>Loading...</p>
                                                        )
                                                        :
                                                        (subLinks && subLinks.length) ?
                                                        (
                                                        <>
                                                            {
                                                                // subLinks?.filter((subLink)=>subLink?.courses?.length>0)?.map((subLink,index)=>(
                                                                    // encodeURIComponent("AI/ML") → converts it to "AI%2FML" instead of "ai/ml", making it a valid URL segment.
                                                                     subLinks.map((subLink,index)=>( 
                                                                        <Link    to={`/catalog/${encodeURIComponent(subLink.name.split(" ").join("-").toLowerCase())}`}   className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"  key={index}>
                                                                           <p>{subLink.name}</p>   
                                                                        </Link>
                                                                     ))
                                                                    
                                                                // ))
                                                            }
                                                        
                                                        </>
                                                        )
                                                        :
                                                        (
                                                          <p className="text-center">No Courses Found</p>
                                                        )
                                                    }
                                                </div>
                                            </div> 
                                          </>
                                        ):
                                        (
                                           <Link to={link?.path}>
                                               <p className={`${matchRoute(link?.path)? "text-yellow-25" : "text-richblack-25"}`}>{link.title}</p>
                                            </Link>
                                        )
                                }
                            </li>
                        ))
                    }
                </ul>
            </nav>

            {/* login/signup/dashboard */}
            <div className='hidden md:flex gap-x-4 items-center'>

                {
                    user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR &&(
                        <Link to='/dashboard/cart' className='relative'>
                            <AiOutlineShoppingCart className="text-2xl text-richblack-100"/>
                                {
                                    totalItems >0 &&(
                                        <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                                            {totalItems}
                                        </span>
                                    )
                                }                    
                        </Link>
                    )
                }

                {
                    token === null && (
                        <Link to='/login'>
                            <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                Log in
                            </button>                   
                        </Link>
                    )
                }

                {
                    token === null && (
                        <Link to='/signup'>
                            <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                Sign up
                            </button>                   
                        </Link>
                    )
                }

                {
                    token !== null && <ProfileDropDown/>
                }
                
            </div>





           {/* Mobile menu Button */}
            <button onClick={()=>{
                 setShowLinks(!showLinks)
                 setShowNavbarLinksModal(!showNavbarLinksModal)

             }} className="mr-4 md:hidden z-[100000] ">
                {
                    showLinks ?  <AiOutlineClose fontSize={24} fill="#AFB2BF" /> : <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
                }  
            </button>   
        </div>

        {/* Mobile menu */}
        {
            showLinks &&(
                <div className="z-[10000] absolute top-14 left-0 w-full   md:hidden flex flex-col items-center py-4 space-y-4">

                    <ul className="flex flex-col items-center gap-y-4 text-richblack-25">

                        {
                             NavbarLinks.map((link, index)=>(
                                <li key={index}>
                                    {
                                        link.title==='Catalog'?
                                            (
                                                <> 
                                                <div className={`relative flex items-center cursor-pointer gap-1 group ${ matchRoute("/catalog/:catalogName") ? "text-yellow-25":"text-richblack-25"} `}>
                                                    <p className='text-xl font-bold'> {link.title}</p>
                                                    <IoIosArrowDown />
    
                                                    <div className='invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5
                                                                    p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px] '>
                                                        <div className='absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5  '>
                                                        </div>
                                                        {
                                                            loading ?
                                                            (
                                                                <p className='text-center'>Loading...</p>
                                                            )
                                                            :
                                                            (subLinks && subLinks.length) ?
                                                            (
                                                            <>
                                                                {
                                                                    // subLinks?.filter((subLink)=>subLink?.courses?.length>0)?.map((subLink,index)=>(
                                                                         subLinks.map((subLink,index)=>( 
                                                                            <Link   to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"  key={index}>
                                                                               <p onClick={()=>{setShowLinks(false) 
                                                                                              setShowNavbarLinksModal(false) }}>{subLink.name}</p>   
                                                                            </Link>
                                                                         ))
                                                                        
                                                                    // ))
                                                                }
                                                            
                                                            </>
                                                            )
                                                            :
                                                            (
                                                              <p className="text-center">No Courses Found</p>
                                                            )
                                                        }
                                                    </div>
                                                </div> 
                                              </>
                                            ):
                                            (
                                               <Link to={link?.path} onClick={()=>{setShowLinks(false)
                                                setShowNavbarLinksModal(false)}} className='font-bold text-xl'>
                                                   <p className={`${matchRoute(link?.path)? "text-yellow-25" : "text-richblack-25"}`}>{link.title}</p>
                                                </Link>
                                            )
                                    }
                                </li>
                            ))
                        }

                    </ul>

                </div>

            )
        }

        {
            showNavbarLinksModal && (
                <ShowNavLinksModal/>
            )
        }

         
         

       

    </div>
  )
}

export default Navbar