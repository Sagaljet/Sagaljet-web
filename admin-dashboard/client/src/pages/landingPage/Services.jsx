import { MdKeyboardArrowRight } from 'react-icons/md'
import TabletServices from './TabletServices'
import { useEffect, useState } from 'react'
import DesktopServices from './DesktopServices'
import { Link } from 'react-router-dom'

const Services = () => {
  // Initialize the state with the current window width
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    // Function to update the state with the current width
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    // Add event listener on window resize
    window.addEventListener('resize', handleResize)

    // Cleanup event listener when component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, []) // Empty array means this runs once on component mount and cleans up on unmount

  return (
    <div className="flex justify-center w-full">
      <div
        className={`w-full ${
          windowWidth >= 1180 ? 'px-36' : 'px-6 lg:px-36'
        } bg-[#03234C] text-white flex flex-col items-center lg:items-center`}
      >
        <h2 className="font-sora text-4xl font-bold pt-16 pb-14 text-center md:text-left lg:text-center">
          Our services
        </h2>
        {windowWidth > 1124 || windowWidth < 768 ? (
          <DesktopServices />
        ) : (
          <TabletServices />
        )}
        {/* <ServicesDemo /> */}

        <footer className="flex items-center justify-center gap-3 pb-14 text-sm md:text-base">
          Our services
          <Link to="/service">
            <button className="border-white border-b flex items-center group">
              <span className=" cursor-pointer">View More</span>
              <MdKeyboardArrowRight className="transform transition-transform duration-200 group-hover:translate-x-3" />
            </button>
          </Link>
        </footer>
      </div>
    </div>
  )
}

export default Services
