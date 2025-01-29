import React, { useEffect, useState } from 'react'
import { apiconnector } from '../services/apiconnector'
import { categories } from '../services/apis'
import { useParams } from 'react-router-dom'
import { getCatalogaPageData } from '../services/operations/pageAndComponentData'
import { useSelector } from 'react-redux'
import Error from './Error'
import CourseSlider from '../components/core/Catalog/CourseSlider'
import Course_Card from '../components/core/Catalog/Course_card'
import Footer from '../components/common/Footer'

const Catalog = () => {

    const [catalogPageData, setCatalogPageData] = useState(null)
    const [categoryId, setCategoryId] = useState("");
    const {catalogName} = useParams()
    const{loading}= useSelector((state)=>state.profile)
    const [active, setActive] = useState(1)

    // Fetch all Categories
    useEffect(()=>{
        const getCategories = async()=>{
            const response = await apiconnector("GET" , categories.CATEGORIES_API)
            const category_id =  response?.data?.data?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id;
            setCategoryId(category_id)
        }
        getCategories();
    },[catalogName])


    useEffect(()=>{
        const getCategoryDetails= async()=>{
            try{
                const response = await getCatalogaPageData(categoryId)
                setCatalogPageData(response);
                console.log(response)

            }
            catch(err){
                console.log(err)
                
            }
        }
        if(categoryId) {
            getCategoryDetails();
        }

    },[categoryId])

    if (loading || !catalogPageData) {
        return (
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="spinner"></div>
          </div>
        )
      }

      if (!loading && !catalogPageData.success) {
        return <Error />
      }


  return (
    <>
     {/* Hero section */}
     <div className=" box-content bg-richblack-800 px-4">
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
            <p className="text-sm text-richblack-300">
              {`Home / Catalog / `} <span className="text-yellow-25">  {catalogPageData?.data?.selectedCategory?.name} </span>
            </p>

            <p className="text-3xl text-richblack-5">
              {catalogPageData?.data?.selectedCategory?.name}
            </p>

            <p className="max-w-[870px] text-richblack-200">
              {catalogPageData?.data?.selectedCategory?.description}
            </p>

        </div>

     </div>

     {/* Section 1 */}
     <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Courses to get you started</div>
        <div className="my-4 flex border-b border-b-richblack-600 text-sm">
            <p onClick={() => setActive(1)} className={`px-4 py-2 ${active===1 ?  "border-b border-b-yellow-25 text-yellow-25"  : "text-richblack-50"} cursor-pointer`}>
                Most Popular
            </p>

            <p onClick={() => setActive(2)} className={`px-4 py-2 ${active===2 ?  "border-b border-b-yellow-25 text-yellow-25"  : "text-richblack-50"} cursor-pointer`}>
                New
            </p>
        </div>

        <div>
            <CourseSlider  Courses={catalogPageData?.data?.selectedCategory?.courses}/>
        </div>
     </div>

     {/* Section 2 */}
     <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">
           Top courses in {catalogPageData?.data?.differentCategory?.name}
        </div>

        <div className="py-8">
            <CourseSlider  Courses={catalogPageData?.data?.differentCategory?.courses}/>
        </div>
     </div>

     {/* Section 3 */}
     <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
       <div className="section_heading">Frequently Bought</div>
       <div className="py-8">
         <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {
                catalogPageData?.data?.mostSellingCourses ?.slice(0, 4) .map((course, i) => (
                    <Course_Card course={course} key={i} Height={"h-[400px]"} />
                ))
            }

         </div>

       </div>

     </div>

     {/* Footer */}
     <Footer/>
    
    </>
  )
}

export default Catalog