import { useState } from "react";
import { useEntries } from "./hooks/useEntries";
import EntryForm from "./components/EntryForm";
import History from "./components/History";
import { WeightChart, BpChart, EnergyChart } from "./components/Charts";
import Observations from "./components/Observations";
import Settings from "./components/Settings";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("Entry");
  const { entries, refresh } = useEntries();

  const renderActiveTab = () => {
    switch (activeTab) {
      case "Entry":
        return <EntryForm onEntryAdded={refresh} />;
      case "History":
        return <History />;
      case "Observations":
        return <Observations />;
      case "Settings":
        return <Settings />;
      default:
        return <EntryForm onEntryAdded={refresh} />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Left nav */}
      <nav className="w-40 border-r flex flex-col gap-1 p-3 bg-card">
        <p className="text-sm font-semibold text-muted-foreground px-2 py-2">healthy</p>
        <Separator className="mb-1" />
        <Button
          variant={activeTab === "Entry" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("Entry")}
        >
          Entry
        </Button>
        <Button
          variant={activeTab === "History" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("History")}
        >
          History
        </Button>
        <Button
          variant={activeTab === "Observations" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("Observations")}
        >
          Observations
        </Button>
        <Button
          variant={activeTab === "Settings" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("Settings")}
        >
          Settings
        </Button>
      </nav>

      {/* Main content — 2×2 grid */}
      <div className="flex-1 grid grid-cols-2 grid-rows-2 overflow-hidden">
        <div className="overflow-y-auto p-4 border-b border-r">
          {renderActiveTab()}
        </div>

        <div className="flex flex-col overflow-hidden border-b">
          <div className="px-4 py-1 border-b shrink-0">
            <p className="text-xs font-semibold text-muted-foreground">Weight</p>
          </div>
          <div className="flex-1 overflow-hidden px-2 py-1">
            <WeightChart entries={entries} />
          </div>
        </div>

        <div className="flex flex-col overflow-hidden border-r">
          <div className="px-4 py-1 border-b shrink-0">
            <p className="text-xs font-semibold text-muted-foreground">Blood Pressure</p>
          </div>
          <div className="flex-1 overflow-hidden px-2 py-1">
            <BpChart entries={entries} />
          </div>
        </div>

        <div className="flex flex-col overflow-hidden">
          <div className="px-4 py-1 border-b shrink-0">
            <p className="text-xs font-semibold text-muted-foreground">Energy Level</p>
          </div>
          <div className="flex-1 overflow-hidden px-2 py-1">
            <EnergyChart entries={entries} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
