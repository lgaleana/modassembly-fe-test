export interface ArchitectureNode {
  type: string;
  name: string;
  purpose: string;
  uses: string[];
  pypi_packages: string[];
  is_endpoint: boolean;
}

export interface Architecture {
  architecture: ArchitectureNode[];
  external_infrastructure: string[];
  app_name: string;
}

export type ArchitectureState = Architecture | null;
