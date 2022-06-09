import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="bg-white px-2 sm:px-4 py-2.5 drop-shadow">
      <div className="container flex flex-wrap justify-between items-center mx-auto">
        <button onClick={() => navigate('/')} className="flex items-center">
          <span className="self-center text-xl font-semibold whitespace-nowrap text-black">Simple Kanban</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;