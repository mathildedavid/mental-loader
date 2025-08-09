import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ToyBrick, Calendar, Sparkles } from "lucide-react";

interface BabyProfile {
  name: string;
  birthdate: string; // ISO string YYYY-MM-DD
  milestones: string[];
}

const STORAGE_KEY = "mlm.babyProfile";

function computeAge(birthdate?: string) {
  if (!birthdate) return "—";
  const b = new Date(birthdate);
  const now = new Date();
  let months = (now.getFullYear() - b.getFullYear()) * 12 + (now.getMonth() - b.getMonth());
  if (now.getDate() < b.getDate()) months -= 1;
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  const parts = [] as string[];
  if (years > 0) parts.push(`${years}y`);
  if (remMonths >= 0) parts.push(`${remMonths}m`);
  return parts.join(" ");
}

export default function BabyProfileCard() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<BabyProfile>({ name: "", birthdate: "", milestones: [] });
  const [newMilestone, setNewMilestone] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { setProfile(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const age = useMemo(() => computeAge(profile.birthdate), [profile.birthdate]);

  const save = () => {
    toast({ title: "Saved", description: "You've got this, mama. Profile updated!" });
  };

  const addMilestone = () => {
    const m = newMilestone.trim();
    if (!m) return;
    setProfile(p => ({ ...p, milestones: Array.from(new Set([...(p.milestones || []), m])) }));
    setNewMilestone("");
    toast({ title: "Milestone added", description: "Small wins matter. ✨" });
  };

  const removeMilestone = (m: string) => {
    setProfile(p => ({ ...p, milestones: (p.milestones || []).filter(x => x !== m) }));
  };

  return (
    <article className="animate-fade-in">
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-secondary text-secondary-foreground">
              <ToyBrick className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="font-heading text-2xl">Baby Profile</CardTitle>
              <CardDescription>Gentle overview of your little one's details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Baby name</span>
              <Input
                placeholder="e.g., Maya"
                value={profile.name}
                onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Birthdate</span>
              <Input
                type="date"
                value={profile.birthdate}
                onChange={(e) => setProfile(p => ({ ...p, birthdate: e.target.value }))}
              />
            </label>
          </section>

          <section className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Age: <span className="text-foreground font-medium">{age}</span></span>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Milestones</h3>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Rolled over, first smile..."
                value={newMilestone}
                onChange={(e) => setNewMilestone(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') addMilestone(); }}
              />
              <Button onClick={addMilestone} className="hover:scale-105 transition-transform">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.milestones?.length ? (
                profile.milestones.map((m) => (
                  <Badge key={m} variant="secondary" className="gap-2">
                    {m}
                    <button
                      aria-label={`Remove milestone ${m}`}
                      className="ml-1 text-muted-foreground hover:text-foreground"
                      onClick={() => removeMilestone(m)}
                    >
                      ×
                    </button>
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No milestones yet. The first ones are coming soon!</p>
              )}
            </div>
          </section>

          <div className="pt-2">
            <Button onClick={save} className="hover:scale-105 transition-transform">Save profile</Button>
          </div>

          {/* Integration note: Hook these fields to your Flask API endpoints for persistence. */}
        </CardContent>
      </Card>
    </article>
  );
}
