import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TestResult } from "../lib/propertyTesting";
import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { ProofVisualizer } from "../lib/proofVisualizer";
import katex from "katex";

interface ReportGeneratorProps {
  results: TestResult[];
}

export function ReportGenerator({ results }: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const renderMathToHTML = (formula: string): string => {
    try {
      return katex.renderToString(formula, {
        throwOnError: false,
        displayMode: true,
        output: 'html'
      });
    } catch (error) {
      console.error('Failed to render math:', error);
      return formula;
    }
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF();
      let currentY = 20;

      // Title
      doc.setFontSize(20);
      doc.text("vSpaceVote Security Test Report", 20, currentY);
      currentY += 20;

      // Technical Overview section
      doc.setFontSize(16);
      doc.text("Technical Overview", 20, currentY);
      currentY += 15;

      // Add introduction paragraphs
      doc.setFontSize(12);
      const introText = `The vSpaceWallet DApp implements a VVSG (Voluntary Voting System Guidelines)-compliant system integrated with Selene-WBB (Web Bulletin Board). This comprehensive platform combines EMS (Electoral Management System) and EIH (Election Information Hub) with advanced features:`;

      const components = [
        "Authentication: PDF-Certificate, QR-Code, CardWalletNFC, SafePal-S1-Pro, FIDO2-PassKey",
        "Integration: WalletConnect, Web3, Nuxt, Flask, AutoGen, KeyCloak",
        "Security: i-Voting-ZKP-Signals (PSE Semaphore MPC), TEE-Secure-Enclaves",
        "Enterprise: Constellation-CVMs, EVM-enabled-FHE, KMS-Backend",
        "Identity: WaltID-Identity-Toolkit, mdoc-Credentials(mDL-ISO-IEC-18013-5), DID-EBSI"
      ];

      const authOptions = [
        "Option #1: PDF-Certificate QR-Code of SCCs (Semantic Compact Credentials)",
        "Option #2: Signer CardWalletNFC",
        "Option #3: SafePal-S1-Pro with LCD and Camera",
        "[POSTPONED] Option #4: SecuX Shield Bio with Fingerprint Reader",
        "[POSTPONED] Option #5: Patented Open-Hardware vSpaceWallet with All-in-One"
      ];

      // Add intro text with proper line breaks
      const splitIntro = doc.splitTextToSize(introText, 170);
      doc.text(splitIntro, 20, currentY);
      currentY += splitIntro.length * 7;

      // Add components list
      doc.text("Core Components:", 20, currentY);
      currentY += 10;
      components.forEach(component => {
        const splitComponent = doc.splitTextToSize("• " + component, 170);
        doc.text(splitComponent, 20, currentY);
        currentY += splitComponent.length * 7;
      });

      // Add authentication options
      currentY += 5;
      doc.text("Authentication Options:", 20, currentY);
      currentY += 10;
      authOptions.forEach(option => {
        const splitOption = doc.splitTextToSize("• " + option, 170);
        doc.text(splitOption, 20, currentY);
        currentY += splitOption.length * 7;
      });

      // Summary
      doc.setFontSize(14);
      doc.text("Test Summary", 20, currentY);
      currentY += 5;
      
      const passedTests = results.filter(r => r.passed).length;
      const summary = [
        ["Total Tests", results.length.toString()],
        ["Passed Tests", passedTests.toString()],
        ["Failed Tests", (results.length - passedTests).toString()],
        ["Success Rate", `${((passedTests / results.length) * 100).toFixed(1)}%`]
      ];

      (doc as any).autoTable({
        startY: currentY,
        head: [["Metric", "Value"]],
        body: summary,
        theme: "grid",
        headStyles: { fillColor: [45, 55, 72] }
      });

      // Detailed Results
      currentY = (doc as any).lastAutoTable.finalY + 20;
      doc.setFontSize(14);
      doc.text("Detailed Test Results", 20, currentY);
      currentY += 5;

      const detailedResults = results.map(result => [
        result.name,
        result.passed ? "Passed" : "Failed",
        `${result.executionTime.toFixed(2)}ms`,
        result.counterexample ? JSON.stringify(result.counterexample) : "-"
      ]);

      (doc as any).autoTable({
        startY: currentY,
        head: [["Test Name", "Status", "Time", "Counterexample"]],
        body: detailedResults,
        theme: "grid",
        headStyles: { fillColor: [45, 55, 72] },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 30 },
          2: { cellWidth: 30 },
          3: { cellWidth: 80 }
        },
        styles: { overflow: "linebreak" }
      });

      // Understanding the Test Results section
      currentY = (doc as any).lastAutoTable.finalY + 20;
      doc.setFontSize(14);
      doc.text("Understanding the Test Results", 20, currentY);
      currentY += 10;

      const testExplanations = [
        {
          name: "Ballot Verification",
          explanation: "This test ensures that when you cast a vote, the system can verify it's a genuine ballot, like checking a signature on a mail-in ballot.",
        },
        {
          name: "Vote Privacy",
          explanation: "This test confirms that no one can figure out how you voted, just like the privacy curtain in a voting booth.",
        },
        {
          name: "Accountability",
          explanation: "This ensures that all votes are properly counted and any attempt to tamper with votes is detected.",
        },
        {
          name: "Double Voting Prevention",
          explanation: "This verifies that each voter can only vote once, like checking voter registration.",
        },
        {
          name: "Signature Validity",
          explanation: "This test verifies that each ballot's digital signature is authentic and hasn't been tampered with, similar to verifying a handwritten signature on a legal document.",
        },
        {
          name: "Tally Correctness",
          explanation: "This ensures that votes are counted accurately and the final results reflect all valid votes cast, like having multiple poll workers verify the vote count.",
        },
        {
          name: "Verifiability",
          explanation: "This confirms that anyone can independently verify the election results without compromising voter privacy, similar to having election observers monitor the process.",
        },
        {
          name: "Coercion Resistance",
          explanation: "This verifies that voters cannot prove how they voted to others, preventing vote buying or coercion, like laws preventing voters from photographing their completed ballots.",
        },
      ];

      (doc as any).autoTable({
        startY: currentY,
        head: [["Test Name", "What it Means"]],
        body: testExplanations.map(({ name, explanation }) => [name, explanation]),
        theme: "grid",
        headStyles: { fillColor: [45, 55, 72] },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 140 }
        },
        styles: { overflow: "linebreak", fontSize: 10 }
      });

      // Appendix Section
      doc.addPage();
      currentY = 20;
      doc.setFontSize(16);
      doc.text("Appendix A: Security Proofs", 20, currentY);
      currentY += 20;

      // Accountability Proof
      const accountabilityProof = ProofVisualizer.generateAccountabilityProof();
      doc.setFontSize(14);
      doc.text("A.1 Accountability Proof", 20, currentY);
      currentY += 15;

      // Assumptions
      doc.setFontSize(12);
      doc.text("Assumptions:", 20, currentY);
      currentY += 10;

      accountabilityProof.assumptions.forEach((assumption, index) => {
        (doc as any).autoTable({
          startY: currentY,
          body: [[`${index + 1}. ${assumption}`]],
          theme: "plain",
          styles: { cellPadding: 4, fontSize: 10 }
        });
        currentY = (doc as any).lastAutoTable.finalY + 8;
      });

      // Proof Steps
      currentY += 10;
      doc.text("Proof Steps:", 20, currentY);
      currentY += 5;

      accountabilityProof.steps.forEach((step, index) => {
        (doc as any).autoTable({
          startY: currentY,
          body: [
            [`Step ${index + 1}: ${step.description}`],
            [`LaTeX: ${step.formula}`],
            [`Justification: ${step.justification}`]
          ],
          theme: "plain",
          styles: { cellPadding: 2, fontSize: 10 }
        });
        currentY = (doc as any).lastAutoTable.finalY + 5;
      });

      // Security Proof
      doc.addPage();
      currentY = 20;
      doc.setFontSize(14);
      doc.text("A.2 Security Proof", 20, currentY);
      currentY += 15;

      const securityProof = ProofVisualizer.generateSecurityProof();

      // Assumptions
      doc.setFontSize(12);
      doc.text("Assumptions:", 20, currentY);
      currentY += 10;

      securityProof.assumptions.forEach((assumption, index) => {
        (doc as any).autoTable({
          startY: currentY,
          body: [[`${index + 1}. ${assumption}`]],
          theme: "plain",
          styles: { cellPadding: 2, fontSize: 10 }
        });
        currentY = (doc as any).lastAutoTable.finalY + 5;
      });

      // Proof Steps
      currentY += 10;
      doc.text("Proof Steps:", 20, currentY);
      currentY += 5;

      securityProof.steps.forEach((step, index) => {
        (doc as any).autoTable({
          startY: currentY,
          body: [
            [`Step ${index + 1}: ${step.description}`],
            [step.formula],
            [`Justification: ${step.justification}`]
          ],
          theme: "plain",
          styles: { cellPadding: 2, fontSize: 10 }
        });
        currentY = (doc as any).lastAutoTable.finalY + 5;
      });

      // EasyCrypt Compliance Section
      doc.addPage();
      currentY = 20;
      doc.setFontSize(16);
      doc.text("Appendix B: EasyCrypt Compliance", 20, currentY);
      currentY += 20;

      doc.setFontSize(12);
      // EasyCrypt Proof URLs
      doc.setFontSize(12);
      doc.text("EasyCrypt Proof Files:", 20, currentY);
      currentY += 10;

      const proofUrls = [
        "https://raw.githubusercontent.com/vSpaceWallet/Proofs/refs/heads/main/vSpace-EasyCrypt-Proofs/AccountabilityDefinition.ec",
        "https://raw.githubusercontent.com/vSpaceWallet/Proofs/refs/heads/main/vSpace-EasyCrypt-Proofs/vSpaceDefinition.ec",
        "https://raw.githubusercontent.com/vSpaceWallet/Proofs/refs/heads/main/vSpace-EasyCrypt-Proofs/vSpaceAccountability.ec"
      ];

      proofUrls.forEach((url, index) => {
        (doc as any).autoTable({
          startY: currentY,
          body: [[url]],
          theme: "plain",
          styles: { cellPadding: 2, fontSize: 8 }
        });
        currentY = (doc as any).lastAutoTable.finalY + 2;
      });

      currentY += 10;
      doc.text("Validation Instructions:", 20, currentY);
      currentY += 10;

      const validationSteps = [
        "1. Install EasyCrypt r2022.04 following instructions at https://github.com/easycrypt/easycrypt",
        "2. Install required SMT solvers:",
        "   - Z3 version 4.8.10",
        "   - CVC4 version 1.8",
        "   - Alt-Ergo version 2.4.0",
        "3. Clone the repository containing the proof files",
        "4. Run 'make check' to validate all proofs"
      ];

      validationSteps.forEach((step) => {
        (doc as any).autoTable({
          startY: currentY,
          body: [[step]],
          theme: "plain",
          styles: { cellPadding: 2, fontSize: 10 }
        });
        currentY = (doc as any).lastAutoTable.finalY + 2;
      });

      currentY += 10;
      const complianceContent = [
        ["Security Experiment for Accountability", 
         "Implementation follows AccountabilityDefinition.ec:\n\n" +
         "require import AllCore List.\n" +
         "require import Distr DBool.\n\n" +
         "Verifies security properties through formal proofs."],
        ["Alignment with vSpaceVote Definition", 
         "Core system implements vSpaceDefinition.ec:\n\n" +
         "type vote, ballot.\n" +
         "op validVote : vote -> bool.\n" +
         "op verifyBallot : ballot -> bool.\n\n" +
         "Maintains cryptographic security requirements."],
        ["Accountability Verification", 
         "Verification aligns with vSpaceAccountability.ec:\n\n" +
         "lemma accountability_main:\n" +
         "  forall B, verifyElection B =>\n" +
         "  exists L, accountability_trace L /\\\n" +
         "  tally B = honest_tally L.\n\n" +
         "Proves system accountability."]
      ];

      (doc as any).autoTable({
        startY: currentY,
        head: [["Component", "Compliance Details"]],
        body: complianceContent,
        theme: "grid",
        headStyles: { fillColor: [45, 55, 72] },
        styles: { overflow: "linebreak" }
      });

      // Timestamp
      doc.setFontSize(10);
      doc.text(
        `Generated on: ${new Date().toLocaleString()}`,
        20,
        doc.internal.pageSize.height - 10
      );

      // Save PDF
      doc.save("vspacevote-security-report.pdf");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Test Report</h3>
        <Button
          onClick={generatePDF}
          disabled={isGenerating || results.length === 0}
          variant="outline"
        >
          <FileDown className="mr-2 h-4 w-4" />
          {isGenerating ? "Generating..." : "Generate PDF"}
        </Button>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {results.filter(r => r.passed).length}
            </div>
            <div className="text-sm text-slate-600">Tests Passed</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {results.filter(r => !r.passed).length}
            </div>
            <div className="text-sm text-slate-600">Tests Failed</div>
          </div>
        </div>
      </Card>

      {results.length === 0 && (
        <div className="text-center text-slate-500 py-4">
          Run tests to generate a report
        </div>
      )}
    </div>
  );
}
