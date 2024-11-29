// Core vSpaceVote implementation based on sElect system
import { z } from "zod";

export const BallotSchema = z.object({
  vote: z.string(),
  randomness: z.string(),
  signature: z.string()
});

export type Ballot = z.infer<typeof BallotSchema>;

export class VSpaceVote {
  private publicKey: CryptoKey;
  private privateKey: CryptoKey;
  private encoder: TextEncoder;

  private constructor(publicKey: CryptoKey, privateKey: CryptoKey) {
    this.publicKey = publicKey;
    this.privateKey = privateKey;
    this.encoder = new TextEncoder();
  }

  static async initialize(): Promise<VSpaceVote> {
    const crypto = typeof window !== 'undefined' ? window.crypto : (await import('crypto')).webcrypto;
    const keyPair = await crypto.subtle.generateKey(
      {
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["sign", "verify"]
    );

    return new VSpaceVote(keyPair.publicKey, keyPair.privateKey);
  }

  private async createBallot(vote: string): Promise<Ballot> {
    // Generate random bytes for randomness
    const randomBytes = new Uint8Array(32);
    if (typeof window !== 'undefined') {
      window.crypto.getRandomValues(randomBytes);
    } else {
      (await import('crypto')).webcrypto.getRandomValues(randomBytes);
    }

    const randomness = Array.from(randomBytes)
      .map((b: number) => b.toString(16).padStart(2, '0'))
      .join('');

    const message = `${vote}-${randomness}`;
    const messageBuffer = this.encoder.encode(message);
    
    const signature = await window.crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      this.privateKey,
      messageBuffer
    );

    return {
      vote,
      randomness,
      signature: Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
    };
  }

  async verifyBallot(ballot: Ballot): Promise<boolean> {
    try {
      const message = `${ballot.vote}-${ballot.randomness}`;
      const messageBuffer = this.encoder.encode(message);
      const signatureBytes = new Uint8Array(
        ballot.signature.match(/.{2}/g)?.map(byte => parseInt(byte, 16)) || []
      );

      return await window.crypto.subtle.verify(
        "RSASSA-PKCS1-v1_5",
        this.publicKey,
        signatureBytes,
        messageBuffer
      );
    } catch {
      return false;
    }
  }

  // Core voting functions
  async castVote(vote: string): Promise<Ballot> {
    return await this.createBallot(vote);
  }

  async tallyVotes(ballots: Ballot[]): Promise<Map<string, number>> {
    const tally = new Map<string, number>();
    
    for (const ballot of ballots) {
      if (!await this.verifyBallot(ballot)) continue;
      tally.set(ballot.vote, (tally.get(ballot.vote) || 0) + 1);
    }

    return tally;
  }

  // Accountability verification
  async verifyElection(ballots: Ballot[]): Promise<boolean> {
    const verificationResults = await Promise.all(
      ballots.map(ballot => this.verifyBallot(ballot))
    );
    return verificationResults.every(result => result);
  }
}
