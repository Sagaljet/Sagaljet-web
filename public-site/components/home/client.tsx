import ClientsPageClient from "./clients-section";

export default function LogosPage() {
  return (
    <div className=" bg-background text-foreground">
      {/* Header with theme toggle */}

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20 lg:py-24">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 lg:mb-20">
          <h2 className="text-3xl md:text-4xl  lg:text-5xl font-extrabold mb-4 md:mb-6 text-balance">
            Trusted by Industry Leaders
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground text-pretty">
            We're proud to work with some of the world's most innovative
            companies and cutting-edge technologies
          </p>
        </div>

        {/* Logos Slider */}
        <div className="lg:py-8 md:py-12">
          <ClientsPageClient />
        </div>
      </section>
    </div>
  );
}
