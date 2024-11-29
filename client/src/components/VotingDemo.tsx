import { useState, useEffect } from "react";
import { VSpaceVote, Ballot } from "../lib/vspacevote";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export function VotingDemo() {
  const [vote, setVote] = useState("");
  const [ballots, setBallots] = useState<Ballot[]>([]);
  const [system, setSystem] = useState<VSpaceVote | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initializeSystem = async () => {
      const votingSystem = await VSpaceVote.initialize();
      setSystem(votingSystem);
    };
    initializeSystem();
  }, []);

  const handleVote = async () => {
    if (!system) {
      toast({
        title: "Error",
        description: "Voting system not initialized",
        variant: "destructive"
      });
      return;
    }

    if (!vote.trim()) {
      toast({
        title: "Error",
        description: "Please enter a vote",
        variant: "destructive"
      });
      return;
    }

    try {
      const ballot = await system.castVote(vote.trim());
      setBallots([...ballots, ballot]);
      setVote("");

      toast({
        title: "Success",
        description: "Vote cast successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cast vote",
        variant: "destructive"
      });
    }
  };

  const handleTally = async () => {
    if (!system) return;

    try {
      const tally = await system.tallyVotes(ballots);
      const results = Array.from(tally.entries())
        .map(([option, count]) => `${option}: ${count} votes`)
        .join('\n');

      toast({
        title: "Vote Tally",
        description: <pre className="mt-2 whitespace-pre-wrap">{results}</pre>
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to tally votes",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cast Your Vote</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              value={vote}
              onChange={(e) => setVote(e.target.value)}
              placeholder="Enter your vote"
              className="flex-1"
            />
            <Button onClick={handleVote}>Cast Vote</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ballot Box</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ballots.map((ballot, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border bg-slate-50"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">Vote: {ballot.vote}</span>
                  <span className="text-sm text-slate-500">
                    Ballot #{index + 1}
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-500 break-all">
                  <div>Randomness: {ballot.randomness}</div>
                  <div>Signature: {ballot.signature}</div>
                </div>
              </div>
            ))}

            {ballots.length > 0 && (
              <Button 
                onClick={handleTally}
                variant="secondary"
                className="w-full"
              >
                Tally Votes
              </Button>
            )}

            {ballots.length === 0 && (
              <div className="text-center text-slate-500">
                No votes cast yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
