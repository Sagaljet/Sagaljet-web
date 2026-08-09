import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { MdMailOutline, MdOutlineCall } from 'react-icons/md'
import emailjs from '@emailjs/browser'
export default function Contact() {
  const form = useRef(null)
  const [isLoading, setIsLoading] = useState(false) // Loading state
  const [statusMessage, setStatusMessage] = useState('') // Success/Error state

  const toastId = 'email-notification'

  const sendEmail = (e) => {
    e.preventDefault()
    if (form.current) {
      setIsLoading(true)
      emailjs
        .sendForm(
          'service_8qzbxbg',
          'template_i4ftlfx',
          form.current,
          'YKxpXgUFgrrXiHFQN'
        )
        .then(
          (result) => {
            console.log(result.text)
            setStatusMessage('Message successfully sent!')
            toast.success('Message sent successfully!', { id: toastId })
          },
          (error) => {
            console.error('Error:', error.text)
            setStatusMessage('Failed to send message.')
            toast.error('Message sending failed.', { id: toastId })
          }
        )
        .finally(() => {
          setIsLoading(false) // Reset loading state
          form.current.reset() // Reset form fields
        })
    }
  }

  return (
    <div className="w-full h-auto font-inter bg-[url('/homepage/contact-bg.png')] bg-cover bg-center bg-[#03234C] pt-4 md:pt-10 pb-10 lg:pt-28 lg:pb-24 ">
      <div className="custom-sm:w-[380px] md:w-[80%] lg:w-[95%] custom-lg:w-[1180px] h-auto py-10 lg:p-16 mx-auto bg-[#222631] rounded-3xl  shadow-lg">
        <div className="flex flex-col lg:flex-row gap-10 md:gap-0  items-center justify-between">
          {/* Form Section */}
          <form
            ref={form}
            onSubmit={sendEmail}
            className="w-full custom-sm:w-[380px] md:w-[450px] p-4 md:p-0"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 mt-5 md:mt-0">
              <input
                type="text"
                name="company_name"
                placeholder="Company Name"
                className="bg-[#222631] border-2 border-[#dbc5ff3a] rounded-xl text-gray-300 p-5"
                required
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                className="bg-[#222631] border-2 border-[#dbc5ff3a] rounded-xl text-gray-300 p-5"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <input
                type="email"
                name="company_email"
                placeholder="Company Email"
                className="bg-[#222631] border-2 border-[#dbc5ff3a] rounded-xl text-gray-300 p-5"
                required
              />
              <input
                type="text"
                name="company_phone"
                placeholder="Company Phone"
                className="bg-[#222631] border-2 border-[#dbc5ff3a] rounded-xl text-gray-300 p-5"
              />
            </div>
            <div>
              <textarea
                name="message"
                placeholder="Your message"
                className="bg-[#222631] border-2 w-full resize-none border-[#dbc5ff3a] rounded-xl text-gray-300 h-32 p-5 mb-8"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-[#F91C2E] hover:bg-red-600 text-white rounded-xl py-4"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>
            {statusMessage && (
              <p className="mt-4 text-gray-300">{statusMessage}</p>
            )}
          </form>

          {/* Info Section */}
          <div className="text-white custom-sm:w-[380px] md:w-[520px] h-[400px] md:py-4 md:pl-16 p-4 lg:border-l border-gray-700">
            <div>
              <h2 className="text-sm font-semibold mb-5">GET IN TOUCH</h2>
              <h1 className="text-4xl md:text-[52px] md:leading-[3rem] font-bold text-white mb-4">
                Let's talk about your project
              </h1>
              <p className="text-sm leading-[2] text-white text-opacity-60">
                we're excited to partner with you on your growth journey.
                contact us today to uncover tailored solutions designed for your
                unique business needs.
              </p>
            </div>
            <div className="border-t border-gray-700 my-10"></div>
            <div className="flex justify-between items-center ">
              <div className="flex items-center gap-2 md:gap-4">
                <div className="flex justify-center items-center bg-white  w-8 h-8 custom-sm:w-10 custom-sm:h-10 md:w-14 md:h-14  rounded-xl">
                  {/* Replace with actual Mail Icon SVG */}
                  <MdMailOutline
                    color="#020202"
                    className="text-[25px] custom-sm:text-3xl"
                  />
                </div>
                <div>
                  <p className="font-semibold custom-sm:text-xl">Our Email</p>
                  <p className="text-[11px] custom-sm:text-sm text-opacity-60 text-white">
                    info@skillup.so
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <div className="flex justify-center items-center bg-[#F91C2E] w-8 h-8 custom-sm:w-10 custom-sm:h-10 md:w-14 md:h-14  rounded-xl">
                  {/* Replace with actual Mail Icon SVG */}
                  <MdOutlineCall
                    color="white"
                    className="text-[25px] custom-sm:text-3xl"
                  />
                </div>
                <div>
                  <p className="font-semibold custom-sm:text-xl">Our Phone</p>
                  <p className="text-[11px] custom-sm:text-sm text-opacity-60 text-white">
                    +251 909 294667
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
