import React from 'react'
import Logo1 from '../../../assets/TimelineLogo/Logo1.svg'
import Logo2 from '../../../assets/TimelineLogo/Logo2.svg'
import Logo3 from '../../../assets/TimelineLogo/Logo3.svg'
import Logo4 from '../../../assets/TimelineLogo/Logo4.svg'
import timelineimage from '../../../assets/images/TimelineImage.png'

const TimelineSection = () => {

    const timeLine = [
        {
            Logo:Logo1,
            heading: "Leadership",
            Description: "Fully committed to the success company"
        },

        {
            Logo:Logo2,
            heading: "Leadership",
            Description: "Fully committed to the success company"
        },

        {
            Logo:Logo3,
            heading: "Leadership",
            Description: "Fully committed to the success company"
        },

        {
            Logo:Logo4,
            heading: "Leadership",
            Description: "Fully committed to the success company"
        },
    ]

  return (
    <div>

        <div className='flex flex-col lg:flex-row gap-20 mb-20  items-center'>

          {/* left Part */}
            <div className='lg:w-[45%] flex flex-col gap-14 lg:gap-3'>
                {
                    timeLine.map((element , index)=>{
                        return(
                          <div className="flex flex-col lg:gap-3" key={index}>
                            <div className='flex gap-6' key={index}>

                                 <div className='w-[52px] h-[52px] bg-white flex items-center justify-center rounded-full shadow-[#00000012] shadow-[0_0_62px_0]'>
                                   <img src={element.Logo} alt="" />
                                 </div>

                                <div className='flex flex-col '>
                                    <h2 className='font-semibold text-[18px]'>{element.heading}</h2>
                                    <p className='text-base'>{element.Description}</p>
                                </div>

                            </div>
                            
                            <div
                                className={`hidden ${
                                timeLine.length - 1 === index ? "hidden" : "lg:block"
                                }  h-14 border-dotted border-r border-richblack-100 bg-richblack-400/0 w-[26px]`}
                            ></div>
                            
                          </div>
                        )
                    })
                }
            </div>


            {/* right part */}

            <div className='relative h-fit w-fit shadow-blue-200 shadow-[0px_0px_30px_0px]'>

                <img src={timelineimage} alt="" className="shadow-white shadow-[20px_20px_0px_0px] object-cover h-[400px] lg:h-fit" />

                <div className='absolute bg-caribbeangreen-700 flex flex-col lg:flex-row text-white uppercase py-5 lg:py-10 gap-4 lg:gap-0 lg:left-[50%]  lg:translate-x-[-50%] lg:translate-y-[-50%]'>
                    <div className='flex flex-row gap-5 items-center lg:border-r border-caribbeangreen-300 px-7 lg:px-14'>
                        <p className='text-3xl font-bold w-[75px]'>10</p>
                        <p className='text-caribbeangreen-300 text-sm w-[75px]'>Years of Experience</p>
                    </div>

                    <div className='flex gap-5 items-center px-7 lg:px-14'>
                     <p className='text-3xl font-bold w-[75px] '>250</p>
                     <p className='text-caribbeangreen-300 text-sm w-[75px]'>Types of Courses</p>

                    </div>

                </div>
            </div>



        </div>

    </div>
  )
}

export default TimelineSection