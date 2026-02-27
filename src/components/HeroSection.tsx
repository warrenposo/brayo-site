import heroPhone from "@/assets/hero-phone.png";

const HeroSection = () => {
  return (
    <section id="home" className="pt-16 min-h-screen flex items-center">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center md:justify-end">
          <img
            src={heroPhone}
            alt="Merovian trading app on phone"
            className="w-72 md:w-96 drop-shadow-2xl"
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight">
            <span className="text-gradient-blue">Trade</span>{" "}
            <span className="text-foreground">major crypto assets with confidence and clarity.</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg">
            Merovian gives your clients a powerful and clean experience to{" "}
            <span className="text-secondary">buy</span>,{" "}
            <span className="text-secondary">sell</span>, and{" "}
            <span className="text-secondary">track</span>{" "}
            growth with real-time market visibility.
          </p>
          <div className="flex gap-4">
            <button className="px-8 py-3 rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
              Get Started
            </button>
            <button className="px-8 py-3 rounded-md border border-primary text-primary font-semibold hover:bg-primary/10 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
