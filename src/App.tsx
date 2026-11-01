import React, { useEffect } from "react";
import { ConflictModal } from "./components/conflicts/ConflictModal";
import { FolderTree } from "./components/explorer/FolderTree";
import { Header } from "./components/layout/Header";
import { InspectorDrawer } from "./components/layout/InspectorDrawer";
import { Sidebar } from "./components/layout/Sidebar";
import { ModeSwitcher } from "./components/modes/ModeSwitcher";
import { OnboardingModal } from "./components/onboarding/OnboardingModal";
import { TransferHub } from "./components/transfers/TransferHub";
import { fetchSystemCapabilities } from "./lib/ipc";
import { useStrataStore } from "./stores/useStrataStore";

export const App: React.FC = () => {
  const setCapabilities = useStrataStore((state) => state.setCapabilities);

  useEffect(() => {
    fetchSystemCapabilities().then((caps) => {
      setCapabilities(caps);
    });
  }, [setCapabilities]);

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-strata-bg text-slate-100">
      {/* Column 1: Left Cloud Remote Navigation */}
      <Sidebar />

      {/* Column 2: Main Center Workspace + Bottom Live Transfer Hub */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <ModeSwitcher />
        <FolderTree />
        <TransferHub />
      </div>

      {/* Column 3: Right Policy & VFS Inspector */}
      <InspectorDrawer />

      {/* Modals */}
      <ConflictModal />
      <OnboardingModal />
    </div>
  );
};

export default App;
