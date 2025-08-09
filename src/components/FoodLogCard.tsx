import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Apple, Carrot, CheckCircle2, Utensils } from "lucide-react";

const STORAGE_KEY = "mlm.foodsTried";
const TARGET_FOODS = 40;

const SUGGESTIONS = [
  "Avocado", "Apple", "Banana", "Pear", "Peach", "Blueberries", "Strawberries",
  "Sweet Potato", "Carrot", "Peas", "Broccoli", "Zucchini", "Pumpkin",
  "Oatmeal", "Yogurt", "Egg (yolk)", "Chicken", "Turkey", "Lentils"
];

export default function FoodLogCard() {
  const { toast } = useToast();
  const [tried, setTried] = useState<string[]>([]);
  const [inputFood, setInputFood] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { setTried(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tried));
  }, [tried]);

  const addFood = (name: string) => {
    const clean = name.trim();
    if (!clean) return;
    setTried(prev => Array.from(new Set([...prev, capitalize(clean)])));
    setInputFood("");
    toast({ title: "Logged", description: "New food added to baby's tasting journey!" });
  };

  const removeFood = (name: string) => {
    setTried(prev => prev.filter(f => f !== name));
  };

  const progress = useMemo(() => Math.min(100, Math.round((tried.length / TARGET_FOODS) * 100)), [tried.length]);

  const nextUp = useMemo(() => SUGGESTIONS.filter(s => !tried.includes(s)).slice(0, 6), [tried]);

  return (
    <article className="animate-fade-in">
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-secondary text-secondary-foreground">
              <Utensils className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="font-heading text-2xl">Food Introduction Log</CardTitle>
              <CardDescription>Track what baby has tried and explore new tastes</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4" />
                <span>{tried.length} / {TARGET_FOODS} foods tried</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
                <Apple className="h-4 w-4" />
                <Carrot className="h-4 w-4" />
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </section>

          <section className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Add a food (e.g., Avocado)"
                value={inputFood}
                onChange={(e) => setInputFood(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') addFood(inputFood); }}
              />
              <Button onClick={() => addFood(inputFood)} className="hover:scale-105 transition-transform">Add</Button>
            </div>
            {nextUp.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {nextUp.map((f) => (
                  <Button key={f} variant="secondary" size="sm" onClick={() => addFood(f)} className="rounded-full">
                    {f}
                  </Button>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-2">
            <h3 className="font-medium">Tried so far</h3>
            <div className="flex flex-wrap gap-2">
              {tried.length ? (
                tried.map((f) => (
                  <Badge key={f} variant="secondary" className="rounded-full px-3 py-1">
                    {f}
                    <button
                      aria-label={`Remove ${f}`}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                      onClick={() => removeFood(f)}
                    >
                      ×
                    </button>
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No foods yet. When you're ready, start with gentle single-ingredient purées.</p>
              )}
            </div>
          </section>

          {/* Integration note: Replace localStorage with Flask API calls for persistence */}
        </CardContent>
      </Card>
    </article>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
