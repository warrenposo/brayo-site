import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import testimonial1 from "@/assets/testimonial-1.jpg";
import testimonial2 from "@/assets/testimonial-2.jpg";
import testimonial3 from "@/assets/testimonial-3.jpg";

const testimonials = [
  {
    name: "Thabo Mokoena",
    location: "Singapore",
    flag: "🇸🇬",
    quote: "Finally, a platform that prioritizes speed and security. No forms, no hassle - just pure trading efficiency that scales with my needs.",
    image: testimonial2,
  },
  {
    name: "Olivia Sarah",
    location: "United Kingdom",
    flag: "🇬🇧",
    quote: "merovianscapital transformed my trading experience. The instant exchange and real-time market data help me make profitable decisions every time.",
    image: testimonial1,
  },
  {
    name: "James Mitchell",
    location: "United States",
    flag: "🇺🇸",
    quote: "The real-time market insights and intuitive interface make merovianscapital stand out. I've seen consistent growth since I started using it.",
    image: testimonial3,
  },
];

const TestimonialsSection = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const t = testimonials[active];

  return (
    <section id="testimonials" className="py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-black text-center text-[#2563EB] mb-12">
          What Others Say About Us
          <div className="w-16 h-1 bg-[#FACC15] mx-auto mt-4" />
        </h2>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center"
            >
              <div className="relative mb-10">
                <div className="w-32 h-32 rounded-full border-4 border-[#FACC15] p-1 shadow-[0_0_30px_rgba(250,204,21,0.2)]">
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover rounded-full shadow-2xl" />
                </div>
              </div>

              <div className="flex gap-2 mb-8">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={24} className="fill-[#FACC15] text-[#FACC15] drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" />
                ))}
              </div>

              <blockquote className="text-2xl md:text-3xl font-medium text-white/80 italic mb-10 leading-relaxed max-w-3xl">
                "{t.quote}"
              </blockquote>

              <div className="space-y-2">
                <p className="text-2xl font-black text-white">{t.name}</p>
                <div className="flex items-center justify-center gap-2 text-white/40 font-bold uppercase tracking-widest text-xs">
                  <span>{t.flag}</span>
                  <span>{t.location}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-4 mt-16">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-1 transition-all duration-500 rounded-full ${i === active ? "w-12 bg-[#FACC15]" : "w-6 bg-white/10 hover:bg-white/20"
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
