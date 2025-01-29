import React from 'react'
import {Swiper ,SwiperSlide} from 'swiper/react'
import Course_Card from './Course_card'
import {Autoplay,FreeMode,Navigation, Pagination} from 'swiper/modules'
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"

const CourseSlider = ({Courses}) => {
  return (
    <>
      {
        Courses?.length ? 
        (
            <Swiper autoplay={{delay:2500, disableOnInteraction: false}} slidesPerView={1} spaceBetween={25}  loop={true} modules={[Autoplay,FreeMode,Pagination]}  breakpoints={{ 1024: { slidesPerView: 3,  }, }} className="max-h-[30rem]">
                {
                    Courses.map((course,i)=>(
                        <SwiperSlide key={i}>
                            <Course_Card  course={course} Height={"h-[250px]"}/>
                        </SwiperSlide>

                    ))
                }
                
            
            </Swiper>

        )
        :
        (
            <p className="text-xl text-richblack-5">No Course Found</p>
        )
      }

    </>
  )
}

export default CourseSlider