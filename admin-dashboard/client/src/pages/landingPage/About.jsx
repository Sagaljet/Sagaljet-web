import { MdKeyboardArrowRight } from 'react-icons/md'
import { Link } from 'react-router-dom'

const About = () => {
  return (
    <div className="relative flex flex-col my-10 items-center px-4 sm:px-6 lg:px-8">
      {/* Background Image */}
      <div className="absolute -bottom-40 left-0 -z-10">
        <img src="/homepage/blur-gradient.png" alt="" />
      </div>

      {/* Main About Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10 items-center">
        <img
          className="w-full h-auto md:w-auto md:h-auto"
          src="/homepage/about-icon.svg"
          alt="About Icon"
        />
        <div className="max-w-full w-[280px] custom-sm:w-[380px] md:w-[600px] lg:w-[550px]">
          <button className="text-[#F91C2E] font-roboto font-semibold mb-2">
            About Us
          </button>
          <h1 className="font-sora font-semibold text-3xl md:text-4xl py-1 md:py-2 lg:py-1">
            Our mission is to empower businesses by optimizing their digital
            landscape.
          </h1>
          <p className="font-roboto text-[#0B1133] text-opacity-60 lg:pb-12 pb-4">
            Skillup offers a comprehensive suite of technology services, from
            software development to digital marketing. We are dedicated to
            enhancing your business operations and driving your success.
          </p>
          <Link to={'/about'}>
            <button className="group flex items-center gap-4 border rounded px-3 py-2 font-medium transition-all duration-300 ease-in-out hover:border-[#0056B3] hover:bg-[#F0F8FF] focus:outline-none focus:ring-2 focus:ring-[#0056B3] focus:ring-opacity-50">
              <span className="text-[#0056B3] text-sm transition-transform duration-300 ease-in-out group-hover:translate-x-1">
                Learn more
              </span>
              <MdKeyboardArrowRight className="text-[#0056B3] transition-all duration-300 ease-in-out group-hover:translate-x-1 group-hover:animate-bounce-right" />
            </button>
          </Link>
        </div>
      </div>

      {/* Marketing Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="max-w-full w-[280px] custom-sm:w-[380px] md:w-[600px] lg:w-[500px] flex flex-col gap-3">
          <h3 className="text-[#F91C2E] font-roboto text-2xl font-semibold">
            Marketing Insights
          </h3>
          <h1 className="font-sora font-semibold text-3xl md:text-4xl">
            Transforming Business with Data-Driven Insights
          </h1>
          <p className="font-roboto text-[#1D2130] text-justify">
            At SkillUp, we provide advanced data analytics that go beyond
            metrics. We deliver actionable insights that empower your business
            to make smarter, faster decisions. Discover how our data-driven
            strategies translate into measurable outcomes that fuel growth,
            efficiency, and long-term client success.
          </p>
        </div>
        <img
          className="w-full h-auto md:w-auto md:h-auto"
          src="/homepage/visual-insights.png"
          alt="Visual Insights"
        />
      </div>
    </div>
  )
}

export default About
