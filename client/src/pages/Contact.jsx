import React from 'react'
import ContactDetails from '../components/core/ContactPage/ContactDetails'
import ContactForm from '../components/core/ContactPage/ContactForm'
import Footer from '../components/common/Footer'

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

        {/* <div> */}
            {/* Reviews from others */}
        {/* </div> */}

        <Footer/>
    </div>
  )
}

export default Contact
