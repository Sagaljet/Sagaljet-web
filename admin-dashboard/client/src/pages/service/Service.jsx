import React from 'react'
import { AiOutlineHome } from 'react-icons/ai'
import { MdKeyboardArrowRight } from 'react-icons/md'

const services = [
  {
    title: 'Software Development',
    subject:
      'Partner with us to unlock the potential of innovative software solutions. We focus on understanding your unique business challenges and developing custom software that integrates seamlessly with your operations.',
    img: 'data-encryption-QUCF9E5.png',
  },
  {
    title: 'Website',
    subtitle: 'Development',
    subject:
      'Unlock the potential of your online presence with visually stunning and user-friendly websites designed to attract and engage your target audience. Our team specializes in creating impactful online experiences that drive customer engagement and turn your visitors into loyal customers, boosting your business growth.',
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
      "Transform your brand's presence with strategic digital marketing and innovative branding solutions. SkillUp enables you to engage your audience and boost online visibility for exceptional results.",
    img: '/homepage/digital-icon.png',
  },
  {
    title: 'Cybersecurity',
    subtitle: 'Services',
    subject:
      'Protect your business with comprehensive cybersecurity services tailored to your needs. SkillUp safeguards your digital assets, ensuring security and resilience against evolving threats.',
    img: '/homepage/cyber-icon.png',
  },
  {
    title: 'Graphic Design',
    subtitle: '',
    subject:
      'Bring your vision to life with innovative graphic design solutions from SkillUp. We create visually stunning materials that captivate your audience and enhance your brand identity.',
    img: '/homepage/graphic-icon.png',
  },
]

const ServiceCard = ({ service, large = false }) => (
  <div
    className={`bg-[#F3F3F3] w-full rounded-3xl drop-shadow-xl shadow-[#B6B6B6] p-6 flex flex-col justify-between ${
      large ? 'h-full w-full' : ' w-full h-[325px]'
    }`}
  >
    <div>
      <h2 className="font-sora text-2xl md:text-3xl font-bold pb-2 text-[#132431]">
        {service.title} <br /> {service.subtitle}
      </h2>
      <p className="text-opacity-75  text-[#0B1825] font-light text-sm md:text-base">
        {service.subject}
      </p>
    </div>
    <div className="flex justify-between items-center mt-4">
      <div className="flex items-center justify-center bg-[#FED2D5] border-2 border-[#132431] rounded-full w-16 h-16 md:w-20 md:h-20">
        <img
          src={service.img}
          alt={service.title}
          className="w-10 h-10 md:w-12 md:h-12"
        />
      </div>
      <Link to={'/contact'}>
        <button className="border-[#B6B6B6] border-b flex items-center group">
          <span className="font-bold cursor-pointer">contact us</span>
          <MdKeyboardArrowRight className="transform transition-transform duration-200 group-hover:translate-x-3" />
        </button>
      </Link>
    </div>
  </div>
)

export default function Component() {
  return (
    <div className=" w-full bg-white">
      {/* Hero Section */}
      <div className="relative w-full h-[16rem] ">
        <div className="absolute inset-0">
          <img
            src="/SERVICIES.jpg"
            alt="SERVICIES"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#080808] opacity-70"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold text-center font-sora mb-8">
            Services
          </h1>

          <div className="bg-white/10 rounded-[10px] px-4 py-2 md:px-6 md:py-4 flex items-center justify-center space-x-3">
            <AiOutlineHome className="text-white text-lg" />
            <a
              href="/"
              className="text-white text-sm md:text-base hover:text-gray-300 font-sora font-normal"
            >
              Home
            </a>
            <MdKeyboardArrowRight className="text-gray-400 text-lg" />
            <span className="text-red-500 text-sm md:text-base font-sora font-normal">
              Services
            </span>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12 font-sora text-[#132431]">
          Our services
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
          <ServiceCard service={services[0]} large />
          <div className="grid grid-cols-1 gap-6 md:gap-8">
            <ServiceCard service={services[1]} />
            <ServiceCard service={services[2]} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10 mt-6 md:mt-8 lg:mt-10">
          {services.slice(3).map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative w-full py-16 md:py-20 lg:py-24 bg-gradient-to-r from-[#0B1825] to-[#004584]">
        <div
          className="absolute inset-0 opacity-70 bg-cover bg-center"
          style={{
            backgroundImage: "url('/src/assets/EmpowerYourDigital.png')",
          }}
        />

        <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#d9d9d9] leading-tight mb-4 md:mb-6">
            Empower Your Digital Future with
            <br className="hidden md:block" />
            SkillUp's Expert Solutions.
          </h2>

          <p className="text-lg md:text-xl font-bold text-white/[0.74] leading-7 md:leading-8 mb-8 md:mb-10">
            Unlock your potential with customized IT solutions, from software
            <br className="hidden md:block" />
            development to digital marketing
          </p>

          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
            <Link to={'/allprojects'}>
              <button className="bg-[#f91c2e] hover:bg-transparent border-white/[0.34] hover:border duration-500 text-white font-semibold text-base md:text-lg rounded-md px-6 py-3">
                Get Started
              </button>
            </Link>
            <Link to={'/contact'}>
              <button className="border  hover:bg-[#D71727] duration-500 border-white/[0.34] bg-transparent text-[#efefef] font-bold text-base md:text-lg rounded-md px-6 py-3">
                contact us
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
