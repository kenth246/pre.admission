import React, { useState, useEffect } from "react";
import StudentHeader from "../../../components/student/StudentHeader";
import ProgressBar from "../../../components/student/ProgressBar";

export default function Requirements() {
  const [files, setFiles] = useState({});
  // canProceed is initialized to true because asterisk items are not mandatory
  const [canProceed, setCanProceed] = useState(true);

  const requirementList = [
    { name: "Original Grade 12 Report Card*", key: "g12_card", isOptional: true },
    { name: "Original Certificate of Good Moral*", key: "good_moral", isOptional: true },
    { name: "Photocopy of SHS Diploma*", key: "diploma", isOptional: true },
    { name: "Photocopy of PSA Birth Certificate", key: "birth_cert", isOptional: false }, // No asterisk, usually required
  ];

  // Logic: Only block if a requirement WITHOUT an asterisk is missing
  useEffect(() => {
    const mandatoryKeys = requirementList
      .filter(item => !item.isOptional)
      .map(item => item.key);
    
    const allMandatoryUploaded = mandatoryKeys.every(
      key => files[key] && files[key].length > 0
    );

    setCanProceed(allMandatoryUploaded);
  }, [files]);

  const handleFileChange = (key, e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 200 * 1024) {
        alert("File is too large. Maximum size is 200KB.");
        return;
      }

      setFiles((prev) => {
        const existingFiles = prev[key] || [];
        if (existingFiles.length >= 2) {
          alert("Maximum 2 files allowed per requirement.");
          return prev;
        }
        return { ...prev, [key]: [...existingFiles, { name: selectedFile.name }] };
      });
    }
    e.target.value = null;
  };

  const removeFile = (key, index) => {
    setFiles((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen bg-white pb-10">
      <StudentHeader />
      <ProgressBar canProceed={canProceed} />

      <main className="max-w-5xl mx-auto px-4 mt-8">
        <div className="p-2">
          <p className="text-gray-700 mb-6 italic">
            <span className="font-bold not-italic text-red-600">Note:</span> Requirements with asterisks (*) are to be followed/submitted later if not available now.
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
                      {item.name}
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex flex-col space-y-3">
                        {files[item.key]?.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-green-50 p-2 rounded-lg border border-dashed border-green-200">
                            <span className="text-xs text-green-700 font-bold truncate max-w-[150px]">✓ {file.name}</span>
                            <button onClick={() => removeFile(item.key, idx)} className="text-[10px] text-red-500 font-black hover:text-red-700 ml-2 uppercase">Remove</button>
                          </div>
                        ))}
                        {(!files[item.key] || files[item.key].length < 2) && (
                          <div className="flex items-center space-x-3">
                            <label className="cursor-pointer bg-green-600 hover:bg-green-700 text-white py-2 px-5 rounded-lg text-xs font-bold transition-all uppercase tracking-widest shadow-sm">
                              {files[item.key]?.length === 1 ? "Add Another Page" : "Choose File"}
                              <input type="file" className="hidden" onChange={(e) => handleFileChange(item.key, e)} accept="image/*" />
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
              className="px-10 py-5 bg-green-700 hover:bg-green-800 text-white font-black rounded-2xl transition-all shadow-xl transform active:scale-95 uppercase tracking-[0.2em] text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={!canProceed}
              onClick={() => {
                alert("Requirements saved! You can now proceed to Interview.");
              }}
            >
              Submit Requirements
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}