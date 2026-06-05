import { useState } from "react";
import EntryForm from "./components/EntryForm";
import History from "./components/History";
import Charts from "./components/Charts";
import Observations from "./components/Observations";
import Settings from "./components/Settings";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("Entry");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "Entry":
        return <EntryForm />;
      case "History":
        return <History />;
      case "Observations":
        return <Observations />;
      case "Settings":
        return <Settings />;
      default:
        return <EntryForm />;
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

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6">
        {renderActiveTab()}
      </div>

      {/* Right charts panel */}
      <div className="w-80 border-l flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b">
          <p className="text-sm font-semibold text-muted-foreground">Trends</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <Charts />
        </div>
      </div>
    </div>
  );
}

export default App;
