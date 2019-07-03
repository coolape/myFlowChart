
var myDataProc = {}
myDataProc.nodes = {}
myDataProc.constions = {}

myDataProc[flowChartKit.CallbackTypes.onNewNode] = function (params) {
    var node = params.node;
    var nodeCfg = params.data;
    var nodeId = node.id;

    var newNode = {
        jp_nid: nodeId,
        cfgId: nodeCfg.id,
    }

    if (node.getAttribute("JPListNode") != null) {
        newNode.jp_children = [];
        //说明是节点组
        var childNodes = params.children;//列表对象
        for (i = 0; i < childNodes.length; i++) {
            // console.log(childNodes[i].id);
            var child = {
                jp_nid: childNodes[i].id,
                dataIndex: parseInt(childNodes[i].getAttribute("dataIndex")),
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
    myDataProc.constions[connection.id] = connection;
    console.log(flowChartKit.CallbackTypes.connection + "==" + connection.id);
}
myDataProc[flowChartKit.CallbackTypes.connectionDetached] = function (connection) {
    myDataProc.constions[connection.id] = null;
    delete myDataProc.constions[connection.id];
    console.log(flowChartKit.CallbackTypes.connectionDetached + "==" + connection.id);
}
myDataProc[flowChartKit.CallbackTypes.connectionMoved] = function (connection) {
    myDataProc.constions[connection.id] = connection;
    console.log(flowChartKit.CallbackTypes.connectionMoved + "==" + connection.id);
}
//======================================
myDataProc.clean = function () {
    myDataProc.nodes = {}
    myDataProc.constions = {}
}

//
myDataProc.export = function () {
    var flowData = {}
    flowData.name = "new flowchart"
    flowData.gridSize = flowChartKit.grid.Cols;
    flowData.gridCellSize = flowChartKit.grid.CellSize;

    //初始化
    var allSubNodes = {}
    for (nid in myDataProc.nodes) {
        var nd = myDataProc.nodes[nid];
        //设置坐标
        nd.grid_pos = flowChartKit.getNodeGridPos(nid);
        //初始化连接
        nd.connections = [];
        if (nd.jp_children != null) {
            for (i in nd.jp_children) {
                var subNode = nd.jp_children[i];
                subNode.connections = [];
                allSubNodes[subNode.jp_nid] = subNode
            }
        }
    }

    //设置连接数据
    for (cid in myDataProc.constions) {
        var con = myDataProc.constions[cid];
        var snid = con.source.id;
        var tnid = con.target.id;
        var node = myDataProc.nodes[snid];
        //可能是组里的节点
        node = node || allSubNodes[snid];
        if (node != null) {
            node.connections.push(tnid);
        }
    }
    flowData.nodes = [];
    for (nid in myDataProc.nodes) {
        flowData.nodes.push(myDataProc.nodes[nid]);
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
    console.log(flowInfor);
}
