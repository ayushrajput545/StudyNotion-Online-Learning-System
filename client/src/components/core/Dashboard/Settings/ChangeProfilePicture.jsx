import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import IconBtn from "../../../common/IconBtn"
import { FiUpload } from "react-icons/fi"
import { updateDisplayPicture } from "../../../../services/operations/SettingsAPI"

const ChangeProfilePicture = () => {
    const { user } = useSelector((state) => state.profile)
    const [previewSource, setPreviewSource] = useState(null)
    const fileInputRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [imageFile, setImageFile] = useState(null)
    const { token } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    const handleClick= ()=>{
        fileInputRef.current.click()
    }

    const handleFileChange=(e)=>{
        const file = e.target.files[0]

        if (file) {
            setImageFile(file)
            previewFile(file)
          }
    }

    const previewFile = (file) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
          setPreviewSource(reader.result)
        }
      }

    const handleFileUpload=()=>{
        try{
            setLoading(true)
            // console.log("TOken is" ,token)
            const formData = new FormData()
            formData.append("displayPicture", imageFile)
            dispatch(updateDisplayPicture(token, formData)).then(() => {
                setLoading(false)
            })
        }
        catch(err){
            console.log("ERROR MESSAGE - ", err.message)
        }
    }

    useEffect(() => {
        if (imageFile) {
          previewFile(imageFile)
        }
        console.log(user)
      }, [imageFile])

  return (
    <>
      <div className="flex  items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 text-richblack-5">
        <div className="flex items-center gap-x-4">

            <img src={previewSource || user?.image}  alt={`profile-${user?.firstName}`} className="aspect-square w-[78px] rounded-full object-cover" />
            
            <div className="space-y-2">
              <p>Change Profile Picture</p>
              <div className="flex flex-col md:flex-row gap-3">

                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/gif, image/jpeg"/>
                <button  disabled={loading} onClick={handleClick} className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50">
                    Select
                </button>

                <IconBtn  text={loading ? "Uploading..." : "Upload"}  onclick={handleFileUpload}>
                    {!loading && (
                        <FiUpload className="text-lg text-richblack-900" />
                    )}
                </IconBtn>

              </div>

            </div>

        </div>

      </div>

    </>
  )
}

export default ChangeProfilePicture