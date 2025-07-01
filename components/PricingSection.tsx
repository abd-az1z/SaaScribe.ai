import { Button } from "@/components/ui/button";

interface PricingPlan {
  name: string;
  price: string;
  featured: boolean;
  features: string[];
}

export default function PricingSection() {
  const pricingPlans: PricingPlan[] = [
    {
      name: "Free",
      price: "0",
      featured: false,
      features: [
        "Basic PDF Upload",
        "50 Pages per Month",
        "Basic AI Chat",
        "Email Support",
      ],
    },
    {
      name: "Pro",
      price: "9.99",
      featured: true,
      features: [
        "Unlimited PDF Upload",
        "1000 Pages per Month",
        "Advanced AI Chat",
        "Priority Support",
      ],
    },
    {
      name: "Enterprise",
      price: "29.99",
      featured: false,
      features: [
        "Custom Solutions",
        "Unlimited Pages",
        "Dedicated Support",
        "API Access",
      ],
    },
  ];

  return (

    <section 
     className="py-28 px-6 md:px-10 bg-gradient-to-br from-[#e0f2fe] via-[#f0f9ff] to-white">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">
          Pricing Plans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <div key={plan.name}>
              <div
                className={`p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${
                  plan.featured ? "ring-2 ring-[#3b82f6] transform scale-[1.02]" : ""
                }`}
              >
                <h3 className="text-xl font-bold mb-2 text-gray-800">{plan.name}</h3>
                <div className="text-4xl font-bold mb-6 bg-gradient-to-r from-[#00f2fe] to-[#4facfe] bg-clip-text text-transparent">
                  {plan.price === "Custom" ? "Custom" : `$${plan.price}/month`}
                </div>
                <div className="border-t border-gray-100 my-6"></div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex text-slate-600 items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full font-semibold py-4 text-lg ${
                    plan.featured
                      ? "bg-gradient-to-r from-[#00f2fe] to-[#4facfe] hover:from-[#4facfe] hover:to-[#00f2fe] text-white"
                      : "bg-white border-2 border-gray-200 text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {plan.name === "Free" ? "Get Started" : "Choose Plan"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
