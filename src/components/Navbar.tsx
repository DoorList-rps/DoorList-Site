import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/lovable-uploads/336614b9-911c-41d0-91e8-a09a6168c0f2.png" alt="DoorList Logo" className="h-8" />
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/investments" className="text-doorlist-navy hover:text-doorlist-salmon transition-colors">
              Investments
            </Link>
            <Link to="/sponsors" className="text-doorlist-navy hover:text-doorlist-salmon transition-colors">
              Sponsors
            </Link>
            <Link to="/about" className="text-doorlist-navy hover:text-doorlist-salmon transition-colors">
              About
            </Link>
            <Link
              to="/contact"
              className="px-6 py-2 bg-doorlist-salmon text-white rounded-full hover:bg-opacity-90 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;