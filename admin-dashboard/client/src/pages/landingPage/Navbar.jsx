import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className="flex items-center border-b mb-2 justify-between px-[172px] py-4 font-inter">
      {/* brand logo */}
      <img src="./skillup logo.svg" alt="" />
      {/* Navigations */}
      <ul className="flex gap-6 text-md text-[#03234c93] items-center">
        <NavLink to={'/'}>Home</NavLink>
        <NavLink to={'/about'}>About Us</NavLink>
        <NavLink to={'/service'}>Services</NavLink>
        <NavLink to={'/project'}>Project</NavLink>
      </ul>
      <div>
        <button className="bg-[#F91C2E] rounded px-10 py-2 text-white font-medium">
          Contact
        </button>
      </div>
    </div>
  )
}

export default Navbar
