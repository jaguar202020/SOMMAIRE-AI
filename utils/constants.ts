
export const pricingPlans = [
  {
    name: "Basic",
    price: 900,
    description: "Perfect for occasional use",
    items: [
      "5 PDF summaries per month",
      "Standard processing speed",
      "Email support",
    ],
    id: "basic",
    paymentLink: process.env.NEXT_PUBLIC_STRIPE_BASIC_PAYMENT_LINK || "",
    priceId: process.env.STRIPE_BASIC_PRICE_ID || "",
  },
  {
    name: "Pro",
    price: 1900,
    description: "For professionals and teams",
    items: [
      "Unlimited PDF summaries",
      "Priority processing",
      "24/7 priority support",
      "Markdown Export",
    ],
    id: "pro",
    paymentLink: process.env.NEXT_PUBLIC_STRIPE_PRO_PAYMENT_LINK || "",
    priceId: process.env.STRIPE_PRO_PRICE_ID || "",
  },
];

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 50,
      duration: 0.8,
    },
  },
};
