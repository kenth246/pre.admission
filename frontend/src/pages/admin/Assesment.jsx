import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from '../../components/Header.jsx';
import { FaSearch, FaFilter, FaPlus, FaTrash, FaCog, FaCircle, FaAlignLeft, FaCheckCircle, FaTimes, FaFileUpload, FaPrint } from "react-icons/fa";
import { FileText, MessageSquare, User, Calendar, Send, XCircle, CheckCircle, Download } from "lucide-react";

export default function Assesments() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBcetModalOpen, setIsBcetModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isSlipPreviewOpen, setIsSlipPreviewOpen] = useState(false); // NEW STATE FOR SLIP PREVIEW
  
  // Track decision type (passed/failed) and context (interview/bcet)
  const [decisionType, setDecisionType] = useState(""); 
  const [decisionContext, setDecisionContext] = useState("interview"); // 'interview' or 'bcet'
  
  // --- QUESTIONS SETUP STATES ---
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [setupTab, setSetupTab] = useState("Interview"); 
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const fileInputRef = useRef(null); // Ref for hidden file input
  
  const [interviewItems, setInterviewItems] = useState([
    { id: '1', type: 'title', title: 'INTERVIEW', description: 'Please answer all questions honestly and provide as much detail as possible to help us evaluate your application.' },
    { id: 'fixed-course', type: 'course' } 
  ]);

  const [bcetItems, setBcetItems] = useState([
    { id: 'bcet-1', type: 'title', title: 'ENTRANCE TEST (BCET)', description: 'General Knowledge and Logic Assessment.' }
  ]);

  const activeItems = setupTab === 'Interview' ? interviewItems : bcetItems;

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [typeFilter, setTypeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); 
  const filterRef = useRef(null);

  const [editableMessage, setEditableMessage] = useState("");
  const [scores, setScores] = useState([25, 25, 25, 25]);
  const totalScore = scores.reduce((a, b) => Number(a) + Number(b), 0);
  const isPassing = totalScore >= 75;

  // --- MOCK DATABASE ---
  const [applicants, setApplicants] = useState([
    {
      id: "2026-0001",
      name: "JUAN DELA CRUZ",
      email: "juan.dc@email.com",
      type: "Freshmen",
      location: "PULILAN",
      date: "12/15/25",
      status: "Pending Interview",
      responses: {
        choices: { first: "BS Information Technology", second: "BS Computer Science" },
        interview: [
          { q: "Why did you choose this course?", a: "I have a passion for technology and want to build a career in software development." },
          { q: "What are your career goals after graduation?", a: "To become a full-stack developer in a leading tech company." },
          { q: "Tell me about yourself?", a: "I am a dedicated student with a strong interest in logic and problem solving." },
          { q: "Why should the college accept your application?", a: "I am hardworking and committed to academic excellence" }
        ],
        bcet: [
          {
            id: 1,
            question: "What does HTML stand for?",
            options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"],
            answer: "Hyper Text Markup Language",
            correctAnswer: "Hyper Text Markup Language" 
          },
          {
            id: 2,
            question: "Which programming language is primarily used for styling web pages?",
            options: ["Python", "C++", "CSS", "Java"],
            answer: "CSS",
            correctAnswer: "CSS"
          },
          {
            id: 3,
            question: "What is the result of 5 + '5' in JavaScript?",
            options: ["10", "55", "Error", "undefined"],
            answer: "55",
            correctAnswer: "55"
          }
        ]
      }
    },
    {
      id: "2026-0002",
      name: "ANNA SANTOS",
      email: "anna@email.com",
      type: "Transferees",
      location: "BALIUAG",
      date: "12/16/25",
      status: "Pending BCET",
      responses: {
        choices: { first: "BS Information Systems", second: "BS Information Technology" },
        interview: [
          { q: "Why did you choose this course?", a: "I want to bridge the gap between business and technology." },
          { q: "What are your career goals after graduation?", a: "To work as a Systems Analyst or Project Manager." },
          { q: "Tell me about yourself?", a: "I am organized, detail-oriented, and have experience leading student organizations." },
          { q: "Why should the college accept your application?", a: "I have a strong academic record and a drive to succeed." }
        ],
        bcet: [
          {
            id: 1,
            question: "What does HTML stand for?",
            options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"],
            answer: "Home Tool Markup Language",
            correctAnswer: "Hyper Text Markup Language"
          },
          {
            id: 2,
            question: "Which programming language is primarily used for styling web pages?",
            options: ["Python", "C++", "CSS", "Java"],
            answer: "CSS",
            correctAnswer: "CSS"
          },
          {
            id: 3,
            question: "What is the result of 5 + '5' in JavaScript?",
            options: ["10", "55", "Error", "undefined"],
            answer: "55",
            correctAnswer: "55"
          }
        ]
      }
    }
  ]);

  // --- QUESTIONS SETUP FUNCTIONS ---
  const addSetupBlock = (blockType) => {
    const setItems = setupTab === 'Interview' ? setInterviewItems : setBcetItems;
    const currentList = setupTab === 'Interview' ? interviewItems : bcetItems;
    let newItem;
    if (blockType === 'title') {
      newItem = { id: Date.now().toString(), type: 'title', title: '', description: '' };
    } else {
      const defaultQType = setupTab === 'BCET' ? 'multipleChoice' : 'text';
      newItem = { id: Date.now().toString(), type: 'question', question: '', points: '', target: 'All', questionType: defaultQType };
      if (setupTab === 'BCET') {
        if (defaultQType === 'multipleChoice') { newItem.options = ['', '', '', '']; newItem.correctAnswer = 0; } 
        else { newItem.textKeys = ''; }
      }
    }
    setItems([...currentList, newItem]);
    setShowAddDropdown(false);
  };

  const handleSetupChange = (id, field, value) => {
    const setItems = setupTab === 'Interview' ? setInterviewItems : setBcetItems;
    setItems(prev => prev.map(item => {
        if (item.id === id) {
            const updated = { ...item, [field]: value };
            if (field === 'questionType') {
                if (value === 'multipleChoice' && !item.options) { updated.options = ['', '', '', '']; updated.correctAnswer = 0; } 
                else if (value === 'text' && !item.textKeys) { updated.textKeys = ''; }
            }
            return updated;
        }
        return item;
    }));
  };

  const removeSetupBlock = (id) => { const setItems = setupTab === 'Interview' ? setInterviewItems : setBcetItems; setItems(prev => prev.filter(item => item.id !== id)); };
  const handleOptionChange = (itemId, optionIndex, value) => { setBcetItems(prev => prev.map(item => { if (item.id === itemId) { const newOptions = [...item.options]; newOptions[optionIndex] = value; return { ...item, options: newOptions }; } return item; })); };
  const handleAddOption = (itemId) => { setBcetItems(prev => prev.map(item => { if (item.id === itemId) { return { ...item, options: [...(item.options || []), ''] }; } return item; })); };
  const setCorrectAnswer = (itemId, optionIndex) => { setBcetItems(prev => prev.map(item => item.id === itemId ? { ...item, correctAnswer: optionIndex } : item)); };

  // --- CSV IMPORT FUNCTION ---
  const handleCsvImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n');
      
      // Basic CSV parsing (assuming headers are present or simple structure)
      // Expected simple CSV format: Question, QuestionType (Text/MultipleChoice), Points, OptionA, OptionB, OptionC, OptionD, CorrectKey/Answer
      
      const newQuestions = [];
      
      // Skip header row if exists (simple check if first row contains "Question")
      const startIndex = lines[0].toLowerCase().includes('question') ? 1 : 0;

      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Split by comma, handling potential commas inside quotes would require regex, using simple split for now
        const cols = line.split(',').map(c => c.trim()); 
        if (cols.length < 1) continue;

        const questionText = cols[0];
        // Default to Text type if not specified
        const qTypeRaw = cols[1]?.toLowerCase() || 'text'; 
        const qType = qTypeRaw.includes('multiple') ? 'multipleChoice' : 'text';
        const points = cols[2] || '';

        const newItem = {
          id: `imported-${Date.now()}-${i}`,
          type: 'question',
          question: questionText,
          points: points,
          target: 'All', // Default target
          questionType: qType
        };

        if (setupTab === 'BCET') {
            if (qType === 'multipleChoice') {
                // Try to grab options from cols 3,4,5,6
                const opts = [cols[3] || '', cols[4] || '', cols[5] || '', cols[6] || ''];
                newItem.options = opts;
                
                // Try to find correct answer index (col 7 might be 'A', 'B', '0', '1', or the text itself)
                const correctVal = cols[7]?.toLowerCase() || '';
                let correctIdx = 0;
                if (correctVal === 'a' || correctVal === '1') correctIdx = 0;
                else if (correctVal === 'b' || correctVal === '2') correctIdx = 1;
                else if (correctVal === 'c' || correctVal === '3') correctIdx = 2;
                else if (correctVal === 'd' || correctVal === '4') correctIdx = 3;
                else {
                    // Try to match text
                    const foundIdx = opts.findIndex(o => o.toLowerCase() === correctVal);
                    if (foundIdx !== -1) correctIdx = foundIdx;
                }
                newItem.correctAnswer = correctIdx;
            } else {
                // Text answer key
                newItem.textKeys = cols[3] || ''; 
            }
        }

        newQuestions.push(newItem);
      }

      if (newQuestions.length > 0) {
        const setItems = setupTab === 'Interview' ? setInterviewItems : setBcetItems;
        setItems(prev => [...prev, ...newQuestions]);
        alert(`Successfully imported ${newQuestions.length} questions from CSV.`);
      } else {
        alert("No valid questions found in CSV.");
      }
      
      // Reset input
      event.target.value = '';
    };
    reader.readAsText(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    if (location.state?.applicantId) {
      const target = applicants.find(a => a.id === location.state.applicantId);
      if (target) {
        setSelectedApplicant(target);
        setIsModalOpen(true);
        navigate(location.pathname, { replace: true });
      }
    }
  }, [location.state, applicants, navigate, location.pathname]);

  const filteredApplicants = applicants.filter((a) => {
    const text = `${a.id} ${a.name}`.toLowerCase();
    if (searchQuery && !text.includes(searchQuery.toLowerCase())) return false;
    if (typeFilter && a.type !== typeFilter) return false;
    if (locationFilter && a.location !== locationFilter) return false;
    if (statusFilter && a.status !== statusFilter) return false;
    return true;
  });

  const locations = [...new Set(applicants.map(a => a.location))];

  const handleScoreChange = (index, value) => {
    const newScores = [...scores];
    newScores[index] = value;
    setScores(newScores);
  };

  // Helper: Calculate BCET Score
  const calculateBcetScore = (applicant) => {
    if (!applicant?.responses?.bcet) return 0;
    return applicant.responses.bcet.reduce((acc, curr) => {
      return curr.answer === curr.correctAnswer ? acc + 1 : acc;
    }, 0);
  };

  // --- UPDATED DECISION LOGIC ---
  const openDecisionModal = (type, context = "interview") => {
    setDecisionType(type);
    setDecisionContext(context);
    
    let defaultMsg = "";
    
    if (context === "interview") {
        defaultMsg = type === 'passed' 
          ? `Dear ${selectedApplicant.name},\n\nCongratulations! You have PASSED the initial interview. You may now take the BTECH College Entrance Test (BCET):\n\nhttps://btech-portal.edu.ph/exam/bcet-2026`
          : `Dear ${selectedApplicant.name},\n\nWe regret to inform you that you did not pass the initial interview. We wish you the best in your future endeavors.`;
    } else {
        // BCET Context
        if (type === 'passed') {
            const bcetScore = calculateBcetScore(selectedApplicant);
            const maxBcetScore = selectedApplicant.responses.bcet?.length || 0;
            
            // Generate Admission Slip Message with PDF Link
            defaultMsg = `Dear ${selectedApplicant.name},

Congratulations! You have PASSED the BTECH College Entrance Test (BCET).

We are pleased to inform you that you have been ADMITTED to the college. 
An official Admission Slip has been generated for you (Attached).

Please DOWNLOAD and PRINT your official Admission Slip PDF using the link below:
https://btech-portal.edu.ph/downloads/admission-slips/${selectedApplicant.id}_slip.pdf

Present this printed slip to the Registrar's Office to finalize your enrollment.

Welcome to BTECH!`;
        } else {
            defaultMsg = `Dear ${selectedApplicant.name},\n\nWe regret to inform you that you did not reach the passing score for the Entrance Test. We wish you the best in your future endeavors.`;
        }
    }

    setEditableMessage(defaultMsg);
    setIsMessageModalOpen(true);
  };

  const handleFinalDecision = () => {
    setApplicants(prev => prev.map(app => {
        if (app.id === selectedApplicant.id) {
            let newStatus = app.status;
            
            if (decisionContext === "interview") {
                if (decisionType === 'passed') newStatus = "Pending BCET";
                else newStatus = "Failed Interview";
            } else if (decisionContext === "bcet") {
                if (decisionType === 'passed') {
                    newStatus = "Passed BCET"; // Changed from Admitted to Passed BCET
                } else {
                    newStatus = "Failed BCET";
                }
            }
            return { ...app, status: newStatus };
        }
        return app;
    }));
    
    alert(`Email Sent to ${selectedApplicant.email}! Status updated.`);
    setIsMessageModalOpen(false);
    setIsModalOpen(false);
    setIsBcetModalOpen(false); // Close BCET modal if open
  };

  return (
    <div className="bg-gray-200 h-screen flex flex-col overflow-hidden font-sans">
      <Header username="admin" />

      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="shrink-0">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1 uppercase tracking-tight">Assessments</h2>
              <p className="text-gray-600">Review and verify applicant interview responses and examination results</p>
            </div>
          </div>

          <div className="flex gap-3 mb-4 items-center justify-between">
            {/* --- SEARCH & FILTER --- */}
            <div className="flex gap-3 items-center">
              <div className="relative">
                <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="text"
                  placeholder="Search applicant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 text-xl rounded-lg bg-white border border-white w-92 outline-none shadow-sm"
                />
              </div>

              <div className="relative" ref={filterRef}>
                <button onClick={() => setShowFilter(!showFilter)} className="bg-white px-4 py-2 rounded-lg shadow flex items-center gap-2 font-semibold">
                  <FaFilter /> Filter
                </button>
                {showFilter && (
                   <div className="absolute left-0 mt-2 bg-white border rounded shadow-xl p-3 w-52 z-30">
                    <label className="block text-xs font-semibold mb-1 uppercase tracking-tight">Type</label>
                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full mb-3 p-2 border rounded text-sm outline-none">
                      <option value="">All</option>
                      <option value="Freshmen">Freshmen</option>
                      <option value="Transferees">Transferees</option>
                    </select>
                    <label className="block text-xs font-semibold mb-1 uppercase tracking-tight">Status</label>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full mb-3 p-2 border rounded text-sm outline-none">
                      <option value="">All Status</option>
                      <option value="Pending Interview">Pending Interview</option>
                      <option value="Pending BCET">Pending BCET</option>
                      <option value="Passed BCET">Passed BCET</option>
                      {/* Removed Admitted */}
                      <option value="Failed Interview">Failed Interview</option>
                      <option value="Failed BCET">Failed BCET</option>
                    </select>
                    <label className="block text-xs font-semibold mb-1 uppercase tracking-tight">Location</label>
                    <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="w-full mb-3 p-2 border rounded text-sm outline-none">
                      <option value="">All Locations</option>
                      {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                    <div className="flex justify-between">
                      <button onClick={() => setShowFilter(false)} className="px-3 py-1 bg-green-700 text-white rounded text-xs font-bold">Apply</button>
                      <button onClick={() => { setTypeFilter(""); setLocationFilter(""); setStatusFilter(""); setSearchQuery(""); }} className="px-3 py-1 bg-gray-100 rounded text-xs font-bold">Clear</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* QUESTIONS SETUP BUTTON */}
            <button 
              onClick={() => setIsSetupModalOpen(true)}
              className="bg-green-700 text-white px-5 py-2.5 rounded-lg font-bold text-xs uppercase flex items-center gap-2 hover:bg-green-800 transition-all shadow-md active:scale-95"
            >
              <FaCog className="animate-spin-slow" /> Questions Setup
            </button>
          </div>
        </div>

 {/* --- MAIN TABLE (NEW LAYOUT) --- */}
        <div className="flex-1 bg-white rounded-lg shadow flex flex-col overflow-hidden">
          <div className="overflow-y-auto">
            <table className="w-full border-collapse">
              <thead className="bg-green-600 text-white sticky top-0 z-20">
                <tr className="text-xs uppercase tracking-wide">
                  <th className="px-4 py-3 text-left text-lg font-bold pl-6">ID</th>
                  <th className="px-7 py-3 text-lg text-left font-bold">Applicant Name</th>
                  <th className="px-4 py-3 text-lg text-left font-bold">Type</th>
                  <th className="px-4 py-3 text-lg text-left font-bold">Location</th>
                  <th className="px-4 py-3 text-lg text-center font-bold">Date</th>
                  <th className="px-4 py-3 text-lg text-center font-bold">Status</th>
                  <th className="px-4 py-3 text-lg text-center font-bold pr-8">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApplicants.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    {/* ID */}
                    <td className="py-3 pl-6 text-sm text-gray-500 font-medium">{a.id}</td>
                    
                    {/* Name */}
                    <td className="px-7 py-3 text-sm text-gray-900 font-medium">{a.name}</td>
                    
                    {/* Type */}
                    <td className="px-4 py-3 text-sm uppercase text-gray-600">{a.type}</td>
                    
                    {/* Location */}
                    <td className="px-4 py-3 text-sm uppercase text-gray-600">{a.location}</td>
                    
                    {/* Date */}
                    <td className="px-4 py-3 text-sm text-gray-600 text-center">{a.date}</td>
                    
                    {/* Status with new Badge Style */}
                    <td className="px-4 py-3 text-center">
                      <span className={`px-4 py-1.5 rounded-lg text-[11px] font-extrabold uppercase tracking-wide border ${
                        a.status === "Pending Interview" 
                          ? "bg-yellow-100 text-yellow-700 border-yellow-200" 
                          : a.status === "Pending BCET" 
                          ? "bg-blue-100 text-blue-700 border-blue-200"
                          : a.status === "Passed BCET"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-red-100 text-red-700 border-red-200"
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    
                    {/* Action with Tooltips */}
                    <td className="px-4 py-2 text-center pr-6">
                      <div className="flex justify-center gap-6">
                        
                        {/* VIEW INTERVIEW BUTTON */}
                        <div className="group relative flex flex-col items-center">
                            <button 
                              onClick={() => { setSelectedApplicant(a); setIsModalOpen(true); }} 
                              className="text-green-600 hover:scale-110 transition-transform"
                            >
                              <MessageSquare size={22} />
                            </button>
                            <div className="absolute top-full mt-2 whitespace-nowrap bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                View Interview
                            </div>
                        </div>

                        {/* VIEW EXAMINATION BUTTON */}
                        <div className="group relative flex flex-col items-center">
                            <button 
                              onClick={() => { setSelectedApplicant(a); setIsBcetModalOpen(true); }}
                              className="text-blue-600 hover:scale-110 transition-transform"
                            >
                              <FileText size={22} />
                            </button>
                            <div className="absolute top-full mt-2 whitespace-nowrap bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                View BCET
                            </div>
                        </div>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* --- BCET RESULTS MODAL  --- */}
      {isBcetModalOpen && selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-[#f0f4f8] w-full max-w-6xl rounded-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
                        {/* Modal Header (Matches Interview Modal) */}
            <div className="bg-green-700 px-8 py-6 border-b border-gray-400 shrink-0 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-white">BTECH College Entrance Test Results</h2>
                <div className="flex gap-4 mt-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  <span className="flex items-center text-white gap-1"><User size={14}/> {selectedApplicant.name}</span>
                  <span className="flex items-center text-white gap-1"><Calendar size={14}/> {selectedApplicant.date}</span>
                </div>
              </div>
              <button onClick={() => setIsBcetModalOpen(false)} className="text-gray-300 hover:text-black text-4xl">&times;</button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
               
               {/* Form Header Card */}
               <div className="bg-white rounded-lg shadow p-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">BTECH COLLEGE ENTRANCE TEST</h1>
                  <p className="text-sm text-gray-600 mb-4">Instructions: Please read each question carefully and select the best answer. You can only submit your answers once.</p>
               </div>

               {/* Questions Render Logic */}
               {selectedApplicant.responses.bcet?.map((item, index) => (
                 <div key={item.id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
                    <div className="text-base font-medium text-gray-900 mb-4 flex justify-between">
                      <span>{index + 1}. {item.question} <span className="text-red-600">*</span></span>
                      {item.answer === item.correctAnswer 
                        ? <span className="text-green-600 text-xs font-bold uppercase border border-green-200 bg-green-50 px-2 py-1 rounded">Correct</span> 
                        : <span className="text-red-600 text-xs font-bold uppercase border border-red-200 bg-red-50 px-2 py-1 rounded">Incorrect</span>
                      }
                    </div>

                    <div className="space-y-3">
                       {item.options.map((opt, i) => (
                         <div key={i} className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              item.answer === opt ? (item.answer === item.correctAnswer ? 'border-green-600' : 'border-red-600') : 'border-gray-400'
                            }`}>
                              {item.answer === opt && <div className={`w-2.5 h-2.5 rounded-full ${item.answer === item.correctAnswer ? 'bg-green-600' : 'bg-red-600'}`}></div>}
                            </div>
                            <span className={`text-sm ${item.answer === opt ? (item.answer === item.correctAnswer ? 'font-bold text-green-800' : 'font-bold text-red-800') : 'text-gray-700'}`}>
                              {opt}
                            </span>
                         </div>
                       ))}
                    </div>
                 </div>
               ))}

               {/* Score Summary Card */}
               {selectedApplicant.responses.bcet && (
                 <div className="bg-white px-8 py-4 rounded-xl border border-gray-200 shadow-lg text-center mt-6">
                    <div className="text-xs font-black text-gray-600 uppercase tracking-[0.2em] mb-2">BCET Score Result</div>
                    <div className="text-4xl font-black text-gray-800">
                      <span className="text-green-600">{calculateBcetScore(selectedApplicant)}</span>
                      <span className="text-gray-400 text-2xl"> / {selectedApplicant.responses.bcet.length}</span>
                    </div>
                    <div className="mt-2 text-sm font-bold text-gray-500 uppercase">
                       {(calculateBcetScore(selectedApplicant) / selectedApplicant.responses.bcet.length) * 100 >= 50 ? "Passed" : "Failed"}
                    </div>
                 </div>
               )}

               {!selectedApplicant.responses.bcet && (
                 <div className="text-center py-10 text-gray-400 font-bold italic">
                   No examination results available for this applicant.
                 </div>
               )}
            </div>

            {/* Modal Footer with Passed/Failed Buttons  */}
            <div className="px-8 py-4 bg-white border-t border-gray-400 flex justify-center gap-6 shrink-0">
              <button 
                onClick={() => openDecisionModal("passed", "bcet")} 
                className="flex items-center gap-2 px-12 py-4 bg-green-700 text-white font-black uppercase text-xs rounded-xl shadow-xl hover:bg-green-800"
              >
                <CheckCircle size={18}/> Passed
              </button>
              <button 
                onClick={() => openDecisionModal("failed", "bcet")} 
                className="flex items-center gap-2 px-12 py-4 bg-red-600 text-white font-black uppercase text-xs rounded-xl shadow-xl hover:bg-red-700"
              >
                <XCircle size={18}/> Failed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- QUESTIONS SETUP MODAL --- */}
      {isSetupModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-800 to-green-700 px-8 py-6">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
                      <FaCog className="text-white text-lg" />
                    </div>
                    <div>
                      <h3 className="text-white text-2xl font-bold tracking-tight">QUESTIONS SETUP</h3>
                    </div>
                  </div>
                  {/* Navigation tabs */}
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setSetupTab("Interview")}
                      className={`px-6 pt-2 rounded-t-lg text-m font-bold transition-all ${
                        setupTab === 'Interview' 
                          ? 'border-b-3 border-yellow-400 text-yellow-400' 
                          : 'text-white hover:bg-yellow-00'
                      }`}
                    >
                      Interview
                    </button>
                    <button 
                      onClick={() => setSetupTab("BCET")}
                      className={`px-6 py-2 rounded-t-lg text-m font-bold transition-all ${
                        setupTab === 'BCET' 
                          ? 'border-b-3 border-yellow-400 text-yellow-400' 
                          : 'text-white hover:bg-yellow-00'
                      }`}
                    >
                      BCET
                    </button>
                  </div>
                </div>
                {/* Close button */}
                <button 
                  onClick={() => setIsSetupModalOpen(false)}
                  className="text-green-200 hover:text-white text-2xl font-light transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="h-3 bg-white -mt-3"></div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
              <div className="space-y-6">
                {/* Setup Items Container */}
                <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
                  {/* Header Row */}
                  <div className="bg-gray-100 px-6 py-4 border-b border-gray-300 flex items-end justify-end gap-3">
                    
                    {/* Hidden CSV Input */}
                    <input 
                      type="file" 
                      accept=".csv"
                      ref={fileInputRef}
                      onChange={handleCsvImport}
                      className="hidden" 
                    />

                    {/* Import CSV Button */}
                    <button 
                        onClick={triggerFileUpload}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold text-xs uppercase shadow-md transition-all active:scale-95"
                    >
                        <FaFileUpload size={14} /> Import CSV
                    </button>

                    {/* Add Button */}
                    <div className="relative">
                      <button 
                        onClick={() => setShowAddDropdown(!showAddDropdown)}
                        className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-lg font-bold text-xs uppercase shadow-md transition-all active:scale-95"
                      >
                        <FaPlus size={12} /> ADD
                      </button>
                      
                      {showAddDropdown && (
                        <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl py-2 w-56 z-10">
                          <button 
                            onClick={() => { addSetupBlock('title'); setShowAddDropdown(false); }}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                          >
                            <div className="font-bold text-gray-800">Title / Description</div>
                          </button>
                          <div className="border-t border-gray-100"></div>
                          <button 
                            onClick={() => { addSetupBlock('question'); setShowAddDropdown(false); }}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                          >
                            <div className="font-bold text-gray-800">Question</div>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Setup Items List (Uses activeItems based on Tab) */}
                  <div className="p-4 space-y-4">
                    {activeItems.map((item) => (
                      <div key={item.id} className="animate-in slide-in-from-top-2 duration-200">
                        
                        {/* 1. TITLE BLOCK (Same for both) */}
                        {item.type === 'title' && (
                          <div className="bg-white p-4 border-2 border-gray-300 rounded-lg space-y-3 hover:border-green-500 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-2">
                                <input 
                                  type="text" 
                                  placeholder="Enter title here..." 
                                  value={item.title}
                                  onChange={(e) => handleSetupChange(item.id, 'title', e.target.value)}
                                  className="w-full text-2xl font-bold uppercase border-b-2 border-transparent hover:border-gray-200 focus:border-green-600 outline-none transition-colors py-1 text-gray-800"
                                />
                                <div className="bg-gray-50 p-3 rounded border border-gray-200 flex gap-2">
                                  <textarea 
                                    placeholder="Enter description..." 
                                    value={item.description}
                                    onChange={(e) => handleSetupChange(item.id, 'description', e.target.value)}
                                    className="w-full text-sm text-gray-600 bg-transparent outline-none resize-none font-medium"
                                    rows={2}
                                  />
                                </div>
                              </div>
                              <button 
                                onClick={() => removeSetupBlock(item.id)}
                                className="text-red-500 hover:text-red-700 hover:scale-110 transition-transform ml-4"
                              >
                                <FaTrash size={14} />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* 2. COURSE CHOICE BLOCK (Fixed - Only in Interview) */}
                        {item.type === 'course' && (
                          <div className="bg-white p-6 border border-gray-300 rounded-lg shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-2">
                                  1st Choice Course <span className="text-red-600">*</span>
                                </label>
                                <div className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-xs font-bold text-gray-400 uppercase shadow-inner">
                                  SELECT YOUR FIRST CHOICE
                                </div>
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-2">
                                  2nd Choice Course <span className="text-red-600">*</span>
                                </label>
                                <div className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-xs font-bold text-gray-400 uppercase shadow-inner">
                                  SELECT YOUR SECOND CHOICE
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 3. QUESTION BLOCK */}
                        {item.type === 'question' && (
                          <div className="bg-white p-4 border-2 border-gray-300 rounded-lg space-y-4 hover:border-blue-500 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <input 
                                  type="text" 
                                  placeholder="Enter question here..." 
                                  value={item.question}
                                  onChange={(e) => handleSetupChange(item.id, 'question', e.target.value)}
                                  className="w-full text-sm border-b border-gray-300 outline-none focus:border-blue-600 transition-colors py-1 placeholder:text-gray-400"
                                />
                              </div>
                              <button 
                                onClick={() => removeSetupBlock(item.id)}
                                className="text-red-500 hover:text-red-700 hover:scale-110 transition-transform ml-4"
                              >
                                <FaTrash size={14} />
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 items-end">
                              <div>
                                {/* --- BCET: TYPE DROPDOWN --- */}
                                {setupTab === 'BCET' ? (
                                  <div className="flex-1">
                                    <div className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-1">Question Type</div>
                                    <select 
                                      value={item.questionType} 
                                      onChange={(e) => handleSetupChange(item.id, 'questionType', e.target.value)}
                                      className="w-full text-xs border border-gray-300 rounded px-3 py-2 outline-none text-gray-700 font-bold bg-white"
                                    >
                                      <option value="text">Text</option>
                                      <option value="multipleChoice">Multiple Choice</option>
                                    </select>
                                  </div>
                                ) : (
                                  // --- INTERVIEW: JUST A LABEL ---
                                  <div className="border-b-2 border-gray-300 py-2">
                                    <span className="text-sm text-gray-400 italic">Answer field (Text)</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <div className="flex-1">
                                  {/* --- BCET: REMOVE TARGET. INTERVIEW: SHOW TARGET --- */}
                                  {setupTab === 'Interview' && (
                                    <>
                                      <div className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-1">Target</div>
                                      <select 
                                        value={item.target} 
                                        onChange={(e) => handleSetupChange(item.id, 'target', e.target.value)}
                                        className="w-full text-xs border border-gray-300 rounded px-3 py-2 outline-none text-gray-700 font-bold bg-white"
                                      >
                                        <option value="All">All Applicants</option>
                                        <option value="Freshmen">Freshmen Only</option>
                                        <option value="Transferees">Transferees Only</option>
                                      </select>
                                    </>
                                  )}
                                  {setupTab === 'BCET' && <div className="h-8"></div> /* Spacer */}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <div className="flex-1">
                                  <div className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-1">Points</div>
                                  <input 
                                    type="text" 
                                    placeholder="0" 
                                    value={item.points}
                                    onChange={(e) => handleSetupChange(item.id, 'points', e.target.value)}
                                    className="w-full text-center border-b border-gray-300 outline-none focus:border-blue-600 transition-colors py-1 text-sm font-bold"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* --- BCET: MULTIPLE CHOICE EDITABLE --- */}
                            {setupTab === 'BCET' && item.questionType === 'multipleChoice' && (
                              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 gap-3">
                                <div className="flex justify-between items-center mb-1">
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                        Options (Select correct answer)
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-green-700 font-bold uppercase">
                                        <CheckCircle size={10} /> Correct Key
                                    </div>
                                </div>

                                {(item.options || ['', '', '', '']).map((opt, i) => (
                                  <div key={i} className="flex items-center gap-3">
                                    
                                    {/* Radio Button for Correct Answer - Updated Design */}
                                    <div className="relative flex items-center justify-center">
                                      <input
                                        type="radio"
                                        name={`correct-${item.id}`} // Unique group name per question
                                        checked={item.correctAnswer === i}
                                        onChange={() => setCorrectAnswer(item.id, i)}
                                        className="peer appearance-none w-5 h-5 border-2 border-gray-400 rounded-full checked:border-green-700 cursor-pointer transition-all bg-white"
                                        title="Mark as correct answer"
                                      />
                                      <div className="absolute w-2.5 h-2.5 bg-green-700 rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"></div>
                                    </div>

                                    {/* Text Input for Option */}
                                    <div className="flex-1 relative">
                                       <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">
                                         {String.fromCharCode(65 + i)}.
                                       </span>
                                       <input 
                                         type="text"
                                         value={opt}
                                         onChange={(e) => handleOptionChange(item.id, i, e.target.value)}
                                         placeholder={`Enter Option ${String.fromCharCode(65 + i)}`}
                                         className="w-full bg-gray-50 border border-gray-300 rounded px-3 pl-8 py-2 text-sm focus:border-green-600 outline-none transition-colors"
                                       />
                                    </div>
                                  </div>
                                ))}

                                {/* Add Option Button */}
                                <div>
                                    <button
                                        onClick={() => handleAddOption(item.id)}
                                        className="flex items-center gap-2 text-xs font-bold text-green-700 hover:text-green-800 transition-colors uppercase mt-2"
                                    >
                                        <FaPlus size={10} /> Add Option
                                    </button>
                                </div>
                              </div>
                            )}

                            {/* --- BCET: TEXT ANSWER KEY --- */}
                             {setupTab === 'BCET' && item.questionType === 'text' && (
                               <div className="mt-4 pt-4 border-t border-gray-100">
                                  <div className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-2 flex items-center gap-1">
                                    <CheckCircle size={10} /> Correct Answer(s)
                                  </div>
                                  <div className="relative">
                                    <input 
                                      type="text"
                                      value={item.textKeys || ''}
                                      onChange={(e) => handleSetupChange(item.id, 'textKeys', e.target.value)}
                                      placeholder="Enter correct answer text..."
                                      className="w-full bg-green-50/50 border border-green-200 uppercase rounded px-3 py-2 text-sm focus:border-green-600 outline-none transition-colors text-green-800 font-medium"
                                    />
                                  </div>
                                  <div className="mt-1 text-[10px] text-gray-400 italic">
                                    Applicants must match this text to receive full points.
                                  </div>
                               </div>
                            )}

                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Empty State */}
                    {activeItems.length === 0 && (
                      <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <div className="text-gray-400 mb-2">No questions added yet</div>
                        <div className="text-sm text-gray-500">Click the ADD button above to start building your assessment</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-100 px-6 py-4 border-t border-gray-300 flex justify-end gap-3">
              <button 
                onClick={() => setIsSetupModalOpen(false)}
                className="px-6 py-2.5 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg text-sm font-bold uppercase transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => { 
                  alert("Setup Saved Successfully!"); 
                  setIsSetupModalOpen(false); 
                }}
                className="px-8 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-lg text-sm font-bold uppercase shadow-md transition-colors"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- INTERVIEW MODAL --- */}
      {isModalOpen && selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-[#f0f4f8] w-full max-w-6xl rounded-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">

            <div className="bg-green-700 px-8 py-6 border-b border-gray-400 shrink-0 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-white">Interview Response</h2>
                <div className="flex gap-4 mt-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  <span className="flex items-center  text-white gap-1"><User size={14}/> {selectedApplicant.name}</span>
                  <span className="flex items-center text-white gap-1"><Calendar size={14}/> {selectedApplicant.date}</span>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-300 hover:text-black text-4xl">&times;</button>
            </div>
            <div className="p-8 overflow-y-auto space-y-6">
              
              {/*Course Choices Display */}
              <div className="bg-white px-8 py-6 rounded-xl border border-gray-200 shadow-sm mb-2">
                 <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Course Preferences</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">First Choice</label>
                        <div className="text-lg font-bold text-gray-700">{selectedApplicant.responses.choices?.first || "N/A"}</div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Second Choice</label>
                        <div className="text-lg font-bold text-gray-700">{selectedApplicant.responses.choices?.second || "N/A"}</div>
                    </div>
                 </div>
              </div>

              {selectedApplicant.responses.interview.map((item, i) => (
                <div key={i} className="bg-white px-8 py-4 rounded-xl border border-gray-200 shadow-sm relative">
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-lg font-bold text-gray-900 max-w-[80%]">{item.q}</div>
                    <div className="flex flex-col items-end">
                      <label className="text-[9px] font-black text-gray-600 uppercase mb-1">Score</label>
                      <input type="number" value={scores[i]} onChange={(e) => handleScoreChange(i, e.target.value)} className="w-16 px-2 py-1 outline-none text-center font-bold text-lg border border-gray-200 rounded"/>
                    </div>
                  </div>
                  <textarea readOnly value={item.a} className="w-full px-5 py-3 bg-white border border-gray-400 rounded-xl italic text-gray-800 leading-relaxed shadow-inner focus:outline-none resize-none" rows={3}/>
                </div>
              ))}
              <div className="bg-white px-8 py-4 rounded-xl border border-gray-200 shadow-lg text-center">
                <div className="text-xs font-black text-gray-600 uppercase tracking-[0.2em] mb-2">Total Score Percentage</div>
                <div className={`text-4xl font-black transition-colors ${isPassing ? 'text-green-600' : 'text-red-600'}`}>{totalScore}%</div>
              </div>
            </div>
            <div className="px-8 py-4 bg-white border-t border-gray-400 flex justify-center gap-6 shrink-0">
              <button onClick={() => openDecisionModal("passed", "interview")} className="flex items-center gap-2 px-12 py-4 bg-green-700 text-white font-black uppercase text-xs rounded-xl shadow-xl hover:bg-green-800"><CheckCircle size={18}/> Passed</button>
              <button onClick={() => openDecisionModal("failed", "interview")} className="flex items-center gap-2 px-12 py-4 bg-red-600 text-white font-black uppercase text-xs rounded-xl shadow-xl hover:bg-red-700"><XCircle size={18}/> Failed</button>
            </div>
          </div>
        </div>
      )}

      {/* --- NOTIFICATION MODAL --- */}
      {isMessageModalOpen && selectedApplicant && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className={`p-6 text-white flex items-center gap-3 ${decisionType === 'passed' ? 'bg-green-700' : 'bg-red-600'}`}>
              <Send size={20} />
              <h3 className="font-bold uppercase tracking-widest">Notification Preview</h3>
            </div>
            
            <div className="p-8 space-y-4">
               
               {/* --- CLICKABLE ADMISSION SLIP ATTACHMENT --- */}
               {decisionContext === "bcet" && decisionType === "passed" && (
                 <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between shadow-sm cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => setIsSlipPreviewOpen(true)}>
                    <div className="flex items-center gap-3">
                         <div className="bg-white p-2 rounded text-red-600 border border-gray-200 shadow-sm"><FileText size={20}/></div>
                         <div>
                             <div className="text-sm font-bold text-gray-800">Admission Slip.pdf</div>
                             <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Click to Preview</div>
                         </div>
                    </div>
                    <button className="text-[10px] font-bold bg-white border border-blue-300 px-3 py-1.5 rounded shadow-sm text-blue-700">
                         View
                    </button>
                 </div>
               )}

               <textarea value={editableMessage} onChange={(e) => setEditableMessage(e.target.value)} rows={8} className="w-full bg-gray-50 p-4 rounded-xl border border-gray-300 text-gray-700 text-sm leading-relaxed focus:outline-none focus:border-gray-500 resize-none shadow-inner"/>
            </div>
            <div className="p-6 bg-gray-50 flex justify-end gap-4 border-t">
              <button onClick={() => setIsMessageModalOpen(false)} className="px-6 py-2 text-gray-500 font-bold uppercase text-xs">Cancel</button>
              <button onClick={handleFinalDecision} className={`px-10 py-3 rounded-lg text-white font-black uppercase text-xs ${decisionType === 'passed' ? 'bg-green-700' : 'bg-red-600'}`}>Send Email</button>
            </div>
          </div>
        </div>
      )}

      {/* --- ADMISSION SLIP PREVIEW MODAL --- */}
      {isSlipPreviewOpen && selectedApplicant && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
             <div className="bg-white w-[1000px] h-[700px] rounded shadow-2xl overflow-hidden flex flex-col relative">
                
                {/* Close Button */}
                <button 
                  onClick={() => setIsSlipPreviewOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors z-10"
                >
                  <XCircle size={24} />
                </button>

                {/* SLIP CONTENT - A4 Ratio Simulation */}
                <div className="flex-1 p-6 flex flex-col border-8 border-gray-100 m-4">
                    
                    {/* Header with Logos */}
                    <div className="flex justify-between items-center mb-8 border-b-2 border-black pb-4 px-2">
                        
                        {/* Left: BTECH Logo */}
                        <div className="w-24 h-24 flex items-center justify-center shrink-0">
                             <img src="/img/btech.png" alt="BTECH Logo" className="w-full h-full object-contain"/> 
                        </div>

                        {/* Center: Text */}
                        <div className="text-center flex-1 px-4">
                            <div className="text-3xl font-black text-green-700 tracking-[0.1em] mb-1">BTECH</div>
                            <div className="text-sm font-bold text-gray-700 uppercase tracking-[0.3em]">Institute of Information Technology and Innovation</div>
                            <div className="text-xs font-bold text-gray-500 uppercase pt-2 tracking-[0.3em]">Academic Year 2025-2026</div>                  
                            <div className="mt-4 text-xl font-bold uppercase border-2 border-black inline-block px-4 py-1">Admission Slip</div>
                        </div>

                        <div className="w-24 h-24 flex items-center justify-center shrink-0">
                             <img src="/img/iiti.png" alt="IITI Logo" className="w-full h-full object-contain"/>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-4 flex-1 px-4"> 
                        <div className="flex justify-between border-b border-gray-300 pb-2">
                             <span className="text-xs font-bold text-gray-500 uppercase">Applicant ID</span>
                             <span className="text-sm font-bold font-mono">{selectedApplicant.id}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300 pb-2">
                             <span className="text-xs font-bold text-gray-500 uppercase">Applicant Name</span>
                             <span className="text-sm font-bold uppercase">{selectedApplicant.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300 pb-2">
                             <span className="text-xs font-bold text-gray-500 uppercase">Applicant Type</span>
                             <span className="text-sm font-bold uppercase">{selectedApplicant.type}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300 pb-2">
                             <span className="text-xs font-bold text-gray-500 uppercase">Course</span>
                             <span className="text-sm font-bold uppercase">{selectedApplicant.responses.choices?.first}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300 pb-2">
                             <span className="text-xs font-bold text-gray-500 uppercase">Contact Number</span>
                             <span className="text-sm font-bold uppercase">{selectedApplicant.contactNumber}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300 pb-2">
                             <span className="text-xs font-bold text-gray-500 uppercase">Address</span>
                             <span className="text-sm font-bold uppercase">{selectedApplicant.address}</span>
                        </div>


                         {/* Scores Block */}
                         <div className="mt-8 bg-gray-50 p-4 border border-gray-200 rounded">
                            <div className="text-m font-bold mb-4 text-green-700 uppercase">Assessment Results</div>
                             <div className="flex justify-between mb-2">
                                <span className="text-xs pl-3 font-bold text-gray-500 uppercase">Interview Score</span>
                                <span className="text-sm font-bold">{totalScore}%</span>
                             </div>
                             <div className="flex justify-between">
                                <span className="text-xs pl-3 font-bold text-gray-500 uppercase">BCET Score</span>
                                <span className="text-sm font-bold">{calculateBcetScore(selectedApplicant)} / {selectedApplicant.responses.bcet?.length}</span>
                             </div>
                         </div>

                         <div className="mt-4 text-sm text-center text-gray-600">Present this printed slip to the Registrar's Office to finalize your enrollment.</div>
                    </div>
                </div>
             </div>
          </div>
      )}
    </div>
  );
}