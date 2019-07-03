
var myDataProc = {}
myDataProc.nodes = {}
myDataProc.constions = {}

myDataProc[flowChartKit.CallbackTypes.onNewNode] = function (params) {
    var node = params.node;
    var nodeData = params.data;
    var nodeId = node.id;
    if (nodeData.JPList != null) {
        //说明是节点组
        var childNodes = params.children;//列表对象
        for (i = 0; i < childNodes.length; i++) {
            // console.log(childNodes[i].id);
        }
    }
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
    console.log(flowChartKit.CallbackTypes.onDeleteNode + "==" + deletedId);
}
myDataProc[flowChartKit.CallbackTypes.onClickConnection] = function (connection) {
    console.log(flowChartKit.CallbackTypes.onClickConnection + "==" + connection.id);
}
myDataProc[flowChartKit.CallbackTypes.connection] = function (connection) {
    console.log(flowChartKit.CallbackTypes.connection + "==" + connection.id);
}
myDataProc[flowChartKit.CallbackTypes.connectionDetached] = function (connection) {
    console.log(flowChartKit.CallbackTypes.connectionDetached + "==" + connection.id);
}
myDataProc[flowChartKit.CallbackTypes.connectionMoved] = function (connection) {
    console.log(flowChartKit.CallbackTypes.connectionMoved + "==" + connection.id);
}

