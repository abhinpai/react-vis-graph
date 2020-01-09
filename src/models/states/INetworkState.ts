export default interface INetworkState {
  drag: boolean;
  options: IOptions;
  graph :{
    nodes: INodes['node'][];
    edges: IEdges['edge'][];
  }
}

interface INodes {
  nodeOptions?: {
    widthConstraint?: number;
    heightConstraint?: number;
    shape?: string;
    borderWidth?: number;
  };
  node: {
    id: string | number;
    label: string;
    group?: number;
  };
}

interface IEdges {
  edge: {
    from: number;
    to: number;
  };
}

interface IOptions {
  autoResize: boolean;
  nodes?: INodes['nodeOptions'];
  physics?: {
    enabled?: boolean;
    barnesHut?: {
      avoidOverlap?: number;
      damping?: number;
    };
  };
  interaction?: {
    multiselect?: boolean;
    dragView?: boolean;
    hover?: boolean;
    zoomview?: boolean;
  };
}


export interface IGraphInstances {
  canvasContext: CanvasRenderingContext2D;
}



export interface IPosition {
    startX: any;
    startY: any;
    w: any;
    h: any;
}
