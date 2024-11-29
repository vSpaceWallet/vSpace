import { useState, useEffect, useRef } from "react";
import katex from "katex";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { ProofVisualizer, Proof, ProofStep } from "../lib/proofVisualizer";

export function ProofVisualization() {
  const proofRef = useRef<HTMLDivElement>(null);
  const [currentProof, setCurrentProof] = useState<Proof>(ProofVisualizer.generateAccountabilityProof());
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const renderMath = (element: HTMLElement) => {
    const mathElements = element.getElementsByClassName("math");
    Array.from(mathElements).forEach((el) => {
      katex.render(el.textContent || "", el as HTMLElement, {
        throwOnError: false,
        displayMode: true
      });
    });
  };

  useEffect(() => {
    if (proofRef.current) {
      renderMath(proofRef.current);
    }
  }, [currentProof, currentStepIndex, showExplanation]);

  const handleNextStep = () => {
    if (currentStepIndex < currentProof.steps.length - 1) {
      setDirection('forward');
      setCurrentStepIndex(prev => prev + 1);
      setShowExplanation(false);
      setHighlightedPart(null);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setDirection('backward');
      setCurrentStepIndex(prev => prev - 1);
      setShowExplanation(false);
      setHighlightedPart(null);
    }
  };

  const toggleProof = () => {
    setCurrentProof(current => 
      current.theorem === "vSpaceVote Accountability" 
        ? ProofVisualizer.generateSecurityProof()
        : ProofVisualizer.generateAccountabilityProof()
    );
    setCurrentStepIndex(0);
    setShowExplanation(false);
  };

  const [zoomLevel, setZoomLevel] = useState(1);
  const [highlightedPart, setHighlightedPart] = useState<string | null>(null);

  const renderFormula = (formula: string) => (
    <div className="my-6 space-y-4">
      <pre className="px-4 py-2 bg-slate-100 rounded font-mono text-sm overflow-x-auto">
        {formula}
      </pre>
      <div 
        className={`px-6 py-4 bg-slate-50 rounded-lg shadow-sm transition-transform duration-300`}
        style={{ transform: `scale(${zoomLevel})` }}
        onWheel={(e) => {
          e.preventDefault();
          const newZoom = zoomLevel + (e.deltaY > 0 ? -0.1 : 0.1);
          setZoomLevel(Math.min(Math.max(0.5, newZoom), 2));
        }}
      >
        <div 
          className="math cursor-pointer"
          onClick={() => setHighlightedPart(highlightedPart === formula ? null : formula)}
          style={{
            background: highlightedPart === formula ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            transition: 'all 0.3s ease'
          }}
        >
          {formula}
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
        >
          Zoom Out
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}
        >
          Zoom In
        </Button>
      </div>
    </div>
  );

  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  const renderCurrentStep = (step: ProofStep) => (
    <div 
      className={`border-l-2 border-primary pl-4 my-6 transition-all duration-500 transform ${
        direction === 'forward' ? 'animate-in slide-in-from-right' : 'animate-in slide-in-from-left'
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="font-medium text-lg">{step.description}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowExplanation(!showExplanation)}
        >
          <Info className="h-4 w-4" />
        </Button>
      </div>
      {renderFormula(step.formula)}
      {showExplanation && (
        <div className="mt-4 p-4 bg-slate-50 rounded-lg text-sm text-slate-800 animate-in slide-in-from-top">
          {step.justification}
        </div>
      )}
    </div>
  );

  return (
    <div ref={proofRef} className="space-y-6">
      <div className="prose max-w-none">
        <div className="flex justify-between items-center">
          <h2>Formal Security Proofs</h2>
          <Button variant="outline" onClick={toggleProof}>
            Switch Proof
          </Button>
        </div>
        <p>
          Interactive visualization of the security properties of the vSpaceVote
          system. Click through the steps to explore the proof.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{currentProof.theorem}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div>
              <h4 className="font-semibold text-lg mb-4">Assumptions:</h4>
              <ul className="list-disc pl-6 space-y-4">
                {currentProof.assumptions.map((assumption, i) => (
                  <li key={i}>
                    {renderFormula(assumption)}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-semibold text-lg">Proof Steps:</h4>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevStep}
                    disabled={currentStepIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-slate-600 min-w-[100px] text-center">
                    Step {currentStepIndex + 1} of {currentProof.steps.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextStep}
                    disabled={currentStepIndex === currentProof.steps.length - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {renderCurrentStep(currentProof.steps[currentStepIndex])}
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Conclusion:</h4>
              {renderFormula(currentProof.conclusion)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
