// /* eslint-disable @typescript-eslint/no-useless-constructor */
import React, { Component } from 'react';
// import defaultsDeep from 'lodash/fp/defaultsDeep';
// import isEqual from 'lodash/isEqual';
// import differenceWith from 'lodash/differenceWith';
// import vis from 'vis-network';
// import uuid from 'uuid';

// interface DefaultProps {
//   graph: {};
//   style: { width: '100%'; height: '100%' };
// }

// interface IGraphProps {
//   graph: object;
//   style: object;
//   options: object;
//   getNetwork: (...args: any[]) => any;
//   getNodes: (...args: any[]) => any;
//   getEdges: (...args: any[]) => any;
// }

// interface IGraphState {
//     identifier: any;  
// }

// class GraphTS extends Component<IGraphProps, IGraphState> {

//   container: any;
//   identifier: any;
//   Network: any;

//   constructor(props: IGraphProps) {
//     super(props);
//     // const { identifier } = props;
//     this.updateGraph = this.updateGraph.bind(this);
//     this.state = {
//       identifier: this.identifier !== undefined ? this.identifier : uuid.v4()
//     };
//     this.container = React.createRef();
//   }

//   componentDidMount() {
//     this.edges = new vis.DataSet();
//     this.edges.add(this.props.graph.edges);
//     this.nodes = new vis.DataSet();
//     this.nodes.add(this.props.graph.nodes);
//     this.updateGraph();
//   }

//   updateGraph() {
//     let defaultOptions = {
//       physics: {
//         stabilization: false
//       },
//       autoResize: false,
//       edges: {
//         smooth: false,
//         color: "#000000",
//         width: 0.5,
//         arrows: {
//           to: {
//             enabled: true,
//             scaleFactor: 0.5
//           }
//         }
//       }
//     };

//     // merge user provied options with our default ones
//     let options = defaultsDeep(defaultOptions, this.props.options);

//     this.Network = new vis.Network(
//       this.container.current,
//       Object.assign({}, this.props.graph, {
//         edges: edges,
//         nodes: this.nodes
//       }),
//       options
//     );

//     if (this.props.getNetwork) {
//       this.props.getNetwork(this.Network);
//     }

//     if (this.props.getNodes) {
//       this.props.getNodes(this.nodes);
//     }

//     if (this.props.getEdges) {
//       this.props.getEdges(this.edges);
//     }

//     // Add user provied events to network
//     let events = this.props.events || {};
//     for (let eventName of Object.keys(events)) {
//       this.Network.on(eventName, events[eventName]);
//     }
//   }

//   render() {
//     const { identifier } = this.state;
//     const { style } = this.props;
//     return React.createElement(
//       'div',
//       {
//         id: identifier,
//         ref: this.container,
//         style
//       },
//       identifier
//     );
//   }
// }
