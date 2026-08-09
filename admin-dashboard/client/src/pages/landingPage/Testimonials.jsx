import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from 'react-icons/io'

const testimonialsData = [
  {
    id: 1,
    text: "SkillUp Technology delivered exceptional solutions that improved our operations at Aafi Health Services. Their professionalism, expertise, and communication were outstanding. We're grateful for their dedication and look forward to future collaborations.",
    rating: 4.5,
    name: 'Dr. Mahamed Areis Tahir',
    role: 'CEO & Founder of Aaﬁ Health Services',
    image: '/homepage/todobo.jpg',
  },
  {
    id: 2,
    text: "During the Siraad campaign, SkillUp impressed us by attracting new customers and enhancing our company's image through modern and effective digital marketing strategies. We sincerely thank the entire SkillUp team for their exceptional work.",
    rating: 5,
    name: 'Abdibasid bedri ismail ',
    role: 'Ceo & co-founder hayaan realstate',
    image: '/homepage/shan.jpg',
  },
  {
    id: 3,
    text: 'On behalf of Daray Agribusiness, we extend our deepest gratitude to SkillUp, a premier technology platform, for providing us with a comprehensive design and branding solution. Thank you to the entire SkillUp team.',
    rating: 5.0,
    name: 'Abdihakim ibrahim',
    role: 'General Manager, Darey Agribusiness',
    image: '/homepage/sideed.jpg',
  },
  {
    id: 4,
    text: "SkillUp has been instrumental in our success in integrating Dugsiiye with the Ebirr mobile money service. Their expertise in software development made a significant impact on this project. The team was professional, responsive, and dedicated to delivering high-quality results. We couldn't have asked for a better partner.",
    rating: 4.5,
    name: 'Mohamud Osman',
    role: 'Ceo of Dugsiiye',
    image: '/homepage/lix.jpg',
  },
]

const Testimonials = () => {
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 !== 0
    const totalStars = 5

    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, index) => (
          <IoIosStar key={index} size="20px" color="#FFB800" />
        ))}
        {halfStar && <IoIosStarHalf size="20px" color="#FFB800" />}
        {[...Array(totalStars - fullStars - (halfStar ? 1 : 0))].map(
          (_, index) => (
            <IoIosStarOutline key={index} size="20px" color="#FFB800" />
          )
        )}
      </div>
    )
  }

  return (
    <div className="lg:px-16 bg-[#03234C] w-full text-white overflow-x-hidden">
      <div
        className="
       "
      >
        <h2 className="font-sora text-center lg:text-left md:text-5xl text-4xl font-bold py-16">
          Testimonials
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(auto-fit,_minmax(330px,_1fr))] justify-items-center items-center w-full gap-x-1 gap-y-6  pb-16">
        {testimonialsData.map(({ id, text, rating, name, role, image }) => (
          <div
            key={id}
            className="flex flex-col items-center justify-center justify-items-center lg:justify-items-start gap-6 px-[30px] py-10 w-[290px] custom-sm:w-[360px] md:w-[320px] lg:w-[390px] custom-lg:md:w-[330px] max-h-[490px] md:h-[490px] rounded-lg border border-white"
          >
            <p className="text-center leading lg:leading-[1.8]">{`"${text}"`}</p>
            {/* Rating */}
            {renderStars(rating)}
            {/* User */}
            <div className="flex flex-col gap-1 justify-center items-center">
              <img
                className="w-12 h-12 rounded-full object-cover"
                src={image}
                alt={name}
              />
              <h4 className="font-semibold text-lg">{name}</h4>
              <small className="text-white text-opacity-60">{role}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Testimonials
