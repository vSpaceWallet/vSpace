import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TestResult } from "../lib/propertyTesting";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

interface TestRunnerProps {
  results: TestResult[];
  isRunning: boolean;
  onRunTests: () => void;
}

export function TestRunner({ results, isRunning, onRunTests }: TestRunnerProps) {
  const passedTests = results.filter(r => r.passed).length;
  const progress = results.length > 0 ? (passedTests / results.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button 
          onClick={onRunTests} 
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            'Run Tests'
          )}
        </Button>

        {results.length > 0 && (
          <div className="text-sm text-slate-600">
            {passedTests} / {results.length} tests passed
          </div>
        )}
      </div>

      {results.length > 0 && (
        <Progress value={progress} className="w-full" />
      )}

      <div className="space-y-4">
        {results.map((result, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border bg-card text-card-foreground"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {result.passed ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="font-medium">{result.name}</span>
              </div>
              <span className="text-sm text-slate-500">
                {result.executionTime.toFixed(2)}ms
              </span>
            </div>

            {!result.passed && result.counterexample && (
              <div className="mt-2 p-2 rounded bg-red-50 text-red-700 text-sm">
                <strong>Counterexample:</strong>
                <pre className="mt-1 text-xs overflow-x-auto">
                  {JSON.stringify(result.counterexample, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
