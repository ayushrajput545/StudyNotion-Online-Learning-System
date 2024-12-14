import React from 'react'
import HighlightText from './HighlightText'
import know_your_progress from '../../../assets/images/Know_your_progress.png'
import compare_with_others from '../../../assets/images/Compare_with_others.png'
import plan_your_lesson from '../../../assets/images/Plan_your_lessons.png'
import CTAButton from './Button'

const LearningLanguageSection = () => {
  return (
  <div className='mt-[150px] '>
    <div className='flex flex-col gap-5 items-center'>

        <div className='text-4xl font-semibold text-center'>
            Your swiss knife for 
            <HighlightText text={' learning any language'}/>
        </div>

        <div className='text-center text-richblack-600 mx-auto text-base w-[70%] font-medium'>
          Using spin making learning multiple languages easy. with 20+ languages realistic voice-over,
          progress tracking, custom schedule and more.
        </div>

        <div className='flex flex-col lg:flex-row items-center justify-center mt-8 lg:mt-0'>

          <img src={know_your_progress} alt="" className='object-contain lg:-mr-32'/>
          <img src={compare_with_others} alt="" className='object-contain lg:-mb-10 lg:-mt-0 -mt-12' />
          <img src={plan_your_lesson} alt="" className='object-contain lg:-ml-36 lg:-mt-5 -mt-16' />
          
        </div>

        <div className='w-fit mx-auto lg:mb-20 mb-8 -mt-5'>
          <CTAButton active={true} linkto={'/signup'}>
             Learn More
          </CTAButton>
        </div>

    </div>
  </div>
  )
}

export default LearningLanguageSection