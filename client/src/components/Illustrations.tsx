import { useEffect, useRef, useState } from "react";
import * as joint from "jointjs";
import "jointjs/dist/joint.css";

interface IllustrationProps {
  className?: string;
}

const defaultShapeStyle = {
  body: {
    fill: '#f8fafc',
    stroke: '#1e293b',
    strokeWidth: 2,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Inter, sans-serif',
    fontWeight: 'normal',
    fill: '#1e293b'
  }
};

const createGraph = (container: HTMLElement) => {
  const graph = new joint.dia.Graph();
  const paper = new joint.dia.Paper({
    el: container,
    model: graph,
    width: '100%',
    height: '100%',
    gridSize: 1,
    background: { color: 'transparent' },
    interactive: false
  });
  return { graph, paper };
};

export function CompleteSystemDiagram({ className }: IllustrationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const { graph } = createGraph(containerRef.current);

    // Core DApp
    const dapp = new joint.shapes.standard.Rectangle({
      position: { x: 400, y: 50 },
      size: { width: 200, height: 80 },
      attrs: {
        ...defaultShapeStyle,
        label: {
          ...defaultShapeStyle.label,
          text: 'vSpaceWallet DApp'
        }
      }
    });

    // Core Systems Layer
    const coreSystems = [
      { x: 50, y: 200, width: 250, text: 'Selene-WBB' },
      { x: 325, y: 200, width: 250, text: 'Electoral Management System (EMS)' },
      { x: 600, y: 200, width: 250, text: 'Election Information Hub (EIH)' }
    ].map(system => new joint.shapes.standard.Rectangle({
      position: { x: system.x, y: system.y },
      size: { width: system.width, height: 40 },
      attrs: {
        ...defaultShapeStyle,
        label: {
          ...defaultShapeStyle.label,
          text: system.text
        }
      }
    }));

    // Authentication Layer
    const authMethods = [
      { x: 50, y: 350, width: 160, text: 'PDF-Certificate' },
      { x: 230, y: 350, width: 160, text: 'QR-Code' },
      { x: 410, y: 350, width: 160, text: 'CardWalletNFC' },
      { x: 590, y: 350, width: 160, text: 'SafePal-S1-Pro' }
    ].map(auth => new joint.shapes.standard.Rectangle({
      position: { x: auth.x, y: auth.y },
      size: { width: auth.width, height: 40 },
      attrs: {
        ...defaultShapeStyle,
        label: {
          ...defaultShapeStyle.label,
          text: auth.text
        }
      }
    }));

    // Security Layer
    const securityFeatures = [
      { x: 50, y: 500, width: 250, text: 'ZKP (PSE Semaphore MPC)' },
      { x: 325, y: 500, width: 250, text: 'TEE Secure Enclaves' },
      { x: 600, y: 500, width: 250, text: 'FHE (EVM-enabled)' }
    ].map(feature => new joint.shapes.standard.Rectangle({
      position: { x: feature.x, y: feature.y },
      size: { width: feature.width, height: 40 },
      attrs: {
        ...defaultShapeStyle,
        label: {
          ...defaultShapeStyle.label,
          text: feature.text
        }
      }
    }));

    graph.addCells([dapp, ...coreSystems, ...authMethods, ...securityFeatures]);

    const createLink = (source: joint.dia.Cell, target: joint.dia.Cell) => {
      return new joint.shapes.standard.Link({
        source: { id: source.id },
        target: { id: target.id },
        attrs: {
          line: {
            stroke: '#1e293b',
            strokeWidth: 2,
            targetMarker: {
              type: 'path',
              d: 'M 10 -5 0 0 10 5 Z'
            }
          }
        }
      });
    };

    graph.addCells([
      createLink(dapp, coreSystems[1]),
      createLink(coreSystems[1], authMethods[1]),
      createLink(authMethods[1], securityFeatures[1])
    ]);

    return () => {
      graph.clear();
    };
  }, []);

  return <div ref={containerRef} className={className} style={{ minHeight: '800px' }} />;
}

export function TestProcessDiagram({ className }: IllustrationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const steps = [
    { x: 50, y: 50, text: 'Ballot Verification' },
    { x: 250, y: 50, text: 'Privacy Test' },
    { x: 450, y: 50, text: 'Accountability Test' }
  ];

  useEffect(() => {
    if (!containerRef.current) return;
    
    const { graph } = createGraph(containerRef.current);

    const elements = steps.map((step, index) => {
      const rect = new joint.shapes.standard.Rectangle({
        position: { x: step.x, y: step.y },
        size: { width: 150, height: 60 },
        attrs: {
          ...defaultShapeStyle,
          label: {
            ...defaultShapeStyle.label,
            text: step.text
          }
        }
      });

      if (index < steps.length - 1) {
        const link = new joint.shapes.standard.Link({
          source: { x: step.x + 150, y: step.y + 30 },
          target: { x: step.x + 200, y: step.y + 30 },
          attrs: {
            line: {
              stroke: '#1e293b',
              strokeWidth: 2,
              targetMarker: {
                type: 'path',
                d: 'M 10 -5 0 0 10 5 Z'
              }
            }
          }
        });
        return [rect, link];
      }
      return rect;
    });

    graph.addCells(elements.flat());

    return () => {
      graph.clear();
    };
  }, []);

  return <div ref={containerRef} className={className} style={{ minHeight: '400px' }} />;
}

export function SystemArchitectureDiagram({ className }: IllustrationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const components = [
    { x: 50, y: 150, text: 'Security Module' },
    { x: 275, y: 150, text: 'Verification System' },
    { x: 500, y: 150, text: 'Testing Framework' },
  ];

  useEffect(() => {
    if (!containerRef.current) return;
    const { graph } = createGraph(containerRef.current);

    const coreSystem = new joint.shapes.standard.Rectangle({
      position: { x: 300, y: 50 },
      size: { width: 200, height: 60 },
      attrs: {
        ...defaultShapeStyle,
        label: {
          ...defaultShapeStyle.label,
          text: 'vSpaceVote Core'
        }
      }
    });

    const componentRects = components.map(component => new joint.shapes.standard.Rectangle({
      position: { x: component.x, y: component.y },
      size: { width: 150, height: 40 },
      attrs: {
        ...defaultShapeStyle,
        label: {
          ...defaultShapeStyle.label,
          text: component.text
        }
      }
    }));

    graph.addCells([coreSystem, ...componentRects]);
    return () => {
      graph.clear();
    };
  }, []);

  return <div ref={containerRef} className={className} style={{ minHeight: '400px' }} />;
}

export function WalletIntegrationDiagram({ className }: IllustrationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const steps = [
    { x: 50, y: 50, text: 'User Wallet' },
    { x: 250, y: 50, text: 'Authentication' },
    { x: 450, y: 50, text: 'Voting Process' }
  ];

  useEffect(() => {
    if (!containerRef.current) return;
    const { graph } = createGraph(containerRef.current);

    const elements = steps.map((step, index) => {
      const rect = new joint.shapes.standard.Rectangle({
        position: { x: step.x, y: step.y },
        size: { width: 150, height: 60 },
        attrs: {
          ...defaultShapeStyle,
          label: {
            ...defaultShapeStyle.label,
            text: step.text
          }
        }
      });

      if (index < steps.length - 1) {
        const link = new joint.shapes.standard.Link({
          source: { x: step.x + 150, y: step.y + 30 },
          target: { x: step.x + 200, y: step.y + 30 },
          attrs: {
            line: {
              stroke: '#1e293b',
              strokeWidth: 2,
              targetMarker: {
                type: 'path',
                d: 'M 10 -5 0 0 10 5 Z'
              }
            }
          }
        });
        return [rect, link];
      }
      return rect;
    });

    const integrationComponent = new joint.shapes.standard.Rectangle({
      position: { x: 50, y: 200 },
      size: { width: 700, height: 100 },
      attrs: {
        ...defaultShapeStyle,
        label: {
          ...defaultShapeStyle.label,
          text: 'Integration Components\nSmart Contract Interface | Transaction Handler\nKey Management | Signature Verification'
        }
      }
    });

    graph.addCells([...elements.flat(), integrationComponent]);
    return () => {
      graph.clear();
    };
  }, []);

  return <div ref={containerRef} className={className} style={{ minHeight: '400px' }} />;
}

export function Illustrations({ forPDF = false }) {
  const [exportedImages, setExportedImages] = useState<{[key: string]: string}>({});
  const diagramRefs = {
    complete: useRef<HTMLDivElement>(null),
    systemArchitecture: useRef<HTMLDivElement>(null),
    testProcess: useRef<HTMLDivElement>(null),
    walletIntegration: useRef<HTMLDivElement>(null),
  };

  useEffect(() => {
    if (forPDF) {
      const exportDiagrams = async () => {
        const images: {[key: string]: string} = {};
        
        for (const [key, ref] of Object.entries(diagramRefs)) {
          if (ref.current) {
            const { paper } = createGraph(ref.current);
            const svgElement = paper.svg;
            const svgString = new XMLSerializer().serializeToString(svgElement);
            const base64Data = btoa(svgString);
            images[key] = `data:image/svg+xml;base64,${base64Data}`;
          }
        }

        setExportedImages(images);
      };

      exportDiagrams();
    }
  }, [forPDF]);

  if (forPDF) {
    return (
      <div style={{ display: 'none' }}>
        {Object.entries(exportedImages).map(([key, image]) => (
          <img key={key} src={image} alt={`${key} diagram`} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg">Complete System Architecture</h3>
        <CompleteSystemDiagram className="w-full" />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg">System Architecture</h3>
        <SystemArchitectureDiagram className="w-full" />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg">Test Process Flow</h3>
        <TestProcessDiagram className="w-full" />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg">Wallet Integration</h3>
        <WalletIntegrationDiagram className="w-full" />
      </div>
    </div>
  );
}
