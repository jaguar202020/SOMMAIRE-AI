"use client";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { NavigationControls } from "./navigation-controls";
import ProgressBar from "./progress-bar";
import { parseSection, splitSummaryIntoSections } from "@/utils/summary-helper";
import ContentSection from "./content-section";
import { MotionDiv } from "../common/motion-wrapper";

const SectionTitle = ({ title }: { title: string }) => {
  return (
    <div className="flex flex-col gap-2 mb-6 sticky top-0 pt-2 pb-4 bg-background/80 backdrop-blur-xs z-10">
      <div className="text-3xl lg:text-4xl font-bold text-center flex items-center justify-center gap-2">
        {title}
      </div>
    </div>
  );
};

export function SummaryViewer({ summary }: { summary: string }) {
  const [currentSection, setCurrentSection] = useState(0);

  const handleNext = () =>
    setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1));

  const handlePrevious = () =>
    setCurrentSection((prev) => Math.max(prev - 1, 0));

  const sections = splitSummaryIntoSections(summary).map(parseSection);

  return (
    <Card className="relative h-[500px] w-full overflow-hidden rounded-3xl border border-rose-500/10 bg-linear-to-br from-background via-background/95 to-rose-500/5 px-2 shadow-2xl backdrop-blur-lg sm:h-[600px] lg:h-[700px] xl:w-[600px]">
      <ProgressBar sections={sections} currentSection={currentSection} />

      <MotionDiv
        key={currentSection}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        exit={{ opacity: 0 }}
        className="scrollbar-hide h-full overflow-y-auto pb-20 pt-12 sm:pb-24 sm:pt-16"
      >
        <div className="px-4 sm:px-6">
          <SectionTitle title={sections[currentSection]?.title || ""} />
          <ContentSection points={sections[currentSection]?.points || []} />
        </div>
      </MotionDiv>

      <NavigationControls
        currentSection={currentSection}
        totalSections={sections.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSectionSelect={setCurrentSection}
      />
    </Card>
  );
}
