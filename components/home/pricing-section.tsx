import { cn } from "@/lib/utils";
import {
  containerVariants,
  itemVariants,
  pricingPlans,
} from "@/utils/constants";
import { ArrowRight, CheckIcon } from "lucide-react";
import Link from "next/link";
import { MotionDiv, MotionSection } from "../common/motion-wrapper";

interface PriceType {
  name: string;
  price: number;
  description: string;
  items: string[];
  id: string;
  paymentLink: string;
  priceId: string;
}

const listVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", damping: 20, stiffness: 100 },
  },
};

const PricingCard = ({
  name,
  price,
  description,
  items,
  id,
  paymentLink,
}: PriceType) => {
  const isConfigured = Boolean(paymentLink);

  return (
    <MotionDiv
      variants={listVariant}
      whileHover={{ scale: 1.02 }}
      className="relative w-full max-w-lg hover:scale-105 hover:transition-all duration-300"
    >
      <div
        className={cn(
          "relative z-10 flex h-full flex-col gap-4 rounded-2xl border-[1px] border-gray-500/20 p-8 lg:gap-8",
          id === "pro" && "gap-5 border-2 border-rose-500"
        )}
      >
        <MotionDiv
          variants={listVariant}
          className="flex items-center justify-between gap-4"
        >
          <div>
            <p className="text-lg font-bold capitalize lg:text-xl">{name}</p>
            <p className="mt-2 text-base-content/80">{description}</p>
          </div>
        </MotionDiv>

        <MotionDiv variants={listVariant} className="flex gap-2">
          <p className="text-5xl font-extrabold tracking-tight">Rs {price}</p>
          <div className="mb-[4px] flex flex-col justify-end">
            <p className="text-xs font-semibold uppercase">INR</p>
            <p className="text-xs">/month</p>
          </div>
        </MotionDiv>

        <MotionDiv
          variants={listVariant}
          className="space-y-2.5 text-base leading-relaxed flex-1/2"
        >
          {items.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <CheckIcon size={18} />
              <span>{item}</span>
            </li>
          ))}
        </MotionDiv>

        <MotionDiv
          variants={listVariant}
          className="flex w-full justify-center space-y-2"
        >
          <Link
            href={isConfigured ? paymentLink : "#pricing"}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-full border-2 py-2 text-white",
              isConfigured
                ? "bg-linear-to-r from-rose-800 to-rose-500 hover:from-rose-500 hover:to-rose-800"
                : "cursor-not-allowed bg-gray-400",
              id === "pro"
                ? "border-rose-900"
                : "border-rose-100 from-rose-400 to-rose-500"
            )}
            aria-disabled={!isConfigured}
          >
            {isConfigured ? "Buy Now" : "Configure Plan"}{" "}
            <ArrowRight size={18} />
          </Link>
        </MotionDiv>
      </div>
    </MotionDiv>
  );
};

export default function PricingSection() {
  return (
    <MotionSection
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative overflow-hidden "
      id="pricing"
    >
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:pt-12 lg:py-24">
        <MotionDiv
          variants={itemVariants}
          className="flex w-full items-center justify-center pb-12"
        >
          <h2 className="mb-8 text-xl font-bold uppercase text-rose-500">
            Pricing
          </h2>
        </MotionDiv>
        <div className="relative flex flex-col items-center justify-center gap-8 lg:flex-row lg:items-stretch">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} {...plan} />
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
