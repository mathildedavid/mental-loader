import { Baby, Carrot } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomTabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomTabBar = ({ activeTab, onTabChange }: BottomTabBarProps) => {
  const tabs = [
    { id: "baby", icon: Baby, label: "Baby" },
    { id: "food", icon: Carrot, label: "Food" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <nav className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-3 px-2 transition-colors",
                isActive
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon size={24} className="mb-1" />
              {isActive && (
                <span className="text-xs font-medium">{tab.label}</span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomTabBar;