import { Graph } from 'react-d3-graph';
import React from 'react';

interface DirectedGraphProps {
  data: {
    nodes: Array<{ id: string }>;
    links: Array<{ source: string; target: string }>;
  };
}

export const DirectedGraph: React.FC<DirectedGraphProps> = ({ data }) => {
  const config = {
    directed: true,
    nodeHighlightBehavior: true,
    node: {
      color: 'hsl(var(--primary))',
      size: 300,
      fontSize: 12,
    },
    link: {
      color: 'hsl(var(--muted-foreground))',
      strokeWidth: 2,
    },
    d3: {
      gravity: -300,
      linkLength: 150,
    },
  };

  return (
    <div className="w-full h-96">
      <Graph
        id="directed-graph"
        data={data}
        config={config}
      />
    </div>
  );
};
