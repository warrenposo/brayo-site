import { useState } from "react";
import { Star } from "lucide-react";
import testimonial1 from "@/assets/testimonial-1.jpg";
import testimonial2 from "@/assets/testimonial-2.jpg";
import testimonial3 from "@/assets/testimonial-3.jpg";

const testimonials = [
  {
    name: "Olivia Sarah",
    location: "🇬🇧 United Kingdom",
    quote: "Merovian transformed my trading experience. The instant exchange and real-time market data help me make profitable decisions every time.",
    image: testimonial1,
  },
  {
    name: "Thabo Mokoena",
    location: "🇸🇬 Singapore",
    quote: "Finally, a platform that prioritizes speed and security. No forms, no hassle - just pure trading efficiency that scales with my needs.",
    image: testimonial2,
  },
  {
    name: "James Mitchell",
    location: "🇺🇸 United States",
    quote: "The real-time market insights and intuitive interface make Merovian stand out. I've seen consistent growth since I started using it.",
    image: testimonial3,
  },
];

const TestimonialsSection = () => {
  const [active, setActive] = useState(0);
  const t = testimonials[active];

  return (
    <section id="testimonials" className="py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center text-gradient-blue">
          What Others Say About Us
        </h2>
        <div className="section-divider mb-16" />

        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary mb-6">
            <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} className="fill-primary text-primary" />
            ))}
          </div>

          <p className="text-muted-foreground italic text-lg mb-6">"{t.quote}"</p>
          <p className="text-foreground font-heading font-bold">{t.name}</p>
          <p className="text-muted-foreground text-sm">{t.location}</p>

          <div className="flex gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  i === active ? "bg-primary" : "bg-muted-foreground/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
