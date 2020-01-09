/* eslint-disable import/first */
import React, { Component } from 'react';
import './App.scss';
import Graph from '../core/lib/Graph';
import INetworkState, { IPosition } from '../models/states/INetworkState';
import { Menu, Icon } from 'antd';
const { SubMenu } = Menu;
import 'antd/dist/antd.css';

export default class App extends Component<{}, INetworkState> {
  canvasWrapperRef: any;
  ctx: CanvasRenderingContext2D | any;
  network: any;
  container: any;
  nodeContextMenu: any;
  edgeContextMenu: any;
  canvas: any | HTMLCanvasElement;
  nodes: any;
  rect: IPosition = {
    h: null,
    startX: null,
    w: null,
    startY: null
  };
  drawingSurfaceImageData: any;

  constructor(props: any) {
    super(props);
    this.state = {
      showNodeContextMenu: false,
      showEdgeContextMenu: false,
      showInspectorPane: false,
      drag: false,
      options: {
        autoResize: true,
        nodes: {
          widthConstraint: 50,
          heightConstraint: 50,
          shape: 'circle'
        },
        physics: {
          enabled: true,
          barnesHut: {
            avoidOverlap: 0.5,
            damping: 0.1
          }
        },
        interaction: {
          multiselect: true,
          dragView: true,
          hover: true
        }
      },
      graph: {
        nodes: [
          {
            id: '595191aa-98c6-4a4b-a0e0-4262df83e0de',
            label: 'Space',
            group: 0
          },
          {
            id: 0,
            label: 'Asset 1',
            group: 0
          },
          {
            id: 1,
            label: 'Point 1',
            group: 3
          },
          {
            id: 2,
            label: 'Point 2',
            group: 3
          },
          {
            id: 3,
            label: 'Point 3',
            group: 3
          },
          {
            id: 4,
            label: 'Point 4',
            group: 1
          },
          {
            id: 5,
            label: 'Point 5',
            group: 1
          },
          {
            id: 6,
            label: 'Point 6',
            group: 1
          },
          {
            id: 7,
            label: 'Point 7',
            group: 2
          },
          {
            id: 8,
            label: 'Point 8',
            group: 2
          },
          {
            id: 9,
            label: 'Asset 2',
            group: 0
          },
          {
            id: 11,
            label: 'Point 11',
            group: 3
          },
          {
            id: 12,
            label: 'Point 21',
            group: 3
          },
          {
            id: 13,
            label: 'Point 31',
            group: 3
          },
          {
            id: 14,
            label: 'Point 41',
            group: 1
          },
          {
            id: 15,
            label: 'Point 51',
            group: 1
          },
          {
            id: 16,
            label: 'Point 61',
            group: 1
          },
          {
            id: 17,
            label: 'Point 71',
            group: 2
          },
          {
            id: 18,
            label: 'Point 81',
            group: 2
          }
        ],
        edges: [
          {
            from: 0,
            to: 1
          },
          {
            from: 0,
            to: 2
          },
          {
            from: 0,
            to: 3
          },
          {
            from: 0,
            to: 4
          },
          {
            from: 0,
            to: 5
          },
          {
            from: 0,
            to: 6
          },
          {
            from: 0,
            to: 7
          },
          {
            from: 0,
            to: 8
          },
          {
            from: 9,
            to: 11
          },
          {
            from: 9,
            to: 12
          },
          {
            from: 9,
            to: 13
          },
          {
            from: 9,
            to: 14
          },
          {
            from: 9,
            to: 15
          },
          {
            from: 9,
            to: 16
          },
          {
            from: 9,
            to: 17
          },
          {
            from: 9,
            to: 18
          }
        ]
      }
    };
    this.canvasWrapperRef = React.createRef();
  }

  componentDidMount() {
    let that = this;
    this.container = this.canvasWrapperRef!.current!.Network.canvas.frame;
    this.network = this.canvasWrapperRef!.current!.Network;
    this.canvas = this.canvasWrapperRef!.current!.Network.canvas.frame.canvas;
    this.nodes = this.state.graph.nodes;
    this.ctx = this.canvas!.getContext('2d');

    this.container.oncontextmenu = function() {
      return false;
    };

    this.network.on('stabilizationIterationsDone', function() {
      that.network.setOptions({ physics: false });
    });

    this.saveDrawingSurface();

    this.container.addEventListener('mousedown', (e: any) => {
      e.preventDefault();
      if (e.button === 2) {
        this.saveDrawingSurface();
        this.rect.startX =
          e.pageX - this.canvasWrapperRef.current.Network.body.container.offsetLeft;
        this.rect.startY = e.pageY - this.canvasWrapperRef.current.Network.body.container.offsetTop;
        this.setState({ drag: true });
        this.container.style.cursor = 'default';
        this.selectNodesFromHighlight();
      }
    });

    this.network.on('click', (e: any) => {
      this.hideEdgeContextMenu();
      this.hideNodeContextMenu();
      if (e.nodes.length > 0) {
        this.network.focus(e.nodes[0]);
        this.setState({
          showInspectorPane: true,
          nodeData: { label: this.network.body.nodes[e.nodes[0]].options.label, id: e.nodes[0] }
        });
      } else {
        this.setState({ showInspectorPane: false, nodeData: undefined });
      }
      this.network.setOptions({ physics: { stabilization: { fit: true } } });
      this.network.stabilize();
    });

    this.network.on('oncontext', (e: any) => {
      let selectedNode = this.network.getNodeAt(e.pointer.DOM);
      let selectedEdge = this.network.getEdgeAt(e.pointer.DOM);
      this.nodeContextMenu = document.getElementById('nodeContextMenu');
      this.edgeContextMenu = document.getElementById('edgeContextMenu');
      e.event.preventDefault();
      if (selectedNode) {
        this.hideEdgeContextMenu();
        this.setState({ showNodeContextMenu: true });
        this.nodeContextMenu!.style.display = 'block';
        this.nodeContextMenu!.style.top = e.pointer.DOM.y + 'px';
        this.nodeContextMenu!.style.left = e.pointer.DOM.x + 'px';
      } else if (selectedEdge) {
        this.hideNodeContextMenu();
        this.setState({ showEdgeContextMenu: true });
        this.edgeContextMenu!.style.display = 'block';
        this.edgeContextMenu!.style.top = e.pointer.DOM.y + 'px';
        this.edgeContextMenu!.style.left = e.pointer.DOM.x + 'px';
      } else {
        this.hideNodeContextMenu();
        this.hideNodeContextMenu();
      }
    });

    this.network.on('zoom', (e: any) => {
      this.hideNodeContextMenu();
      this.hideNodeContextMenu();
      if (e.direction === '+' && e.scale > 0.8) {
        this.changeShape();
      }
      if (e.direction === '-' && e.scale < 0.8) {
        this.resetShape();
      }
    });

    this.container.addEventListener('mousemove', (e: any) => {
      if (this.state.drag) {
        this.hideNodeContextMenu();
        this.hideNodeContextMenu();
        this.restoreDrawingSurface();
        this.rect.w =
          e.pageX -
          this.canvasWrapperRef.current.Network.body.container.offsetLeft -
          this.rect.startX;
        this.rect.h =
          e.pageY -
          this.canvasWrapperRef.current.Network.body.container.offsetTop -
          this.rect.startY;
        this.ctx.setLineDash([5]);
        this.ctx.strokeStyle = 'rgb(0, 102, 0)';
        this.ctx.strokeRect(this.rect.startX, this.rect.startY, this.rect.w, this.rect.h);
        this.ctx.setLineDash([]);
        this.ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
        this.ctx.fillRect(this.rect.startX, this.rect.startY, this.rect.w, this.rect.h);
      }
    });

    this.container.addEventListener('mouseup', (e: any) => {
      if (e.button === 2) {
        this.restoreDrawingSurface();
        this.setState({ drag: false });
        this.container.style.cursor = 'default';
        this.selectNodesFromHighlight();
      }
    });
  }

  changeShape() {
    var options = {
      nodes: {
        widthConstraint: 1000,
        heightConstraint: 100,
        shape: 'box'
      }
    };
    this.network.setOptions(options);
    this.network.setOptions({ physics: { stabilization: { fit: false } } });
    this.network.stabilize();
  }

  resetShape() {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.nodes;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.nodes.update;
    this.network.setOptions({
      nodes: {
        shape: 'circle'
      }
    });
  }

  selectNodesFromHighlight() {
    var nodesIdInDrawing = [];
    var selectedNodes = [];
    var xRange = this.getStartToEnd(this.rect.startX, this.rect.w);
    var yRange = this.getStartToEnd(this.rect.startY, this.rect.h);
    var allNodes = this.nodes;
    for (var i = 0; i < allNodes.length; i++) {
      var curNode = allNodes[i];
      var nodePosition = this.network.getPositions([curNode.id]);
      var nodeXY = this.network.canvasToDOM({
        x: nodePosition[curNode.id].x,
        y: nodePosition[curNode.id].y
      });
      if (
        xRange.start <= nodeXY.x &&
        nodeXY.x <= xRange.end &&
        yRange.start <= nodeXY.y &&
        nodeXY.y <= yRange.end
      ) {
        selectedNodes.push(curNode);
        nodesIdInDrawing.push(curNode.id);
      }
    }
    this.network.selectNodes(nodesIdInDrawing);
  }

  getStartToEnd(start: any, theLen: any) {
    return theLen > 0
      ? {
          start: start,
          end: start + theLen
        }
      : {
          start: start + theLen,
          end: start
        };
  }

  restoreDrawingSurface() {
    this.ctx.putImageData(this.drawingSurfaceImageData, 0, 0);
  }

  saveDrawingSurface() {
    this.drawingSurfaceImageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }

  render() {
    return (
      <div
        id="graph"
        className="graph"
        style={{
          height: '100vh',
          width: '100vw'
        }}
      >
        <Graph ref={this.canvasWrapperRef} graph={this.state.graph} options={this.state.options} />
        {this.state.showInspectorPane && (
          <div className="inspector-div">
            <span>Inspector Pane</span>
            <hr />
            {this.state.nodeData && (
              <h2>
                {this.state.nodeData?.id} - {this.state.nodeData?.label}
              </h2>
            )}

            <div className="close-btn"></div>
          </div>
        )}
        {this.renderNodeMenu()}
        {this.renderEdgeMenu()}
      </div>
    );
  }

  renderNodeMenu() {
    return (
      <div id="nodeContextMenu" className="contextMenu">
        <Menu style={{ width: 200 }} mode="vertical">
          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="mail" />
                <span>Node Selection</span>
              </span>
            }
          >
            <Menu.ItemGroup title="Item 1">
              <Menu.Item key="1">Option 1</Menu.Item>
              <Menu.Item key="2">Option 2</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="Iteom 2">
              <Menu.Item key="3">Option 3</Menu.Item>
              <Menu.Item key="4">Option 4</Menu.Item>
            </Menu.ItemGroup>
          </SubMenu>
          <SubMenu
            key="sub2"
            title={
              <span>
                <Icon type="appstore" />
                <span>Navigation Two</span>
              </span>
            }
          >
            <Menu.Item key="5">Option 5</Menu.Item>
            <Menu.Item key="6">Option 6</Menu.Item>
            <SubMenu key="sub3" title="Submenu">
              <Menu.Item key="7">Option 7</Menu.Item>
              <Menu.Item key="8">Option 8</Menu.Item>
            </SubMenu>
          </SubMenu>
          <SubMenu
            key="sub4"
            title={
              <span>
                <Icon type="setting" />
                <span>Navigation Three</span>
              </span>
            }
          >
            <Menu.Item key="9">Option 9</Menu.Item>
            <Menu.Item key="10">Option 10</Menu.Item>
            <Menu.Item key="11">Option 11</Menu.Item>
            <Menu.Item key="12">Option 12</Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    );
  }

  renderEdgeMenu() {
    return (
      <div id="edgeContextMenu" className="contextMenuEdge">
        <Menu style={{ width: 200 }} mode="vertical">
          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="mail" />
                <span>Edge Selection</span>
              </span>
            }
          >
            <Menu.ItemGroup title="Item 1">
              <Menu.Item key="1">Option 1</Menu.Item>
              <Menu.Item key="2">Option 2</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="Iteom 2">
              <Menu.Item key="3">Option 3</Menu.Item>
              <Menu.Item key="4">Option 4</Menu.Item>
            </Menu.ItemGroup>
          </SubMenu>
          <SubMenu
            key="sub2"
            title={
              <span>
                <Icon type="appstore" />
                <span>Navigation Two</span>
              </span>
            }
          >
            <Menu.Item key="5">Option 5</Menu.Item>
            <Menu.Item key="6">Option 6</Menu.Item>
            <SubMenu key="sub3" title="Submenu">
              <Menu.Item key="7">Option 7</Menu.Item>
              <Menu.Item key="8">Option 8</Menu.Item>
            </SubMenu>
          </SubMenu>
          <SubMenu
            key="sub4"
            title={
              <span>
                <Icon type="setting" />
                <span>Navigation Three</span>
              </span>
            }
          >
            <Menu.Item key="9">Option 9</Menu.Item>
            <Menu.Item key="10">Option 10</Menu.Item>
            <Menu.Item key="11">Option 11</Menu.Item>
            <Menu.Item key="12">Option 12</Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    );
  }

  hideNodeContextMenu() {
    this.nodeContextMenu = document.getElementById('nodeContextMenu');
    this.nodeContextMenu.style.display = 'none';
    this.setState({ showNodeContextMenu: false });
  }

  hideEdgeContextMenu() {
    this.edgeContextMenu = document.getElementById('edgeContextMenu');
    this.edgeContextMenu.style.display = 'none';
    this.setState({ showEdgeContextMenu: false });
  }
}
