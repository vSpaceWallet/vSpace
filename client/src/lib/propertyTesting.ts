import fc from "fast-check";
import { VSpaceVote, Ballot } from "./vspacevote";

export interface TestResult {
  name: string;
  passed: boolean;
  executionTime: number;
  counterexample?: any;
}

export class PropertyTester {
  private system: VSpaceVote | null = null;

  constructor() {
    // Initialize system in init method
  }

  private async init() {
    if (!this.system) {
      this.system = await VSpaceVote.initialize();
    }
  }

  async runAllTests(): Promise<TestResult[]> {
    await this.init();
    return [
      await this.testBallotVerification(),
      await this.testTallyCorrectness(),
      await this.testDoubleVotingPrevention(),
      await this.testSignatureValidity(),
      await this.testVotePrivacy(),
      await this.testVerifiability(),
      await this.testAccountability(),
      await this.testCoercionResistance()
    ];
  }

  private async testBallotVerification(): Promise<TestResult> {
    const startTime = performance.now();
    try {
      const property = fc.asyncProperty(
        fc.string(),
        async (vote) => {
          if (!this.system) throw new Error("System not initialized");
          const ballot = await this.system.castVote(vote);
          return await this.system.verifyBallot(ballot);
        }
      );

      await fc.assert(property);
      return {
        name: "Ballot Verification",
        passed: true,
        executionTime: performance.now() - startTime
      };
    } catch (error) {
      return {
        name: "Ballot Verification",
        passed: false,
        counterexample: error,
        executionTime: performance.now() - startTime
      };
    }
  }

  private async testTallyCorrectness(): Promise<TestResult> {
    const startTime = performance.now();
    try {
      const property = fc.asyncProperty(
        fc.array(fc.string(), { minLength: 1, maxLength: 10 }),
        async (votes) => {
          if (!this.system) throw new Error("System not initialized");
          const ballots = await Promise.all(votes.map(v => this.system!.castVote(v)));
          const tally = await this.system.tallyVotes(ballots);
          return votes.every(vote => tally.has(vote));
        }
      );

      await fc.assert(property);
      return {
        name: "Tally Correctness",
        passed: true,
        executionTime: performance.now() - startTime
      };
    } catch (error) {
      return {
        name: "Tally Correctness",
        passed: false,
        counterexample: error,
        executionTime: performance.now() - startTime
      };
    }
  }

  private async testDoubleVotingPrevention(): Promise<TestResult> {
    const startTime = performance.now();
    try {
      const property = fc.asyncProperty(
        fc.string(),
        async (vote) => {
          if (!this.system) throw new Error("System not initialized");
          const ballot1 = await this.system.castVote(vote);
          const ballot2 = await this.system.castVote(vote);
          return ballot1.signature !== ballot2.signature;
        }
      );

      await fc.assert(property);
      return {
        name: "Double Voting Prevention",
        passed: true,
        executionTime: performance.now() - startTime
      };
    } catch (error) {
      return {
        name: "Double Voting Prevention",
        passed: false,
        counterexample: error,
        executionTime: performance.now() - startTime
      };
    }
  }

  private async testSignatureValidity(): Promise<TestResult> {
    const startTime = performance.now();
    try {
      const property = fc.asyncProperty(
        fc.string(),
        async (vote) => {
          if (!this.system) throw new Error("System not initialized");
          const ballot = await this.system.castVote(vote);
          const tamperedBallot = { ...ballot, vote: vote + "_tampered" };
          return !(await this.system.verifyBallot(tamperedBallot));
        }
      );

      await fc.assert(property);
      return {
        name: "Signature Validity",
        passed: true,
        executionTime: performance.now() - startTime
      };
    } catch (error) {
      return {
        name: "Signature Validity",
        passed: false,
        counterexample: error,
        executionTime: performance.now() - startTime
      };
    }
  }

  private async testVotePrivacy(): Promise<TestResult> {
    const startTime = performance.now();
    try {
      const property = fc.asyncProperty(
        fc.array(fc.string(), { minLength: 2, maxLength: 10 }),
        async (votes) => {
          if (!this.system) throw new Error("System not initialized");
          const ballots1 = await Promise.all(votes.map(v => this.system!.castVote(v)));
          const shuffledVotes = [...votes].sort(() => Math.random() - 0.5);
          const ballots2 = await Promise.all(shuffledVotes.map(v => this.system!.castVote(v)));

          const tally1 = await this.system.tallyVotes(ballots1);
          const tally2 = await this.system.tallyVotes(ballots2);

          const sortedTally1 = Array.from(tally1.entries()).sort();
          const sortedTally2 = Array.from(tally2.entries()).sort();

          return JSON.stringify(sortedTally1) === JSON.stringify(sortedTally2);
        }
      );

      await fc.assert(property);
      return {
        name: "Vote Privacy",
        passed: true,
        executionTime: performance.now() - startTime
      };
    } catch (error) {
      return {
        name: "Vote Privacy",
        passed: false,
        counterexample: error,
        executionTime: performance.now() - startTime
      };
    }
  }

  private async testVerifiability(): Promise<TestResult> {
    const startTime = performance.now();
    try {
      const property = fc.asyncProperty(
        fc.array(fc.string(), { minLength: 1, maxLength: 5 }),
        async (votes) => {
          if (!this.system) throw new Error("System not initialized");
          const ballots = await Promise.all(votes.map(v => this.system!.castVote(v)));
          const allBallotsValid = await Promise.all(
            ballots.map(b => this.system!.verifyBallot(b))
          ).then(results => results.every(Boolean));

          const electionValid = await this.system.verifyElection(ballots);

          return allBallotsValid === electionValid;
        }
      );

      await fc.assert(property);
      return {
        name: "Verifiability",
        passed: true,
        executionTime: performance.now() - startTime
      };
    } catch (error) {
      return {
        name: "Verifiability",
        passed: false,
        counterexample: error,
        executionTime: performance.now() - startTime
      };
    }
  }

  private async testAccountability(): Promise<TestResult> {
    const startTime = performance.now();
    try {
      const property = fc.asyncProperty(
        fc.array(fc.string(), { minLength: 1, maxLength: 5 }),
        fc.string(),
        async (votes, maliciousVote) => {
          if (!this.system) throw new Error("System not initialized");
          const legitimateBallots = await Promise.all(
            votes.map(v => this.system!.castVote(v))
          );
          
          const maliciousBallot = await this.system.castVote(maliciousVote);
          maliciousBallot.signature = maliciousBallot.signature.slice(2);

          const maliciousBallotDetected = !(await this.system.verifyBallot(maliciousBallot));
          const legitimateBallotsValid = await Promise.all(
            legitimateBallots.map(b => this.system!.verifyBallot(b))
          ).then(results => results.every(Boolean));

          return maliciousBallotDetected && legitimateBallotsValid;
        }
      );

      await fc.assert(property);
      return {
        name: "Accountability",
        passed: true,
        executionTime: performance.now() - startTime
      };
    } catch (error) {
      return {
        name: "Accountability",
        passed: false,
        counterexample: error,
        executionTime: performance.now() - startTime
      };
    }
  }

  private async testCoercionResistance(): Promise<TestResult> {
    const startTime = performance.now();
    try {
      const property = fc.asyncProperty(
        fc.string(),
        fc.string(),
        async (vote1, vote2) => {
          if (!this.system) throw new Error("System not initialized");
          const ballot1 = await this.system.castVote(vote1);
          const ballot2 = await this.system.castVote(vote2);

          return (
            ballot1.randomness !== ballot2.randomness &&
            ballot1.signature !== ballot2.signature
          );
        }
      );

      await fc.assert(property);
      return {
        name: "Coercion Resistance",
        passed: true,
        executionTime: performance.now() - startTime
      };
    } catch (error) {
      return {
        name: "Coercion Resistance",
        passed: false,
        counterexample: error,
        executionTime: performance.now() - startTime
      };
    }
  }
}
