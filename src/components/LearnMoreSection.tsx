import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const steps = [
  {
    title: "Step 1: Sign Up",
    content: "Create your account and access your personal dashboard instantly.",
  },
  {
    title: "Step 2: Deposit",
    content: "Send crypto to your provided coin address and submit verification details.",
  },
  {
    title: "Step 3: Trade",
    content: "Your wallet balance updates once verified and you can start trading immediately.",
  },
];

const LearnMoreSection = () => {
  return (
    <section id="learn-more" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-black text-center text-[#2563EB] mb-12">
          Learn More
          <div className="w-16 h-1 bg-[#FACC15] mx-auto mt-4" />
        </h2>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <h3 className="text-4xl font-black text-white leading-tight">How Merovian Works</h3>
            <p className="text-white/60 text-lg leading-relaxed">
              Merovian uses a custodial model with platform-led wallet controls, deposit verification workflows, and clear account visibility designed for retail growth.
            </p>
            <div className="space-y-4">
              <h4 className="text-xl font-black text-white uppercase tracking-tighter">Simple Process</h4>
              <p className="text-white/60 text-lg leading-relaxed">
                Create account, verify deposits, and access your custodial wallet with full balance visibility.
              </p>
            </div>
            <button className="h-14 px-10 rounded-xl bg-[#FACC15] text-black font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-yellow-500/20">
              Get Started
            </button>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {steps.map((step, i) => (
              <AccordionItem
                key={i}
                value={`step-${i}`}
                className="bg-[#0F172A] border border-white/5 rounded-2xl px-6 py-2 overflow-hidden shadow-xl"
              >
                <AccordionTrigger className="text-white font-black text-lg hover:no-underline py-4 flex justify-between group">
                  <div className="flex items-center gap-4">
                    <span className="text-[#FACC15]">{step.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-white/60 text-base leading-relaxed pb-6">
                  {step.content}
                  {i === 2 && (
                    <p className="mt-4 pt-4 border-t border-white/5">
                      Once your deposit is confirmed, your balance reflects in real-time. Execute trades with our advanced tools, access live market data, and manage your portfolio with complete transparency.
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default LearnMoreSection;
