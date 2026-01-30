import { useNavigate, Link, useLocation } from "react-router-dom";

export default function Header({ username = "admin" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    navigate("/");
  };

  const getNavClass = (path) => {
    return location.pathname === path
      ? "bg-white text-green-700 px-4 py-1 rounded"
      : "text-white hover:bg-white hover:text-green-700 px-4 py-1 rounded transition";
  };

  return (
    <header className="bg-green-700 text-white">
      {/* TOP BAR */}
      <div className="flex justify-between items-center px-6 py-3">
        <div className="flex items-center gap-3">
          <img src="/img/btech.png" alt="BTECH" className="h-12 w-12" />
          <img src="/img/iiti.png" alt="IITI" className="h-12 w-12" />
          <h1 className="font-bold font-sans text-2xl">
            BTECH – INSTITUTE OF INFORMATION TECHNOLOGY AND INNOVATION
          </h1>
        </div>

        <div className="flex items-center gap-9">
          <i className="fa-regular fa-bell text-2xl cursor-pointer"></i>
          <div className="flex items-center gap-2 text-xl">
            <i className="fa-solid fa-user"></i>
            <span className="text-m font-medium">{username}</span>
          </div>
          <i
            className="fa-solid fa-right-from-bracket text-2xl cursor-pointer"
            onClick={logout}
            title="Logout"
          ></i>
        </div>
      </div>
       <div className="w-full border-t border-white/40 opacity-60" aria-hidden></div>
      {/* NAV BAR */}
      <nav className="w-full ">
    
        <ul className="px-6 py-3 flex gap-4 font-semibold text-sm md:text-base lg:text-xl tracking-wide transition-all duration-300">
          <li>
            <Link to="/dashboard" className={getNavClass('/dashboard')}>Dashboard</Link>
          </li> 
          <li>
            <Link to="/applications" className={getNavClass('/applications')}>Applications</Link>
          </li>        
          <li>
            <Link to="/assesment" className={`${getNavClass('/admin_exam')} ml-auto`}>Assessment</Link>
          </li>   
          <li>
            <Link to="/admin_admission" className={getNavClass('/admin_admission')}>Admissions</Link>
          </li>     

          <li>
            <Link to="/settings" className={getNavClass('/settings')}>Settings</Link>
          </li>

        </ul>
      </nav>
    </header>
  );
}
