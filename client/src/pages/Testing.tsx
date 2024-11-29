import { useState, useEffect } from "react";
import { TestRunner } from "../components/TestRunner";
import { ReportGenerator } from "../components/ReportGenerator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PropertyTester, TestResult } from "../lib/propertyTesting";

export default function Testing() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    const tester = new PropertyTester();
    const results = await tester.runAllTests();
    setTestResults(results);
    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          Security Property Testing
        </h1>
        <p className="text-slate-600 mt-2">
          Verify security properties through property-based testing
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Runner</CardTitle>
          </CardHeader>
          <CardContent>
            <TestRunner 
              results={testResults}
              isRunning={isRunning}
              onRunTests={runTests}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Report</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportGenerator results={testResults} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
