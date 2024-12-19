import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const InputView: React.FC = () => {
  const navigate = useNavigate();
  const [projectName, setProjectName] = React.useState('');
  const [projectDescription, setProjectDescription] = React.useState('');

  const handleSubmit = () => {
    if (!projectName.trim() || !projectDescription.trim()) return;
    // We'll handle the API call in the next step
    navigate('/graph', { state: { projectName, projectDescription } });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Project Details</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectDescription">What do you want to build?</Label>
            <Input
              id="projectDescription"
              placeholder="e.g., a system for managing order inventories"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSubmit}>
            Generate Project
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InputView;
