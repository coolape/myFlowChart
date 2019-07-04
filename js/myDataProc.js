
var myDataProc = {}
myDataProc.nodes = {}
myDataProc.connections = {}

myDataProc[flowChartKit.CallbackTypes.onNewNode] = function (params) {
    var node = params.node;
    var infor = params.data.infor;
    var nodeCfg = params.data.cfg;
    var nodeId = node.id;

    var newNode = {
        jp_nid: nodeId,
        jp_cfgId: nodeCfg.id,
    }

    if (node.getAttribute("JPListNode") != null) {
        newNode.jp_children = [];
        //说明是节点组
        var childNodes = params.children;//列表对象
        for (i = 0; i < childNodes.length; i++) {
            // console.log(childNodes[i].id);
            var child = {
                jp_nid: childNodes[i].id,
                jp_dataIndex: parseInt(childNodes[i].getAttribute("dataIndex")),
            }
            newNode.jp_children.push(child);
        }
    }
    myDataProc.nodes[nodeId] = newNode;
    console.log(flowChartKit.CallbackTypes.onNewNode + "==" + nodeId);
}

myDataProc[flowChartKit.CallbackTypes.onClickNode] = function (params) {
    var node = params.node;
    var nodeData = params.data;
    var nodeId = node.id;
    if (nodeData.JPList != null) {
        //说明是节点组
    }

    console.log(flowChartKit.CallbackTypes.onClickNode + "==" + nodeId);
}
myDataProc[flowChartKit.CallbackTypes.onDeleteNode] = function (params) {
    var deletedId = params.nodeID;
    // myDataProc.nodes[deletedId] = null;
    delete myDataProc.nodes[deletedId];
    console.log(flowChartKit.CallbackTypes.onDeleteNode + "==" + deletedId);
}
myDataProc[flowChartKit.CallbackTypes.onClickConnection] = function (connection) {
    console.log(flowChartKit.CallbackTypes.onClickConnection + "==" + connection.id);
}
myDataProc[flowChartKit.CallbackTypes.connection] = function (connection) {
    myDataProc.connections[connection.id] = connection;
    console.log(flowChartKit.CallbackTypes.connection + "==" + connection.id);
}
myDataProc[flowChartKit.CallbackTypes.connectionDetached] = function (connection) {
    myDataProc.connections[connection.id] = null;
    delete myDataProc.connections[connection.id];
    console.log(flowChartKit.CallbackTypes.connectionDetached + "==" + connection.id);
}
myDataProc[flowChartKit.CallbackTypes.connectionMoved] = function (connection) {
    myDataProc.connections[connection.id] = connection;
    console.log(flowChartKit.CallbackTypes.connectionMoved + "==" + connection.id);
}
//======================================
myDataProc.clean = function () {
    myDataProc.nodes = {}
    myDataProc.connections = {}
}

//
myDataProc.export = function () {
    var flowData = {}
    flowData.jp_name = "new flowchart"
    flowData.jp_gridSize = flowChartKit.grid.Cols;
    flowData.jp_gridCellSize = flowChartKit.grid.CellSize;

    //初始化
    var allSubNodes = {}
    for (nid in myDataProc.nodes) {
        var nd = myDataProc.nodes[nid];
        //设置坐标
        nd.jp_pos = flowChartKit.getNodeGridPos(nid);
        //初始化连接
        nd.jp_connections = [];
        if (nd.jp_children != null) {
            for (i in nd.jp_children) {
                var subNode = nd.jp_children[i];
                subNode.jp_connections = [];
                allSubNodes[subNode.jp_nid] = subNode
            }
        }
    }

    //设置连接数据
    for (cid in myDataProc.connections) {
        var con = myDataProc.connections[cid];
        var conLb = con.getOverlay("label");
        var lb = null;
        if (conLb != null) {
            lb = con.getOverlay("label").getLabel();
        }
        var snid = con.source.id;
        var tnid = con.target.id;
        var node = myDataProc.nodes[snid];
        //可能是组里的节点
        node = node || allSubNodes[snid];
        if (node != null) {
            var conwrap = { jp_target: tnid };
            if (lb != null) {
                conwrap.label = lb;
            }
            node.jp_connections.push(conwrap);
        }
    }
    flowData.jp_nodes = [];
    for (nid in myDataProc.nodes) {
        flowData.jp_nodes.push(myDataProc.nodes[nid]);
    }
    return flowData;
}

myDataProc.exportJson = function () {
    return JSON.stringify(myDataProc.export());
}

myDataProc.importJson = function (flowJson) {
    //clean
    flowChartKit.clean();
    myDataProc.clean();
    //init grid
    var flowInfor = JSON.parse(flowJson);
    //============================================
    //设置网格
    var gridSize = flowInfor.jp_gridSize;
    var cellSize = flowInfor.jp_gridCellSize;
    var grid = flowChartKit.refreshGrid(gridSize, cellSize);
    //============================================
    //new nodes
    flowChartKit.jsPlumbIns.batch(function () {
        for (i in flowInfor.jp_nodes) {
            var nd = flowInfor.jp_nodes[i];
            var nid = nd.jp_nid;
            var pos = flowChartKit.grid.GetCellPositionByIndex(nd.jp_pos);
            var cfgData = myTree.getTreeDataById(nd.jp_cfgId);
            if (nd.jp_children != null) {
                //说明时listNode
                cfgData.jp_children = nd.jp_children;
                var d = { cfg: cfgData, infor: nd.data }
                flowChartKit.newListNode(pos.x, pos.y, d, nid)
                delete cfgData.jp_children;
            } else {
                var d = { cfg: cfgData, infor: nd.data }
                flowChartKit.newNode(pos.x, pos.y, d, nid)
            }
        }

        for (i in flowInfor.jp_nodes) {
            var nd = flowInfor.jp_nodes[i];
            var sid = nd.jp_nid;
            for (j in nd.jp_connections) {
                var tid = nd.jp_connections[j].jp_target;
                var lb = nd.jp_connections[j].label
                flowChartKit.connect(sid, tid, lb);
            }
            if (nd.jp_children != null) {
                for (j in nd.jp_children) {
                    var subNode = nd.jp_children[j];
                    var sid = subNode.jp_nid;
                    for (k in subNode.jp_connections) {
                        var tid = subNode.jp_connections[k].jp_target;
                        var lb = subNode.jp_connections[k].label
                        flowChartKit.connect(sid, tid, lb);
                    }
                }
            }
        }
    });
}
