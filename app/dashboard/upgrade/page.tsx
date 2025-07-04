"use client";

import { Check, Zap, MessageCircle, CreditCard, RefreshCw, HelpCircle, Sparkles } from "lucide-react";
import { FiFileText } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useUser } from "@clerk/nextjs";
import useSubsscription from "@/hooks/useSubsscription";
import { useTransition } from "react";
import getStripe from "@/lib/stripe-js";
import { createCheckoutSession } from "@/actions/createCheckoutSession";
import { createStripePortal } from "@/actions/createStripePortal";

const faqs = [
  {
    question: "Can I change plans later?",
    answer: "Absolutely! You can upgrade or downgrade your plan at any time. Changes will be applied at the start of your next billing cycle.",
    icon: <RefreshCw className="h-5 w-5 text-[#4facfe]" />
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! Our Free plan is available indefinitely with no credit card required. Try all the basic features before upgrading.",
    icon: <HelpCircle className="h-5 w-5 text-[#4facfe]" />
  },
  {
    question: "How does the page limit work?",
    answer: "The Free plan limits files to 5-10 pages. The Pro plan has no page limits, so you can upload documents of any length.",
    icon: <MessageCircle className="h-5 w-5 text-[#4facfe]" />
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards including Visa, Mastercard, and American Express. All payments are securely processed through Stripe.",
    icon: <CreditCard className="h-5 w-5 text-[#4facfe]" />
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel your subscription at any time. Your account will remain active until the end of your current billing period.",
    icon: <Check className="h-5 w-5 text-[#4facfe]" />
  },
];

const features = [
  {
    title: "Unlimited Documents",
    description: "Upload and process as many PDFs as you need with our Pro plan.",
    icon: <FiFileText className="h-6 w-6 text-white" />,
    color: "from-[#00f2fe] to-[#4facfe]"
  },
  {
    title: "Priority Support",
    description: "Get faster response times and dedicated support with our Pro plan.",
    icon: <MessageCircle className="h-6 w-6 text-white" />,
    color: "from-[#a18cd1] to-[#fbc2eb]"
  },
  {
    title: "Advanced AI",
    description: "Access to our most advanced AI models for better understanding and responses.",
    icon: <Zap className="h-6 w-6 text-white" />,
    color: "from-[#ff9a9e] to-[#fad0c4]"
  }
];

export type UserDetails={
  email: string;
  name: string;
}

export default function PricingPage() {

  const { user } = useUser();
  // const router = useRouter();
  const [ isPending, startTransition] = useTransition()

  // using or pulling the custom hook for accessing users subscription status
  const { hasActiveMembership, loading } = useSubsscription();

  const handleUpgrade = async () => {
    if (!user) return;
  
    try {
      startTransition(async () => {
        const stripe = await getStripe();
        if (!stripe) {
          console.error('Stripe failed to initialize');
          return;
        }

        if (hasActiveMembership) {
          const portalUrl = await createStripePortal();
          if (portalUrl) {
            window.location.href = portalUrl;
            return;
          }
        }
  
        // Only proceed to checkout for new subscriptions
        const sessionId = await createCheckoutSession({
          email: user.primaryEmailAddress?.toString() || '',
          name: user.fullName || '',
        });
  
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error('Error redirecting to checkout:', error);
        }
      });
    } catch (error) {
      console.error('Error in handleUpgrade:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-[#f8fafc] to-[#e0f2fe] pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Choose the perfect plan for your needs
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-700">
              Get started with our free plan or unlock the full power of our platform with Pro. No credit card required to start.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-8 max-w-5xl mx-auto px-6 lg:px-8">
          {/* Free Plan */}
          <div className="group relative rounded-3xl bg-white/80 backdrop-blur-sm border border-white/20 p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 group-hover:bg-gradient-to-r group-hover:from-[#00f2fe] group-hover:to-[#4facfe] group-hover:bg-clip-text group-hover:text-transparent transition-all">
                  Free
                </h3>
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 bg-opacity-30">
                  <Check className="w-6 h-6 text-blue-500" />
                </span>
              </div>
              <p className="mt-2 text-gray-600">Perfect for trying out our basic features</p>
              <p className="mt-6">
                <span className="text-5xl font-bold bg-gradient-to-r from-[#00f2fe] to-[#4facfe] bg-clip-text text-transparent">
                  $0
                </span>
                <span className="text-lg font-medium text-gray-500">/month</span>
              </p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Up to 3 PDFs only</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">3-4 questions per PDF</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">5 page limit per file</span>
              </li>
            </ul>
            
            <Button
              className="w-full py-6 text-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg bg-white border-2 border-gray-200 text-gray-800 hover:bg-gray-50"
              variant="outline"
            >
              Get Started
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="group relative rounded-3xl bg-white/80 backdrop-blur-sm border border-white/20 p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ring-2 ring-[#00f2fe] ring-offset-4 ring-offset-white/50">
            <div className="absolute top-10 right-22">
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] px-4 py-1.5 text-sm font-semibold text-white shadow-lg">
                <Sparkles className="mr-1.5 h-4 w-4" />
                Most Popular
              </span>
            </div>
            
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 group-hover:bg-gradient-to-r group-hover:from-[#00f2fe] group-hover:to-[#4facfe] group-hover:bg-clip-text group-hover:text-transparent transition-all">
                  Pro
                </h3>
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#00f2fe] to-[#4facfe] bg-opacity-30">
                  <Zap className="w-6 h-6 text-[#4facfe]" />
                </span>
              </div>
              <p className="mt-2 text-gray-600">For power users who need more</p>
              <p className="mt-6">
                <span className="text-5xl font-bold bg-gradient-to-r from-[#00f2fe] to-[#4facfe] bg-clip-text text-transparent">
                  $5.99
                </span>
                <span className="text-lg font-medium text-gray-500">/month</span>
              </p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Up to 30 PDFs</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Upto 100 questions per PDF</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Ability to delete PDFs</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Advance analytics</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Priority support</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Full power of AI Chat with Memory Recall</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Early access to new features</span>
              </li>
            </ul>
            {/* Upgrade button */}
            <Button
              onClick={handleUpgrade}
              disabled={isPending||loading}
              className="w-full py-6 text-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg bg-gradient-to-r from-[#00f2fe] to-[#4facfe] hover:from-[#4facfe] hover:to-[#00f2fe] text-white"
              variant="default"
            >
              {isPending||loading?"Loading...":hasActiveMembership?"Manage Subscription":"Upgrade Now"}
            </Button>
          </div>
        </div>

      {/* Features Section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to be productive
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              All plans include powerful features to help you get the most out of our platform.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10`}></div>
                  <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="relative z-10 text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="relative z-10 text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gradient-to-br from-white via-[#f8fafc] to-[#e0f2fe] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl divide-y divide-gray-200">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center mb-12">
              Frequently asked questions
            </h2>
            <div className="mt-10 space-y-6 divide-y divide-gray-200">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index + 1}`} 
                    className="rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-sm transition-all hover:shadow-md border border-white/30 hover:border-[#4facfe]/30"
                  >
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {faq.icon}
                        </div>
                        <span className="font-medium text-gray-900">
                          {faq.question}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pl-11 text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
              Ready to get started?
            </h2>
            <p className="mx-auto max-w-xl text-lg leading-8 text-gray-600 mb-8">
              Join thousands of users who trust our platform for their document processing needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-[#00f2fe] to-[#4facfe] hover:from-[#4facfe] hover:to-[#00f2fe] text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                size="lg"
              >
                Get Started for Free
              </Button>
              <Button 
                onClick={() => window.location.href = '/aboutus'}
                variant="outline" 
                className="px-8 py-6 text-lg font-semibold border-2 border-gray-200 hover:border-[#4facfe] text-gray-700 hover:text-[#4facfe] transition-all"
                size="lg"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}