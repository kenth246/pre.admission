import React, { useState, useEffect } from "react";
import StudentHeader from "../../../components/student/StudentHeader";
import ProgressBar2 from "../../../components/student/ProgressBar2";
import api from "../../../services/api";

export default function Requirements() {
  const [files, setFiles] = useState({});
  // Control the ProgressBar's next button
  const [canProceed, setCanProceed] = useState(false);

  // List of requirements with a 'required' flag based on your asterisk rule
  const requirementList = [
    { name: "Original Transcript of Records*", key: "tor", required: false },
    { name: "Original Honorable Dismissal*", key: "dismissal", required: false },
    { name: "Original Copy of Grades*", key: "grades", required: false },
    { name: "Photocopy of PSA", key: "birth_cert", required: true },
  ];

  // Logic: Check if all items that don't have an asterisk have files
  useEffect(() => {
    const mandatoryKeys = requirementList
      .filter(item => item.required)
      .map(item => item.key);
    
    // Checks if every key marked 'required: true' exists in the files state
    const allMandatoryUploaded = mandatoryKeys.every(
      key => files[key] && files[key].length > 0
    );

    setCanProceed(allMandatoryUploaded);
  }, [files]);

  const handleFileChange = (key, e) => {
    const selectedFile = e.target.files[0];
      if (!selectedFile) return;  
      if (selectedFile.size > 200 * 1024) {
        alert("File is too large. Maximum size is 200KB.");
      e.target.value = null;
        return;
      }

      setFiles((prev) => {
        const existingFiles = prev[key] || [];
        if (existingFiles.length >= 2) {
          alert("Maximum 2 files allowed per requirement.");
          return prev;
        }
        return {
          ...prev,
          [key]: [...existingFiles, selectedFile],
        };
      });
  
    e.target.value = null;
  };

  const removeFile = (key, index) => {
    setFiles((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!canProceed) return;

    const confirmSubmit = window.confirm(
      "Are you sure you want to save these requirements?"
    );
    if (!confirmSubmit) return;

    try {
      const formData = new FormData();

      Object.keys(files).forEach(key => {
  files[key].forEach(file => {
    formData.append("documents", file);
  });
});


      await api.post("/applicant/requirements", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});


      alert("Requirements saved! You may now proceed to Interview.");
      navigate("/student/interview");
    } catch (err) {
      console.error(err);
      alert("Failed to upload requirements.");
    }
  };

  return (
    <div className="min-h-screen bg-white pb-10">
      <StudentHeader />
      {/* Passing canProceed to enable the next arrow in the progress bar */}
      <ProgressBar2 canProceed={canProceed} />

      <main className="max-w-5xl mx-auto px-4 mt-8">
        <div className="p-2">
          <p className="text-gray-700 mb-6 italic">
            <span className="font-bold not-italic text-red-600">Note:</span> Items without an asterisk are mandatory. Requirements with asterisks (*) can be submitted at a later date if not currently available.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-t border-b border-gray-300">
                  <th className="py-4 px-4 text-left font-bold text-gray-800 w-1/2 uppercase text-sm tracking-wider">Requirements</th>
                  <th className="py-4 px-4 text-left font-bold text-gray-800 w-1/2 uppercase text-sm tracking-wider">Upload Photo (max 200KB)</th>
                </tr>
              </thead>
              <tbody>
                {requirementList.map((item) => (
                  <tr key={item.key} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="py-6 px-4 uppercase text-gray-800 text-sm font-semibold">
                      {item.name} {!item.required && <span className="text-[10px] text-blue-500 font-normal normal-case">(Optional)</span>}
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex flex-col space-y-3">
                        {files[item.key]?.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-green-50 p-2 rounded-lg border border-dashed border-green-200">
                            <span className="text-xs text-green-700 font-bold truncate max-w-[150px]">
                              ✓ {file.name}
                            </span>
                            <button 
                              onClick={() => removeFile(item.key, idx)}
                              className="text-[10px] text-red-500 font-black hover:text-red-700 ml-2 uppercase"
                            >
                              Remove
                            </button>
                          </div>
                        ))}

                        {(!files[item.key] || files[item.key].length < 2) && (
                          <div className="flex items-center space-x-3">
                            <label className="cursor-pointer bg-green-600 hover:bg-green-700 text-white py-2 px-5 rounded-lg text-xs font-bold transition-all uppercase tracking-widest shadow-sm">
                              {files[item.key]?.length === 1 ? "Add Page 2" : "Choose File"}
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => handleFileChange(item.key, e)}
                                accept="image/*"
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-12 pb-20">
            <button
              disabled={!canProceed}
              className={`px-10 py-5 font-black rounded-2xl transition-all shadow-xl transform active:scale-95 uppercase tracking-[0.2em] text-sm ${
                canProceed 
                ? "bg-green-700 hover:bg-green-800 text-white" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              onClick={handleSubmit}
            >
              Submit Requirements
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
