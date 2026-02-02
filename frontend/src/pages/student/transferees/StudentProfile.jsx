import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { regions, provinces, cities, barangays } from 'select-philippines-address';
import StudentHeader from '../../../components/student/StudentHeader.jsx';
import ProgressBar2 from '../../../components/student/ProgressBar2.jsx';
import api from '../../../services/api';

export default function Profile() {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [canProceed, setCanProceed] = useState(false);

  // Address States
  const [addressData, setAddressData] = useState({ region: [], province: [], city: [], barangay: [] });
  const [selectedAddress, setSelectedAddress] = useState({region: "",regionName: "",province: "",provinceName: "",city: "",cityName: "",barangay: "",barangayName: ""});

  useEffect(() => {
    regions().then(res => setAddressData(prev => ({ ...prev, region: res })));
  }, []);

  const handleRegionChange = (e) => {
  const code = e.target.value;
  const selected = addressData.region.find(r => r.region_code === code);

  setSelectedAddress({
    region: code,
    regionName: selected?.region_name || "",
    province: "",
    provinceName: "",
    city: "",
    cityName: "",
    barangay: "",
    barangayName: ""
  });

  provinces(code).then(res =>
    setAddressData(prev => ({ ...prev, province: res, city: [], barangay: [] }))
  );
};

  const handleProvinceChange = (e) => {
  const code = e.target.value;
  const selected = addressData.province.find(p => p.province_code === code);

  setSelectedAddress(prev => ({
    ...prev,
    province: code,
    provinceName: selected?.province_name || "",
    city: "",
    cityName: "",
    barangay: "",
    barangayName: ""
  }));

  cities(code).then(res =>
    setAddressData(prev => ({ ...prev, city: res, barangay: [] }))
  );
};


  const handleCityChange = (e) => {
  const code = e.target.value;
  const selected = addressData.city.find(c => c.city_code === code);

  setSelectedAddress(prev => ({
    ...prev,
    city: code,
    cityName: selected?.city_name || "",
    barangay: "",
    barangayName: ""
  }));

  barangays(code).then(res =>
    setAddressData(prev => ({ ...prev, barangay: res }))
  );
};

const handleBarangayChange = (e) => {
  const code = e.target.value;
  const selected = addressData.barangay.find(b => b.brgy_code === code);

  setSelectedAddress(prev => ({
    ...prev,
    barangay: code,
    barangayName: selected?.brgy_name || ""
  }));
};


  const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 200 * 1024) {
    alert("File size exceeds 200KB limit.");
    return;
  }

  setProfileImage(file);
  setImagePreview(URL.createObjectURL(file));
};


const handleSaveProfile = async (e) => {
  e.preventDefault();

  if (!formRef.current.checkValidity()) {
    formRef.current.reportValidity();
    setCanProceed(false);
    return;
  }

  try {
    const raw = new FormData(formRef.current);
    const otherInfo = raw.getAll("otherInfo");

    const payload = {
      firstName: raw.get("firstName"),
      middleName: raw.get("middleName"),
      lastName: raw.get("lastName"),
      suffix: raw.get("suffix"),
      gender: raw.get("gender"),
      birthDate: raw.get("birthDate"),
      birthPlace: raw.get("birthPlace"),
      religion: raw.get("religion"),
      civilStatus: raw.get("civilStatus"),
      nationality: raw.get("nationality"),
      contactNumber: raw.get("contactNumber"),
      email: raw.get("email"),

      address: {
  houseNo: raw.get("houseNo"),
  street: raw.get("street"),

  regionCode: selectedAddress.region,
  regionName: selectedAddress.regionName,

  provinceCode: selectedAddress.province,
  provinceName: selectedAddress.provinceName,

  cityCode: selectedAddress.city,
  cityName: selectedAddress.cityName,

  barangayCode: selectedAddress.barangay,
  barangayName: selectedAddress.barangayName,

  zipCode: raw.get("zipCode")
},


      family: {
  fatherName: raw.get("fatherName"),
  fatherOccupation: raw.get("fatherOccupation"),
  fatherContact: raw.get("fatherContact"),

  motherName: raw.get("motherName"),
  motherOccupation: raw.get("motherOccupation"),
  motherContact: raw.get("motherContact"),

  guardianName: raw.get("guardianName"),
  guardianOccupation: raw.get("guardianOccupation"),
  guardianContact: raw.get("guardianContact"),

  siblings: raw.get("siblings"),
  familyIncome: raw.get("familyIncome")
},

      otherInfo
    };

    const formData = new FormData();
formData.append("data", JSON.stringify(payload));

if (profileImage) {
  formData.append("photo", profileImage);
}

await api.put("/applicant/profile", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});


    setCanProceed(true);
    alert("Profile Saved Successfully! You can now click the arrow to proceed to Educational Profile.");
    navigate("/education");
  } catch (err) {
    console.error(err);
    alert("Failed to save profile.");
  }
};


  const inputStyle = "mt-1 h-10 w-full uppercase p-2 bg-white border border-gray-400 rounded-lg focus:ring-1 focus:ring-green-600 outline-none transition-all";
  const selectStyle = "mt-1 h-10 w-full pl-2 pr-10 bg-white border rounded-lg border-gray-400 focus:ring-1 focus:ring-green-600 outline-none appearance-none cursor-pointer transition-all disabled:bg-gray-100 disabled:cursor-not-allowed";
  const labelStyle = "text-[11px] font-bold text-gray-700 uppercase";

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <div className="shrink-0 z-50">
        <StudentHeader />
        <ProgressBar2 canProceed={canProceed} />
      </div>

     <main className="flex-1 overflow-y-auto px-4 py-2">
        <div className="w-full max-w-[1400px] mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden mb-10">
          
          <form ref={formRef} onSubmit={handleSaveProfile} className="p-4 pt-0 md:p-6 space-y-6">
            
            {/* PERSONAL INFORMATION SECTION */}
            <div className="bg-gray-50 rounded-xl border border-gray-300 p-4 md:p-6">
              <div className="text-sm sm:text-sm md:text-m lg:text-lg font-black text-green-700 mb-6 uppercase tracking-tight flex items-center ">
                Personal Information <span className="text-red-500">*</span>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                
                {/* Photo Upload - Updated items-center for mobile centering */}
                <div className="flex flex-col shrink-0 items-center lg:items-start">
                  <span className={labelStyle}>Photo (max 200kb)</span>
                  <div className="w-44 h-52 bg-white border border-gray-400 rounded-md overflow-hidden flex flex-col shadow-sm mt-1">
                    <div className="flex-1 flex items-center justify-center bg-white">
                      {imagePreview && <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />}
                    </div>
                    <label className="bg-gray-100 border-t border-gray-300 py-2 text-center cursor-pointer hover:bg-gray-300 transition-colors">
                      <span className="text-xs font-bold text-gray-800 uppercase">Upload</span>
                      <input type="file" name="photo" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>
                </div>

                {/* Info Fields Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="flex flex-col">
                    <label className={labelStyle}>First Name</label>
                    <input type="text" name="firstName" required className={inputStyle} />
                  </div>
                  <div className="flex flex-col">
                    <label className={labelStyle}>Middle Name (Optional)</label>
                    <input type="text" name="middleName" className={inputStyle} />
                  </div>
                  <div className="flex flex-col">
                    <label className={labelStyle}>Last Name</label>
                    <input type="text" name="lastName" required className={inputStyle} />
                  </div>
                  <div className="flex flex-col">
                    <label className={labelStyle}>Suffix (Optional)</label>
                    <input type="text" name="suffix" className={inputStyle} />
                  </div>
                  <div className="flex flex-col">
                    <label className={labelStyle}>Gender</label>
                    <div className="relative">
                      <select name="gender" required className={selectStyle}>
                        <option value="">SELECT GENDER</option>
                        <option value="male">MALE</option>
                        <option value="female">FEMALE</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col ">
                    <label className={labelStyle}>Date of Birth</label>
                    <input type="date" name="birthDate" required className={inputStyle} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mt-4">
                <div className="flex flex-col ">
                  <label className={labelStyle}>Place of Birth</label>
                  <input type="text" name="birthPlace" required className={inputStyle} />
                </div>
                <div className="flex flex-col">
                  <label className={labelStyle}>Religion</label>
                  <input type="text" name="religion" required className={inputStyle} />
                </div>
                <div className="flex flex-col">
                  <label className={labelStyle}>Civil Status</label>
                  <select name="civilStatus" required className={selectStyle}>
                    <option value="">SELECT STATUS</option>
                    <option value="single">SINGLE</option>
                    <option value="married">MARRIED</option>
                    <option value="widowed">WIDOWED</option>
                    <option value="separated">SEPARATED</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className={labelStyle}>Nationality</label>
                  <input type="text" name="nationality" required className={inputStyle} />
                </div>
                <div className="flex flex-col">
                  <label className={labelStyle}>Contact Number</label>
                  <input type="tel" name="contactNumber" required placeholder="09XXXXXXXXX" className={inputStyle} />
                </div>
                <div className="flex flex-col">
                  <label className={labelStyle}>Email</label>
                  <input type="email" name="email" required placeholder="example@email.com" className={inputStyle} />
                </div>
              </div>


              {/* ADDRESS SECTION */}
              <div className="mt-8 pt-4 border-t border-gray-400">
                <div className="text-sm font-black text-gray-800 mb-4 uppercase">Residential Address <span className="text-red-500">*</span></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex flex-col"><label className={labelStyle}>House No./ Unit No. / Street</label><input type="text" name="houseNo" required className={inputStyle} /></div>
                                    <div className="flex flex-col"><label className={labelStyle}> Street/Subdivision</label><input type="text" name="street" required className={inputStyle} /></div>
                  <div className="flex flex-col">
                    <label className={labelStyle}>Region</label>
                    <select name="regionCode" required className={selectStyle} onChange={handleRegionChange}>
                      <option value="">SELECT REGION</option>
                      {addressData.region.map(item => <option key={item.region_code} value={item.region_code}>{item.region_name}</option>)}
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className={labelStyle}>Province</label>
                    <select name="provinceCode" required className={selectStyle} onChange={handleProvinceChange} disabled={!selectedAddress.region}>
                      <option value="">SELECT PROVINCE</option>
                      {addressData.province.map(item => <option key={item.province_code} value={item.province_code}>{item.province_name}</option>)}
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className={labelStyle}>City / Municipality</label>
                    <select name="cityCode" required className={selectStyle} onChange={handleCityChange} disabled={!selectedAddress.province}>
                      <option value="">SELECT CITY/MUNICIPALITY</option>
                      {addressData.city.map(item => <option key={item.city_code} value={item.city_code}>{item.city_name}</option>)}
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className={labelStyle}>Barangay</label>
                    <select name="barangayCode"  value={selectedAddress.barangay} onChange={handleBarangayChange} required className={selectStyle} disabled={!selectedAddress.city}>
                      <option value="">SELECT BARANGAY</option>
                      {addressData.barangay.map(item => <option key={item.brgy_code} value={item.brgy_code}>{item.brgy_name}</option>)}
                    </select>
                  </div>

                  <div className="flex flex-col"><label className={labelStyle}>Zip Code</label><input type="text" name="zipCode" required className={inputStyle} /></div>
                </div>
              </div>
            </div>

              {/* FAMILY INFORMATION */}
              <div className="bg-gray-50 rounded-xl border border-gray-300 p-4 md:p-6">
                <div className="text-sm md:text-lg font-black text-green-700 mb-6 uppercase tracking-tight">
                  Family Information
                </div>
                
                {/* Parent/Guardian Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {['Father', 'Mother', 'Guardian'].map((role) => (
                    <div key={role} className="space-y-4">
                      <div className="text-center font-bold text-gray-800 uppercase text-xs border-b border-gray-300 pb-1">
                        {role}
                      </div>
                      {['Name', 'Occupation', 'Contact Number'].map(f => {
						const isContact = f === 'Contact Number';

						const fieldName = isContact
					    ? `${role.toLowerCase()}Contact`
					    : `${role.toLowerCase()}${f.replace(/\s/g,'')}`;
						return (
                        <div key={f} className="flex flex-col">
                          <label className="text-[10px] font-bold text-gray-600 uppercase">{f}</label>
                          <input type="text" name={fieldName} required={role !== 'Guardian'} className={inputStyle} />
                        </div>
                      )
					  })}
                    </div>
                  ))}
                </div>	

                {/* Additional Family Details - New Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-2 pt-4 border-t border-gray-200">
                  <div className="flex flex-col">
                    <label className={labelStyle}>Number of Siblings</label>
                    <input 
                      type="number" name="siblings"
                      min="0" 
                      required  
                      className={inputStyle} 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className={labelStyle}>Monthly Family Income</label>
                    <select name="familyIncome" required className={selectStyle}>
                      <option value="">SELECT INCOME RANGE</option>
                      <option value="below 10k">BELOW ₱10,000</option>
                      <option value="10k-20k">₱10,001 - ₱20,000</option>
                      <option value="20k-30k">₱20,001 - ₱30,000</option>
                      <option value="30k-40k">₱30,001 - ₱40,000</option>
                      <option value="40k-50k">₱40,001 - ₱50,000</option>
                      <option value="above 50k">ABOVE ₱50,000</option>
                    </select>
                  </div>
                </div>
              </div>
            {/* OTHER INFORMATION SECTION */}
            <div className="bg-gray-50 rounded-xl border border-gray-300 p-4 md:p-6">
              <div className="text-sm sm:text-sm md:text-m lg:text-lg font-black text-green-700 mb-4 uppercase tracking-tight">
                Other Information<span className="text-red-500">*</span>
              </div>
              <div className="space-y-3">
                {[
                  'I am a member of Pantawid Pamilyang Pilipino Program (4Ps)',
                  'I have a disability',
                  'I am part of an indigenous group'
                ].map((text) => (
                  <label key={text} className="flex items-center space-x-3 cursor-pointer group">
                    <input 
                      type="checkbox" name="otherInfo" value={text}
                      className="w-5 h-5 rounded border-gray-400 accent-green-700 cursor-pointer" 
                    />
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-black">
                      {text}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 pb-10">
              <button type="submit" className="p-4 bg-green-700 hover:bg-green-600 text-white font-black rounded-xl transition-all shadow-lg uppercase text-sm tracking-widest active:scale-95">
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}