import { MdKeyboardArrowRight } from 'react-icons/md'
import { Link } from 'react-router-dom'

const services = [
  {
    title: 'Software Development',
    subject:
      'partner with us to unlock the potential of innovative software solutions. we focus on understanding your unique business challenges and developing custom software that integrates seamlessly with your operations',
    img: '/homepage/software-icon.png',
  },
  {
    title: 'Website',
    subtitle: 'Development',
    subject:
      'unlock the potential of your online presence with visually stunning and user-friendly website designed to attract and engage your target audience, our team specializes in creating impactful online experiences that drive customer engagement and turn your visitors into loyal customers, boosting your business growth',
    img: '/homepage/website-icon.png',
  },
  {
    title: 'Mobile Applications',
    subtitle: 'Development',
    subject:
      'Launch mobile apps that enhance customer experiences and streamline operations. We build intuitive, feature-rich apps for both Android and iOS platforms.',
    img: '/homepage/website-icon.png',
  },
  {
    title: 'Branding & Digital',
    subtitle: 'Marketing',
    subject:
      'transform your brand’s presence with strategic digital marketing and innovative branding solutions. skillup enables you to engage your audience and boost online visibility for exceptional results',
    img: '/homepage/digital-icon.png',
  },
  {
    title: 'Cybersecurity',
    subtitle: 'Services',
    subject:
      'protect your business with comprehensive cybersecurity services tailored to your needs, skillup safeguards your digital assets ensuring security and resilience against evolving threats.',
    img: '/homepage/cyber-icon.png',
  },
  {
    title: 'Graphic Design ',
    subtitle: '',
    subject:
      'bring your vision to life with innovative graphic design solutions from skillup. we create visually stunning materials that captivate your audience and enhance your brand identity',
    img: '/homepage/graphic-icon.png',
  },
]

const DesktopServices = () => {
  return (
    <main>
      {/* Two Parts of Part 1 */}
      <div className="flex gap-[50px]  flex-col md:flex-row items-center">
        <div className="md:w-[500px] md:h-[650px] w-[290px]  custom-sm:w-[380px] custom-md:w-[460px] h-[500px] flex flex-col justify-between  p-10 bg-[#17345A] border border-white  rounded-3xl">
          <div>
            <h2 className="font-sora text-3xl font-medium md:pb-1 pb-6">
              {services[0].title} <br /> {services[0].subtitle}
            </h2>
            <p className="text-opacity-75 text-white">{services[0].subject}</p>
          </div>
          <div className="flex justify-between items-center md:items-end">
            <div>
              <img
                className="w-1/2 h-1/2 md:w-auto md:h-auto"
                src="/homepage/software-icon.png"
                alt=""
              />
            </div>
            <Link to={'/contact'}>
              <button className="border-white border-b flex items-center gap-2 group">
                <span>Contact us</span>
                <MdKeyboardArrowRight className="transform transition-transform duration-200 group-hover:translate-x-3" />
              </button>
            </Link>
          </div>
        </div>
        <div className="flex  px-12 flex-col gap-[50px] md:gap-0  md:h-[650px] justify-between">
          <div className="md:w-[555px] md:h-[335px] w-[290px] h-[500px] custom-sm:w-[380px] custom-md:w-[460px] p-10 flex flex-col justify-between bg-[#17345A] rounded-3xl border border-white">
            <div>
              <h2 className="font-sora text-3xl font-medium md:pb-1 pb-6">
                {services[1].title} <br /> {services[1].subtitle}
              </h2>

              <p className="text-opacity-75 text-white text-justify md:text-left">
                {services[1].subject}
              </p>
            </div>
            <div className="flex justify-between items-center md:items-end">
              <div>
                <img
                  className="w-1/2 h-1/2 md:w-auto md:h-auto"
                  src={services[1].img}
                  alt=""
                />
              </div>
              <Link to={'/contact'}>
                <button className="border-white border-b flex items-center gap-2 group">
                  <span>Contact us</span>
                  <MdKeyboardArrowRight className="transform transition-transform duration-200 group-hover:translate-x-3" />
                </button>
              </Link>
            </div>
          </div>
          <div className="md:w-[555px] md:h-[300px] w-[290px] h-[500px] custom-sm:w-[380px] custom-md:w-[460px] p-10 flex flex-col justify-between bg-[#17345A] rounded-3xl border border-white">
            <div>
              <h2 className="font-sora text-3xl font-medium md:pb-1 pb-6">
                {services[2].title} <br /> {services[2].subtitle}
              </h2>
              <p className="text-opacity-75 text-white text-justify md:text-left">
                {services[2].subject}
              </p>
            </div>
            <div className="flex justify-between items-center md:items-end">
              <div>
                <img
                  className="w-1/2 h-1/2 md:w-auto md:h-auto"
                  src={services[2].img}
                  alt=""
                />
              </div>
              <Link to={'/contact'}>
                <button className="border-white border-b flex items-center gap-2 group">
                  <span>Contact us</span>
                  <MdKeyboardArrowRight className="transform transition-transform duration-200 group-hover:translate-x-3" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Two Parts of Part 2 */}
      <div className="flex  flex-col md:flex-row gap-[50px] items-center py-10">
        <div className="md:w-[360px] md:h-[350px] w-[290px] h-[500px] custom-sm:w-[380px] custom-md:w-[460px] p-10 md:py-5 flex flex-col justify-between bg-[#17345A] border border-white rounded-3xl">
          <div>
            <h2 className="font-sora text-3xl font-medium md:pb-1 pb-6">
              {services[3].title} <br /> {services[3].subtitle}
            </h2>
            <p className="text-opacity-75 text-white">{services[3].subject}</p>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <img
                className="w-1/2 h-1/2 md:w-auto md:h-auto"
                src={services[3].img}
                alt=""
              />
            </div>
            <Link to={'/contact'}>
              <button className="border-white border-b flex items-center gap-2 group">
                <span>Contact us</span>
                <MdKeyboardArrowRight className="transform transition-transform duration-200 group-hover:translate-x-3" />
              </button>
            </Link>
          </div>
        </div>
        <div className="md:w-[353px] md:h-[350px] w-[290px] h-[500px] custom-sm:w-[380px] custom-md:w-[460px] p-10 md:py-5 flex flex-col justify-between bg-[#17345A] border border-white rounded-3xl">
          <div>
            <h2 className="font-sora text-3xl font-medium md:pb-1 pb-6">
              {services[4].title} <br /> {services[4].subtitle}
            </h2>
            <p className="text-opacity-75 text-white">{services[4].subject}</p>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <img
                className="w-1/2 h-1/2 md:w-auto md:h-auto"
                src={services[4].img}
                alt=""
              />
            </div>
            <Link to={'/contact'}>
              <button className="border-white border-b flex items-center gap-2 group">
                <span>Contact us</span>
                <MdKeyboardArrowRight className="transform transition-transform duration-200 group-hover:translate-x-3" />
              </button>
            </Link>
          </div>
        </div>
        <div className="md:w-[353px] md:h-[350px] w-[290px] h-[500px] custom-sm:w-[380px] custom-md:w-[460px] p-10 md:py-5 flex flex-col justify-between bg-[#17345A] border border-white rounded-3xl">
          <div>
            <h2 className="font-sora text-3xl font-medium md:pb-1 pb-6">
              {services[5].title} <br /> {services[5].subtitle}
            </h2>
            <p className="text-opacity-75 text-white">{services[5].subject}</p>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <img
                className="w-1/2 h-1/2 md:w-auto md:h-auto"
                src={services[5].img}
                alt=""
              />
            </div>
            <Link to={'/contact'}>
              <button className="border-white border-b flex items-center gap-2 group">
                <span>Contact us</span>
                <MdKeyboardArrowRight className="transform transition-transform duration-200 group-hover:translate-x-3" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default DesktopServices
