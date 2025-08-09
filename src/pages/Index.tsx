import { useState } from "react";
import BabyProfileCard from "@/components/BabyProfileCard";
import FoodLogCard from "@/components/FoodLogCard";
import BottomTabBar from "@/components/BottomTabBar";

const Index = () => {
  const [activeTab, setActiveTab] = useState("baby");

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="w-full border-b bg-gradient-to-b from-secondary/60 to-background">
        <div className="container py-8">
          <h1 className="text-3xl sm:text-4xl font-heading tracking-tight">Mental Load Manager for New Moms</h1>
          <p className="mt-2 text-muted-foreground">A warm little helper to keep baby care organized and celebrate your wins. You've got this, mama.</p>
        </div>
      </header>

      <main className="container py-6">
        <section aria-label="Dashboard" className="space-y-6">
          {activeTab === "baby" && <BabyProfileCard />}
          {activeTab === "food" && <FoodLogCard />}
        </section>
      </main>

      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;