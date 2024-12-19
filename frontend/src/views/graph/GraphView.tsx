import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DirectedGraph } from './DirectedGraph';

// Sample data - replace with actual data from backend
const sampleData = {
  nodes: [
    { id: "Project" },
    { id: "Component1" },
    { id: "Component2" },
  ],
  links: [
    { source: "Project", target: "Component1" },
    { source: "Project", target: "Component2" },
  ],
};

export const GraphView: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [backendLink, setBackendLink] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setBackendLink('https://example.com/generated-project');
          return 100;
        }
        return prev + 10;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-4xl">
        <div className="space-y-6 p-6">
          <DirectedGraph data={sampleData} />
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Generation Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
          {backendLink && (
            <Alert>
              <AlertDescription>
                <a
                  href={backendLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View your generated project
                </a>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </Card>
    </div>
  );
};

export default GraphView;
