import {Link} from 'react-router-dom'
import { MdKeyboardArrowRight } from 'react-icons/md'

export default function Banner() {
  return (
    <div className="relative bg-[url('/homepage/banner.svg')] bg-cover bg-center w-full xl:min-h-screen flex flex-col lg:flex-row justify-between items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-12 sm:py-16 md:py-20 lg:py-0 overflow-hidden">
      {/* Content section */}
      <div className="w-full lg:w-1/2 max-w-3xl lg:max-w-none lg:pr-8 xl:pr-16 mb-12 lg:mb-0">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-sora font-semibold leading-tight sm:leading-tight md:leading-tight lg:leading-tight mb-4 sm:mb-6 lg:mb-8">
          Your
          <span className="bg-[#F91C2E] text-white rounded-3xl px-2 py-1 mx-2 inline-block whitespace-nowrap">
            Digital
          </span>
          <br className="hidden lg:block" />
          <span className="relative lg:top-2"> Transformation Partner</span>
        </h2>

        <p className="text-[#0B1133] text-opacity-60 text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 lg:mb-10 max-w-2xl lg:max-w-none">
          Welcome to SkillUp, your trusted partner in technology services and
          East Africa&apos;s leading IT provider. We develop business solutions,
          innovate strategies, and foster sustainable growth in the
          technological landscape.
        </p>

        <Link
          to="/project"
          className="inline-flex items-center gap-2 bg-[#F91C2E] text-white rounded-lg px-6 py-3 lg:px-8 lg:py-4 text-lg lg:text-xl font-semibold transition-all hover:bg-[#D1162B] hover:shadow-lg"
        >
          <span>Get Started</span>
          <MdKeyboardArrowRight className="text-2xl lg:text-3xl" />
        </Link>
      </div>

      {/* Image section */}
      <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 h-[300px] sm:h-[400px] md:h-[500px] lg:h-screen flex items-center justify-center lg:items-end lg:justify-end">
        <img
          src="/ai.png"
          alt="AI Illustration"
          width={700}
          height={700}
          className="w-full h-full max-h-[250px] sm:max-h-[350px] md:max-h-[450px] lg:max-h-none lg:w-auto lg:h-[90%] object-contain lg:object-cover lg:object-right-bottom"
          priority
        />
      </div>
    </div>
  )
}

