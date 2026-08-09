"use client";

export function PortfolioGrid() {
  const column1Images = [
    {
      title: "Trusted Brands",
      color: "bg-pink-50",
      query: "brand logos collection",
      url: "https://i.pinimg.com/736x/00/5a/7e/005a7e9a0b5d26c10179acaaf4594dda.jpg",
    },
    {
      title: "Brand Building",
      color: "bg-blue-900",
      query: "brand building materials",
      url: "https://i.pinimg.com/736x/b1/42/2e/b1422e3ff70bca36e4ab838b29ee5228.jpg",
    },
    {
      title: "Website Development",
      color: "bg-blue-900",
      query: "website development coding",
      url: "https://i.pinimg.com/1200x/81/f2/4f/81f24f098f21c9e9dc954663ffab50f5.jpg",
    },
  ];

  const column2Images = [
    {
      title: "Siraad Campaign",
      color: "bg-pink-50",
      query: "marketing campaign materials",
      url: "https://i.pinimg.com/736x/f8/88/bd/f888bdb652a46cc684079b8244bb6806.jpg",
    },
    {
      title: "Event Highlights",
      color: "bg-blue-900",
      query: "event photography highlights",
      url: "https://i.pinimg.com/736x/e0/f1/f4/e0f1f4325109fd7c8309364790c5307e.jpg",
    },
    {
      title: "Website Development",
      color: "bg-gray-100",
      query: "web design sketches",
      url: "https://i.pinimg.com/736x/28/1c/32/281c32d8ca41ae6ded55ef2f3851c410.jpg",
    },
  ];

  const column3Images = [
    {
      title: "Branding Excellence",
      color: "bg-pink-50",
      query: "branding portfolio showcase",
      url: "https://i.pinimg.com/1200x/e0/fe/46/e0fe46b92c1b5385a564b1015f1ee2dc.jpg",
    },
    {
      title: "Creative Work",
      color: "bg-lime-400",
      query: "creative design work",
      url: "https://i.pinimg.com/736x/18/0c/7f/180c7f8a71accb85a125c9a6997afe64.jpg",
    },
    {
      title: "Creative Groove",
      color: "bg-black",
      query: "creative studio branding",
      url: "https://i.pinimg.com/1200x/86/37/57/863757741d7f5f35c76747ed64c5b639.jpg",
    },
  ];

  return (
    <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 h-full">
        {/* Column 1 - Slides Up */}
        <div className="relative overflow-hidden">
          <div className="animate-portfolio-slide-up space-y-2 sm:space-y-3 md:space-y-4">
            {[...column1Images, ...column1Images].map((item, index) => (
              <div
                key={index}
                className={`${item.color} rounded-lg p-3 sm:p-4 md:p-6 h-[180px] sm:h-[220px] md:h-[280px] flex items-center justify-center`}
              >
                <img
                  src={item.url || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Column 2 - Slides Down */}
        <div className="relative overflow-hidden">
          <div
            className="animate-portfolio-slide-down space-y-2 sm:space-y-3 md:space-y-4"
            style={{ transform: "translateY(-50%)" }}
          >
            {[...column2Images, ...column2Images].map((item, index) => (
              <div
                key={index}
                className={`${item.color} rounded-lg p-3 sm:p-4 md:p-6 h-[180px] sm:h-[220px] md:h-[280px] flex items-center justify-center`}
              >
                <img
                  src={item.url || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Column 3 - Slides Up */}
        <div className="relative overflow-hidden hidden lg:block">
          <div className="animate-portfolio-slide-up space-y-2 sm:space-y-3 md:space-y-4">
            {[...column3Images, ...column3Images].map((item, index) => (
              <div
                key={index}
                className={`${item.color} rounded-lg p-3 sm:p-4 md:p-6 h-[180px] sm:h-[220px] md:h-[280px] flex items-center justify-center`}
              >
                <img
                  src={item.url || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
