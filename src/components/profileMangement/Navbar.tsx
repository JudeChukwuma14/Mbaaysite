
import { Link } from "react-router-dom";
import MobileNavbar from "../ui/MobileNavbar";

const Navbar = () => {
  return (
    <nav className="bg-[#F3F4F6] w-full fixed z-50 flex items-center justify-between px-6 py-4 lg:px-10">
      <Link to="/" className="flex items-center gap-1">
        <img
          src="https://mbaaysite-6b8n.vercel.app/assets/MBLogo-spwX6zWd.png"
          alt=""
          width={70}
          height={70}
        />
      </Link>

      <div className="flex items-start justify-between gap-5 lg:hidden">
        <MobileNavbar />
      </div>
    </nav>
  );
};

export default Navbar;
