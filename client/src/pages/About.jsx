import React from 'react'
import HighlightText from '../components/core/HomePage/HighlightText'
import aboutus1 from '../assets/images/aboutus1.webp'
import aboutus2 from '../assets/images/aboutus2.webp'
import aboutus3 from '../assets/images/aboutus3.webp'
import Quote from '../components/core/AboutPage/Quote'

const About = () => {
  return (
    <div>
        {/* Section 1 */}
        <section>
            <div className='mt-8 text-white'>

                <header>
                    Driving Innovation in Online Education for a 
                    <HighlightText text={"Brighter Future"}/>
                    <p>
                        Studynotion is at the forefront of driving innovation in online
                        education. We're passionate about creating a brighter future by
                        offering cutting-edge courses, leveraging emerging technologies,
                        and nurturing a vibrant learning community.
                    </p>
                </header>

                <div className='flex gap-x-4'>
                    <img src={aboutus1} alt="" />
                    <img src={aboutus2} alt="" />
                    <img src={aboutus3} alt="" />
                </div>
            </div>
        </section>

        {/* Section 2  */}
        <section>
            <div>
                <Quote/>
            </div>
        </section>
    </div>
  )
}

export default About