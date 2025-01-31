import React, { useEffect, useState } from 'react'
import VideoDetailsSidebar from '../components/core/ViewCourse/VideoDetailsSidebar'
import { Outlet, useParams } from 'react-router-dom'
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal'
import { useDispatch, useSelector } from "react-redux"
import { getFullDetailsOfCourse } from '../services/operations/courseDetailsAPI'
import {
    setCompletedLectures,
    setCourseSectionData,
    setEntireCourseData,
    setTotalNoOfLectures,
  } from "../slices/viewCourseSlice"

  import { RiFolderVideoLine } from "react-icons/ri";
import {AiOutlineClose } from "react-icons/ai";
import useOnClickOutside from '../hooks/useOnClickOutside';
import { useRef } from 'react';
 


const ViewCourse = () => {
    const [reviewModal, setReviewModal] = useState(false)
    const { courseId } = useParams()
    const { token } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const[showMobileMenu , setShowMobileMenu] = useState(false)
    const ref = useRef(null)

    useOnClickOutside(ref, () => setShowMobileMenu(false))

    useEffect(()=>{
        ;(async()=>{
            const courseData = await getFullDetailsOfCourse(courseId, token)
            console.log(courseData)
            dispatch(setCourseSectionData(courseData.courseDetails.courseContent))
            dispatch(setEntireCourseData(courseData.courseDetails))
            dispatch(setCompletedLectures(courseData.completedVideos))
            let lectures = 0
            courseData?.courseDetails?.courseContent?.forEach((sec) => {
                lectures += sec.subSection.length
              })
            
            dispatch(setTotalNoOfLectures(lectures))
        })()
    },[])

  return (
    <>
      <div className="relative flex min-h-[calc(100vh-3.5rem)]">

           <div className='hidden md:block'>
              <VideoDetailsSidebar setShowMobileMenu={setShowMobileMenu} setReviewModal={setReviewModal}/>
           </div>
            

            {/* For mobile Screens */}

            <div ref={ref}>
                {
                  showMobileMenu && (
                      <div className='absolute z-[2] block md:hidden'>
                        <VideoDetailsSidebar setShowMobileMenu={setShowMobileMenu} setReviewModal={setReviewModal}/>    
                      </div>
                  )

                }

                <div   className='absolute z-[2] block md:hidden text-4xl text-richblack-50 mt-2 ml-2'>
                    {
                        showMobileMenu ? <AiOutlineClose className='text-3xl' onClick={()=>setShowMobileMenu(false)} /> : <RiFolderVideoLine  onClick={()=>setShowMobileMenu(true)}/>
                    }      
                </div>

            </div>

            
           


            <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                <div className="mx-6 mt-16">
                    <Outlet/>
                </div>
            </div>
      </div>

        {
            reviewModal &&(
                <CourseReviewModal setReviewModal={setReviewModal}/>
            )
        }
    
    </>
  )
}

export default ViewCourse