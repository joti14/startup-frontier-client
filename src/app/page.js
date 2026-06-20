import Hero from "@/components/Hero";
import Statistics from "@/components/Statistics";

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
    </div>
  );
}
