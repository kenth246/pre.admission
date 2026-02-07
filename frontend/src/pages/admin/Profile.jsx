import { useState, useRef } from "react";
import Header from "../../components/Header";
import { Mail, Briefcase, User, X, Camera, ArrowLeft } from "lucide-react"; 

export default function Profile() {
  // State for profile information
  const [profile, setProfile] = useState({
    name: "IITIAdmin", 
    email: "admin.iiti@gmail.com", 
    position: "Administrator",
    roleDisplay: "Admin",
  });

  // State for Profile Picture
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  // Toggle states
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // NEW: State to toggle between "Update Password" and "Forgot Password" modes
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);

  // Temporary state for editing inputs
  const [tempProfile, setTempProfile] = useState(profile);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempProfile({ ...tempProfile, [name]: value });
  };

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  // Save Profile Changes
  const handleSaveProfile = () => {
    setProfile(tempProfile);
    setIsEditing(false);
    console.log("Saved profile:", tempProfile);
  };

  // Cancel Editing
  const handleCancelEdit = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  // --- CHANGE PASSWORD LOGIC ---
  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      return alert("New passwords do not match!");
    }

    try {
      await api.put('/admin/change-password', {
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      alert("Password changed successfully!");
      closePasswordModal();
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to change password.");
    }
  };

  const closePasswordModal = () => {
    setIsChangingPassword(false);
    setIsForgotPasswordMode(false); // Reset to default view
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Header username={profile.roleDisplay} />

      <main className="max-w-6xl mx-auto p-6">
        {/* Profile Card Container */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
          
          {/* Green Header Section */}
          <div className="bg-green-600 p-8 flex items-center gap-6">
            
            {/* Avatar Upload Section */}
            <div className="relative group">
              <div 
                onClick={() => fileInputRef.current.click()}
                className="bg-white p-1 rounded-2xl h-24 w-24 flex items-center justify-center shrink-0 cursor-pointer overflow-hidden transition-transform hover:scale-105"
              >
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="h-full w-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="bg-green-600 h-full w-full rounded-lg flex items-center justify-center text-white">
                    <User size={48} fill="currentColor" />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/30 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <Camera className="text-white" size={24} />
                </div>
              </div>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
              />
            </div>

            <div className="text-white">
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              <p className="text-green-100 text-lg opacity-90">{profile.position}</p>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Account Information Section */}
            <div>
              <h2 className="text-green-700 text-xl font-bold border-b-2 border-gray-400 pb-2 mb-6">
                Account Information
              </h2>

              <div className="space-y-6">
                <InfoItem 
                  icon={<User size={24} className="text-gray-500" />} 
                  label="Username"
                  value={profile.name}
                  isEditing={isEditing}
                  name="name"
                  onChange={handleInputChange}
                />

                <InfoItem 
                  icon={<Mail size={24} className="text-gray-500" />}
                  label="Email Address"
                  value={profile.email}
                  isEditing={isEditing}
                  name="email"
                  onChange={handleInputChange}
                />

                <InfoItem 
                  icon={<Briefcase size={24} className="text-gray-500" />} 
                  label="Position"
                  value={tempProfile.position}
                  isEditing={false} // Position usually not editable by admin themselves
                  name="position"
                  onChange={handleInputChange}
                />
              </div>

              <div className="mt-8">
                {isEditing ? (
                  <div className="flex gap-3">
                    <button 
                      onClick={handleSaveProfile}
                      className="bg-green-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-500 transition"
                    >
                      Save Changes
                    </button>
                    <button 
                      onClick={handleCancelEdit}
                      className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="bg-green-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-500 transition"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Account Settings Section */}
            <div>
              <h2 className="text-green-700 text-xl font-bold border-b-2 border-gray-400 pb-2 mb-6">
                Account Settings
              </h2>

              <button 
                onClick={() => setIsChangingPassword(true)}
                className="w-full bg-gray-100 hover:bg-gray-200 transition text-left px-6 py-4 rounded-lg font-semibold text-gray-800 flex justify-between items-center group"
              >
                Change Password
                <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Change Password Modal */}
      {isChangingPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-fade-in">
            <button 
              onClick={closePasswordModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            
            {/* Conditional Rendering based on Mode */}
            {!isForgotPasswordMode ? (
              // 1. STANDARD CHANGE PASSWORD FORM
              <>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Change Password</h3>
                <form className="space-y-4" onSubmit={handleSubmitPasswordChange}>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">Current Password</label>
                      
                      {/* FORGOT PASSWORD LINK */}
                      <button 
                        type="button"
                        onClick={() => setIsForgotPasswordMode(true)}
                        className="text-xs text-green-600 hover:text-green-800 font-medium hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <input 
                      type="password" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" 
                      value={passwords.current}
                      onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                      value={passwords.new}
                      onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="pt-2 flex justify-end gap-3">
                    <button 
                      type="button"
                      onClick={closePasswordModal}
                      className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-green-700 text-white font-medium rounded-lg hover:bg-green-500 transition shadow-sm"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </>
            ) : (
              // 2. FORGOT PASSWORD / EMAIL RESET FORM
              <>
                <div className="flex items-center gap-2 mb-4">
                  <button 
                    onClick={() => setIsForgotPasswordMode(false)}
                    className="p-1 -ml-2 rounded-full hover:bg-gray-100 text-gray-500 transition"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h3 className="text-xl font-bold text-gray-800">Reset Password</h3>
                </div>

                <p className="text-gray-500 text-sm mb-6">
                  Enter the email address associated with your account and we'll send you a link to reset your password.
                </p>

                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Reset link sent to ' + profile.email); closePasswordModal(); }}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue={profile.email}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" 
                    />
                  </div>
                  
                  <div className="pt-2 flex flex-col gap-3">
                    <button 
                      type="submit"
                      className="w-full px-4 py-2.5 bg-green-700 text-white font-medium rounded-lg hover:bg-green-500 transition shadow-sm"
                    >
                      Send Reset Link
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsForgotPasswordMode(false)}
                      className="w-full px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition text-sm"
                    >
                      Back to Change Password
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Component (Unchanged)
function InfoItem({ icon, label, value, isEditing, name, onChange }) {
  return (
    <div className="flex items-start gap-4">
      <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        {isEditing ? (
          <input 
            type="text" 
            name={name}
            value={value}
            onChange={onChange}
            className="w-full max-w-md px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        ) : (
          <p className="text-lg font-medium text-gray-800">{value}</p>
        )}
      </div>
    </div>
  );
}