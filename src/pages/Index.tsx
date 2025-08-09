import BabyProfileCard from "@/components/BabyProfileCard";
import FoodLogCard from "@/components/FoodLogCard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="w-full border-b bg-gradient-to-b from-secondary/60 to-background">
        <div className="container py-8">
          <h1 className="text-3xl sm:text-4xl font-heading tracking-tight">Mental Load Manager for New Moms</h1>
          <p className="mt-2 text-muted-foreground">A warm little helper to keep baby care organized and celebrate your wins. You’ve got this, mama.</p>
        </div>
      </header>

      <main className="container py-6">
        <section aria-label="Dashboard" className="grid gap-6 md:grid-cols-2">
          <BabyProfileCard />
          <FoodLogCard />
        </section>
      </main>
    </div>
  );
};

export default Index;
