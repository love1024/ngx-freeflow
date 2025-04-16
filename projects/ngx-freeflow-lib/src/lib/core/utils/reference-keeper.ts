import { Edge } from '../interfaces/edge.interface';
import { Node } from '../interfaces/node.interface';
import { EdgeModel } from '../models/edge.model';
import { NodeModel } from '../models/node.model';

export class ReferenceKeeper {
  public static ndoes(newNodes: Node[], oldModels: NodeModel[]) {
    const oldNodesMap = new Map<Node, NodeModel>();
    oldModels.forEach(model => oldNodesMap.set(model.node, model));

    return newNodes.map(node => {
      if (oldNodesMap.has(node)) {
        return oldNodesMap.get(node);
      }
      return new NodeModel(node);
    });
  }

  public static edges(newEdges: Edge[], oldModels: EdgeModel[]) {
    const oldEdgesMap = new Map<Edge, EdgeModel>();
    oldModels.forEach(model => oldEdgesMap.set(model.edge, model));

    return newEdges.map(edge => {
      if (oldEdgesMap.has(edge)) {
        return oldEdgesMap.get(edge);
      }
      return new EdgeModel(edge);
    });
  }
}
