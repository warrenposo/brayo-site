const features = [
  {
    title: "Efficiency",
    description: "Trade instantly without barriers. No lengthy forms, no identity verification delays. Access profitable crypto trading 24/7 with maximum speed and minimal friction.",
  },
  {
    title: "Profitable Trading",
    description: "Buy and sell major crypto assets at optimal moments with real-time market data and precision tools for maximum profitability.",
  },
  {
    title: "Full Control",
    description: "Clear account visibility, transparent operations, and scalable infrastructure designed for sustainable growth and success.",
  },
];

const WhySection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center text-gradient-blue">
          Why Merovian?
        </h2>
        <div className="section-divider mb-12" />

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-card border border-border rounded-xl p-8 card-glow hover:border-secondary/40 transition-colors"
            >
              <h3 className="text-lg font-heading font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
