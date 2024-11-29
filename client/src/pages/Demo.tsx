import { useState } from "react";
import { VotingDemo } from "../components/VotingDemo";
import { ProofVisualization } from "../components/ProofVisualization";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Demo() {
  const [activeTab, setActiveTab] = useState("voting");

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          vSpaceVote Interactive Demo
        </h1>
        <p className="text-slate-600 mt-2">
          Experience the voting system and view formal proofs
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="voting">Voting Demo</TabsTrigger>
          <TabsTrigger value="proofs">Proof Visualization</TabsTrigger>
        </TabsList>

        <TabsContent value="voting">
          <VotingDemo />
        </TabsContent>

        <TabsContent value="proofs">
          <ProofVisualization />
        </TabsContent>
      </Tabs>
    </div>
  );
}
