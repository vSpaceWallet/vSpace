import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Illustrations } from "../components/Illustrations";

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900">vSpaceVote Platform</h1>
        <p className="text-xl text-slate-600">
          A formal verification-focused implementation of secure voting system
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Interactive Demo</CardTitle>
            <CardDescription>
              Experience the vSpaceVote system in action
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/demo">
              <Button className="w-full">Try Demo</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Testing</CardTitle>
            <CardDescription>
              Explore property-based security verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/testing">
              <Button className="w-full" variant="secondary">
                View Tests
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documentation</CardTitle>
            <CardDescription>
              Formal proofs and implementation details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              View Docs
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="prose max-w-none">
        <h2>About vSpaceVote</h2>
        <p>
          vSpaceVote is an implementation of a secure voting system. It provides
          strong security guarantees including:
        </p>
        <ul>
          <li>Vote privacy</li>
          <li>Verifiability</li>
          <li>Accountability</li>
          <li>Coercion resistance</li>
        </ul>
      </div>

      <div className="mt-12 space-y-8">
        <h2 className="text-2xl font-bold text-slate-900">Technical Overview</h2>
        <div className="prose max-w-none mb-8">
          <p className="text-slate-600 leading-relaxed">
            The vSpaceWallet DApp implements a VVSG (Voluntary Voting System Guidelines)-compliant system integrated with Selene-WBB (Web Bulletin Board). This comprehensive platform combines:
          </p>
          
          <div className="mt-4 space-y-2">
            <h4 className="text-lg font-medium">Core Components:</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>EMS (Electoral Management System) and EIH (Election Information Hub)</li>
              <li>Authentication Options: PDF-Certificate, QR-Code, CardWalletNFC, SafePal-S1-Pro, FIDO2-PassKey</li>
              <li>Integration Layer: WalletConnect, Web3, Nuxt, Flask, AutoGen, KeyCloak</li>
              <li>Security Features: i-Voting-ZKP-Signals (PSE Semaphore MPC), TEE-Secure-Enclaves</li>
              <li>Enterprise Features: Constellation-CVMs, EVM-enabled-FHE, KMS-Backend</li>
              <li>Identity Tools: WaltID-Identity-Toolkit, mdoc-Credentials, DID-EBSI</li>
            </ul>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-medium">Authentication Options:</h4>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Option #1: PDF-Certificate QR-Code of SCCs (Semantic Compact Credentials)</li>
              <li>Option #2: Signer CardWalletNFC</li>
              <li>Option #3: SafePal-S1-Pro with LCD and Camera</li>
              <li className="text-slate-400">Option #4: SecuX Shield Bio with Fingerprint Reader (Postponed)</li>
              <li className="text-slate-400">Option #5: Patented Open-Hardware vSpaceWallet (Postponed)</li>
            </ul>
          </div>
        </div>
        <Illustrations />
      </div>
    </div>
  );
}
