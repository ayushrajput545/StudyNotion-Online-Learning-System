import React from 'react'
import ContactDetails from '../components/core/ContactPage/ContactDetails'
import ContactForm from '../components/core/ContactPage/ContactForm'
import Footer from '../components/common/Footer'
import ReviewSlider from '../components/common/ReviewSlider'

const Contact = () => {
  return (
    <div>
        <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">
            {/* Contact Details */}
            <div className="lg:w-[40%]">
                <ContactDetails/>        
            </div>

            <div className="lg:w-[60%]">
                <ContactForm/>
            </div>
        </div>

        <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col  justify-between gap-8 bg-richblack-900 text-white">

           <h1 className="text-4xl text-center font-semibold mt-10">
              Reviews from others
            </h1> 

            <ReviewSlider/>
           
         </div>

        <Footer/>
    </div>
  )
}

export default Contact
