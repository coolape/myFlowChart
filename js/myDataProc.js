
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
        nd.jp_isRoot = true; //先全部设置成root,后面设置连接的时候再重置
        //初始化连接
        nd.jp_connections = [];
        if (nd.jp_children != null) {
            for (i in nd.jp_children) {
                var subNode = nd.jp_children[i];
                subNode.jp_connections = [];
                allSubNodes[subNode.jp_nid] = subNode;
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
            //说明连出的节点肯定不是root
            var targetNode = myDataProc.nodes[tnid];
            if (targetNode != null) {
                delete targetNode.jp_isRoot;
            }
        }
    }

    //check root node count
    var count = 0;
    for (i in myDataProc.nodes) {
        if (myDataProc.nodes[i].jp_isRoot) {
            count++;
        }
    }
    if (count > 1) {
        alert('Must only one root node. Now the root count=' + count);
        throw new Error('Must only one root node. Now the root count=' + count);
    } else if (count == 0) {
        alert("There is not root node!");
        throw new Error("There is not root node!");
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

/**
 * 导入流程图
 * @param {String} flowJson 流程图json数据
 * @param {Vector} pos 流程图加载的坐标
 * @param {bool} isAddMode true: 是追加模式，不会跳转到root节点
 * @returns {String} rootNode
 */
myDataProc.importJson = function (flowJson, pos, isAddMode) {
    isAddMode = isAddMode || false;
    var flowInfor = JSON.parse(flowJson);

    if (!isAddMode) {
        //clean
        flowChartKit.clean();
        myDataProc.clean();
        //============================================
        //设置网格
        var gridSize = flowInfor.jp_gridSize;
        var cellSize = flowInfor.jp_gridCellSize;
        flowChartKit.refreshGrid(gridSize, cellSize);
        //============================================
    }

    //============================================
    // 取得root节点及节点id变换
    var rootNode = null;
    var jpIdTrans = {}; //节点id变换
    var origPos = new Vector(0, 0); //root的坐标
    for (i in flowInfor.jp_nodes) {
        var node = flowInfor.jp_nodes[i];
        if (node.jp_isRoot) {
            if (rootNode == null) {
                rootNode = node;
            } else {
                alert("Found an other root node,Must only one root node!");
                throw new Error('Found an other root node,Must only one root node!');
            }
        }
        if (jpIdTrans[node.jp_nid] == null) {
            jpIdTrans[node.jp_nid] = jsPlumbUtil.uuid();
        }
        if (node.jp_children != null) {
            for (i in node.jp_children) {
                var subNode = node.jp_children[i];
                jpIdTrans[subNode.jp_nid] = jsPlumbUtil.uuid();
            }
        }
    }

    //取得新的节点id,如果取得为null,说明参数已经是新的id了
    var getNewNid = function (oldId) {
        return jpIdTrans[oldId] || oldId;
    }

    //============================================
    if (rootNode != null) {
        origPos = flowChartKit.grid.GetCellPositionByIndex(rootNode.jp_pos);
    } else {
        alert("Can not find root node!");
        throw new Error('Can not find root node!');
    }

    //============================================
    //计算偏移
    var offset = new Vector(0, 0);
    if (pos != null) {
        pos = flowChartKit.grid.GetNearestCellPosition(pos);
        offset = Vector.sub(pos, origPos);
    }
    //============================================
    //new nodes
    flowChartKit.jsPlumbIns.batch(function () {
        for (i in flowInfor.jp_nodes) {
            var nd = flowInfor.jp_nodes[i];
            var nid = nd.jp_nid;
            var pos = flowChartKit.grid.GetCellPositionByIndex(nd.jp_pos);
            pos = Vector.add(pos, offset);
            var cfgData = myTree.getTreeDataById(nd.jp_cfgId);
            if (nd.jp_children != null) {
                //说明是listNode
                cfgData.jp_children = nd.jp_children;
                for (j in cfgData.jp_children) {
                    var subNode = cfgData.jp_children[j];
                    subNode.jp_nid = getNewNid(subNode.jp_nid);
                }
                var d = { cfg: cfgData, infor: nd.data }
                flowChartKit.newListNode(pos.x, pos.y, d, getNewNid(nid));
                delete cfgData.jp_children;
            } else {
                var d = { cfg: cfgData, infor: nd.data }
                flowChartKit.newNode(pos.x, pos.y, d, getNewNid(nid));
            }
        }

        //============================================
        //连接节点
        for (i in flowInfor.jp_nodes) {
            var nd = flowInfor.jp_nodes[i];
            var sid = nd.jp_nid;
            for (j in nd.jp_connections) {
                var tid = nd.jp_connections[j].jp_target;
                var lb = nd.jp_connections[j].label
                flowChartKit.connect(getNewNid(sid), getNewNid(tid), lb);
            }
            if (nd.jp_children != null) {
                for (j in nd.jp_children) {
                    var subNode = nd.jp_children[j];
                    var sid = subNode.jp_nid;
                    for (k in subNode.jp_connections) {
                        var tid = subNode.jp_connections[k].jp_target;
                        var lb = subNode.jp_connections[k].label
                        flowChartKit.connect(getNewNid(sid), getNewNid(tid), lb);
                    }
                }
            }
        }
        //============================================
        //跳转到相应该的节点
        if (!isAddMode) {
            flowChartKit.gotoNode(getNewNid(rootNode.jp_nid));
        }
    });
    return getNewNid(rootNode.jp_nid);
}
