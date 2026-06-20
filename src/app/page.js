import Hero from "@/components/Hero";
import Statistics from "@/components/Statistics";
import Testimonials from "@/components/Testimonials";
import WhyChooseUs from "@/components/WhyChooseUs";

export default function Home() {
  const mockStatsData = {
    totalStartups: 320,
    totalCollaborators: 1450,
    activeOpportunities: 84
  };
  return (
    <div>
      <Hero />
      <Statistics stats={mockStatsData}/>
      <WhyChooseUs />
      <Testimonials />
    </div>
  );
}
