import Logo from "../assets/Logo.png";
const Header = () => {
  return (
    <div className=" flex border-[1px solid #197686]">
      <div className="flex justify-center items-center">
        <img src={Logo} alt="Logo" />
        <h5>tiez</h5>
      </div>

      <div className="flex justify-center items-center">
        <li>Events</li>
        <li>My Tickets</li>
        <li>About Project</li>
      </div>

      <div className="flex justify-center items-center">
        <button>My tickets</button>
      </div>
    </div>
  );
};

export default Header;
