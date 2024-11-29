import type { Express } from "express";
import { VSpaceVote } from "../client/src/lib/vspacevote";
import { PropertyTester } from "../client/src/lib/propertyTesting";

let system: VSpaceVote;

// Initialize the system asynchronously
(async () => {
  system = await VSpaceVote.initialize();
})();

export function registerRoutes(app: Express) {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Cast vote endpoint
  app.post("/api/vote", (req, res) => {
    try {
      const { vote } = req.body;
      if (!vote) {
        return res.status(400).json({ error: "Vote is required" });
      }

      const ballot = system.castVote(vote);
      res.json({ ballot });
    } catch (error) {
      res.status(500).json({ error: "Failed to cast vote" });
    }
  });

  // Verify ballot endpoint
  app.post("/api/verify", (req, res) => {
    try {
      const { ballot } = req.body;
      if (!ballot) {
        return res.status(400).json({ error: "Ballot is required" });
      }

      const isValid = system.verifyBallot(ballot);
      res.json({ isValid });
    } catch (error) {
      res.status(500).json({ error: "Failed to verify ballot" });
    }
  });

  // Tally votes endpoint
  app.post("/api/tally", async (req, res) => {
    try {
      const { ballots } = req.body;
      if (!Array.isArray(ballots)) {
        return res.status(400).json({ error: "Ballots array is required" });
      }

      const tally = await system.tallyVotes(ballots);
      res.json({ tally: Object.fromEntries(tally) });
    } catch (error) {
      res.status(500).json({ error: "Failed to tally votes" });
    }
  });

  // Run security tests endpoint
  app.post("/api/test", async (req, res) => {
    try {
      const tester = new PropertyTester();
      const results = await tester.runAllTests();
      res.json({ results });
    } catch (error) {
      res.status(500).json({ error: "Failed to run tests" });
    }
  });

  // Generate verification report endpoint
  app.post("/api/report", (req, res) => {
    try {
      const { testResults } = req.body;
      if (!testResults) {
        return res.status(400).json({ error: "Test results are required" });
      }

      // Generate report data
      const reportData = {
        timestamp: new Date().toISOString(),
        testResults,
        summary: {
          total: testResults.length,
          passed: testResults.filter((r: any) => r.passed).length,
          failed: testResults.filter((r: any) => !r.passed).length
        }
      };

      res.json({ report: reportData });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate report" });
    }
  });
}
