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
    <section id="learn-more" className="py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center text-gradient-blue">
          Learn More
        </h2>
        <div className="section-divider mb-16" />

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <h3 className="text-2xl font-heading font-bold text-foreground">How Merovian Works</h3>
            <p className="text-muted-foreground leading-relaxed">
              Merovian uses a custodial model with platform-led wallet controls, deposit verification workflows, and clear account visibility designed for retail growth.
            </p>
            <div>
              <h4 className="text-foreground font-heading font-bold mb-2">Simple Process</h4>
              <p className="text-muted-foreground">
                Create account, verify deposits, and access your custodial wallet with full balance visibility.
              </p>
            </div>
            <button className="px-8 py-3 rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
              Get Started
            </button>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {steps.map((step, i) => (
              <AccordionItem
                key={i}
                value={`step-${i}`}
                className="bg-card border border-primary/30 rounded-lg px-6 overflow-hidden"
              >
                <AccordionTrigger className="text-foreground font-heading font-semibold hover:no-underline">
                  {step.title}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {step.content}
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
