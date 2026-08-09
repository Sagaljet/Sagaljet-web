import { Twitter, Linkedin, Youtube, MapPin, Phone, Mail } from 'lucide-react'
import logoSkill from '../../../public/logoSkill.png'
import { MdWhatsapp } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { Facebook } from 'lucide-react'
import footerImg from '../../../public/footer.png'

export default function Footer() {
  const useFull = [
    {
      name: 'Projects',
      link: '/project',
    },
    {
      name: 'About',
      link: '/about',
    },
    {
      name: 'Service',
      link: '/service',
    },
    {
      name: "FAQ's",
      link: '/faq',
    },
  ]

  return (
    <footer
      className="relative overflow-hidden w-full bg-white text-gray-800 py-12 bg-cover bg-center"
      style={{
        backgroundImage: `url(${footerImg})`,
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              <img src={logoSkill} className="w-24" alt="Logo" />
            </h2>
            <p className="mb-4 ml-2">
              We are ready to help your company with the potential for rapid
              growth.
            </p>
            <div className="flex space-x-4 ml-2">
              <a
              target='_blank'
                href={'https://www.facebook.com/skillup09'}
                className="border cursor-pointer border-gray-300 rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="w-5 h-5" />
              </a>
              <a
              target='_blank'
                href={' https://x.com/skillup09?t=nIjALLLK1bnxKuDzKDNyXA&s=09'}
                className="border cursor-pointer border-gray-300 rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="w-5 h-5" />
              </a>
              <a
               target='_blank'
                href={'https://www.linkedin.com/company/skillup09/'}
                className="border cursor-pointer border-gray-300 rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="w-5 h-5" />
              </a>
              <a
              target='_blank'
                href={'https://wa.link/keuvze'}
                className="border cursor-pointer border-gray-300 rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <span className="sr-only">WhatsApp</span>
                <MdWhatsapp className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Useful Links</h3>
            <ul className="space-y-2">
              {useFull.map((item) => (
                <li key={item.link}>
                  <Link
                    to={item.link}
                    className="hover:text-blue-600 text-[#02010183] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

         

          <div>
            <h3 className="text-xl font-semibold mb-4">Our Company</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-[#02010183]">
                <MapPin className="w-5 h-5 mr-2 text-red-500" />
                <span>Jigijga-Ethiopia</span>
              </li>
              <li className="flex items-center text-[#02010183]">
                <Phone className="w-5 h-5 mr-2 text-red-500" />
                <span>+251909294667</span>
              </li>
              <li className="flex items-center text-[#02010183]">
                <Mail className="w-5 h-5 mr-2 text-red-500" />
                <span>info@skillup.so</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
