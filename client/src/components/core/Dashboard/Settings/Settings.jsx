import React from 'react'
import ChangeProfilePicture from './ChangeProfilePicture'
import EditProfile from './EditProfile'
import UpdatePassword from './UpdatePassword'
import DeleteAccount from './DeleteAccount'


const Settings = () => {
  return (
    <>
     <h1 className="mb-14 text-3xl font-medium text-richblack-5">
       Edit Profile
     </h1>

     {/* Change Profile Picture */}
     <ChangeProfilePicture/>

     {/* Profile */}
     <EditProfile/>

     {/* Password */}
     <UpdatePassword/>

     {/* DeleteAccount */}
     <DeleteAccount/>
      
    </>
  )
}

export default Settings