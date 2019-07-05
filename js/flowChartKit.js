var flowChartKit = {}

//连接类型枚举
flowChartKit.Connector = {
    Bezier: "Bezier",
    Straight: "Straight",
    StateMachine: "StateMachine",
    Flowchart: "Flowchart",
}

//回调函数类型
flowChartKit.CallbackTypes = {
    onNewNode: "onNewNode",//当创建节点时回调
    onDeleteNode: "onDeleteNode",//当删除节点时回调
    onClickNode: "onClickNode",//当点击节点时回调
    onClickConnection: "onClickConnection",//当点击连接时回调
    connection: "connection",//当有连接时回调
    connectionDetached: "connectionDetached",//当连接断开时回调
    connectionMoved: "connectionMoved",//当连接移开时回调
    onZooming: "onZooming",//缩放时的回调
}
flowChartKit.cfg;
flowChartKit.activeConnection = null;   // 活动的连接
flowChartKit.jsPlumbIns = null;   // jsPlumb的实例
flowChartKit.grid;
flowChartKit.containerId;
flowChartKit.callbaksArray;
flowChartKit.zoomCenter = [0, 0];
flowChartKit.nodes = {};
flowChartKit.posseId = "posse01";
flowChartKit.currPosse = {};

/**
 * 初始化
 * @method init
 * @for flowChartKit
 * @param {Object} cfg 配置
    cfg.gridSize; 网格的大小
    cfg.gridCellSize; 网格单元格的大小
    cfg.isDrawGrid;是否画网格线
    cfg.canvasId; 画布的id
    cfg.containerId; 流程图的容器id
    cfg.connector; 连接线的方式，默认是StateMachine
    cfg.zoomRange:[0.1, 5] 缩放范围
 * @param {Array} callbaksArray callbaks数组连接类型
 * callbaks.onNewNode:当创建节点时回调
 * callbaks.onDeleteNode:当删除节点时回调
 * callbaks.onClickNode:当点击节点时回调
 * callbaks.onClickConnection:当点击连接时回调
 * callbaks.connection:当有连接时回调
 * callbaks.connectionDetached:当连接断开时回调
 * callbaks.connectionMoved:当连接移开时回调
 */
flowChartKit.init = function (cfg, callbaksArray) {
    if (flowChartKit.jsPlumbIns != null) {
        return
    }
    cfg.zoomRange = cfg.zoomRange || [0.1, 5];
    cfg.gridSize = cfg.gridSize || 400;
    cfg.gridCellSize = cfg.gridCellSize || 50;
    cfg.isDrawGrid = cfg.isDrawGrid || true;
    cfg.connector = cfg.connector || flowChartKit.Connector.StateMachine;

    flowChartKit.cfg = cfg;
    var origin = new Vector(0, 0);
    var grid = Grid.new(cfg.containerId, origin, cfg.gridSize, cfg.gridSize, cfg.gridCellSize);
    if (cfg.isDrawGrid) {
        grid.DebugDraw("#DCDCDC");
    }
    flowChartKit.grid = grid;
    flowChartKit.containerId = cfg.containerId;
    flowChartKit.callbaksArray = callbaksArray || [];
    flowChartKit.lineColor = "#5c96bc";

    var container = $("#" + cfg.containerId);

    var jsPlumbIns = jsPlumb.getInstance({
        Endpoint: ["Dot", { radius: 3 }],
        EndpointStyle: { fill: "#ffa500" },
        Connector: cfg.connector,
        HoverPaintStyle: { stroke: "#1e8151", strokeWidth: 2 },
        ConnectionOverlays: [
            ["Arrow", {
                location: 1,
                id: "arrow",
                length: 10,
                width: 12,
                foldback: 0.623
            }],
            // ["Label", {
            //     location: 0.75,
            //     label: "con", id: "label",
            //     cssClass: "aLabel"
            // }],
            ["Label", {
                location: 0.25,
                label: "x", id: "del_connection",
                cssClass: "dLabel",
                events: {
                    click: function (labelOverlay, originalEvent) {
                        // 删除连接
                        if (flowChartKit.activeConnection != null) {
                            flowChartKit.delConnection(flowChartKit.activeConnection);
                            flowChartKit.activeConnection = null;
                        }
                    }
                }
            }],
        ],
        Container: cfg.containerId
    });
    flowChartKit.jsPlumbIns = jsPlumbIns;

    // jsPlumbIns.importDefaults({
    //     Connector: ["Bezier", { curviness: 150 }],
    //     Anchors: ["TopCenter", "BottomCenter"]
    // });

    // bind a click listener to each connection; the connection is deleted. you could of course
    // just do this: instance.bind("click", instance.deleteConnection), but I wanted to make it clear what was
    // happening.
    jsPlumbIns.bind("click", function (c) {
        // jsPlumbIns.deleteConnection(c);
        flowChartKit.doCallback(flowChartKit.CallbackTypes.onClickConnection, c);
    });

    // bind a connection listener. note that the parameter passed to this function contains more than
    // just the new connection - see the documentation for a full list of what is included in 'info'.
    // this listener sets the connection's internal
    // id as the label overlay's text.
    jsPlumbIns.bind("connection", function (info) {
        // info.connection.getOverlay("label").setLabel(info.connection.id);
        // console.log(info.connection)
        // console.log("source==" + info.connection.source.id)
        // console.log("target==" + info.connection.target.id)
        flowChartKit.doCallback(flowChartKit.CallbackTypes.connection, info.connection);
    });

    jsPlumbIns.bind("connectionDetached", function (info) {
        // info.connection.getOverlay("label").setLabel(info.connection.id);
        // console.log("connectionDetached==" + info.connection.id);
        flowChartKit.doCallback(flowChartKit.CallbackTypes.connectionDetached, info.connection);
    });

    jsPlumbIns.bind("connectionMoved", function (info) {
        // info.connection.getOverlay("label").setLabel(info.connection.id);
        // console.log("connectionMoved==" + info.connection.id);
        flowChartKit.doCallback(flowChartKit.CallbackTypes.connectionMoved, info.connection);
    });

    jsPlumbIns.bind("mouseover", function (connection) {
        // info.connection.getOverlay("label").setLabel(info.connection.id);
        flowChartKit.activeConnection = connection
    });

    jsPlumbIns.bind("mouseout", function (connection) {
        // info.connection.getOverlay("label").setLabel(info.connection.id);
        flowChartKit.activeConnection = null;
    });

    // delete group button
    jsPlumb.on(container, "click", ".del", function () {
        var node = this.parentNode.getAttribute("jpNode");
        // jsPlumbIns.removeGroup(node, this.getAttribute("delete-all") != null);
        // jsPlumbIns.deleteConnectionsForElement(node)
        if (node != null) {
            flowChartKit.delNode(node);
        }
    });

    // bind a double click listener to "container"; add new node when this occurs.
    /*
    jsPlumb.on(container, "dblclick", function (e) {
        flowChartKit.newNode(e.offsetX, e.offsetY, {name,"New Node"});
    });
    */
    jsPlumb.on(container, "click", function (e) {
        flowChartKit.cleanPosse();
    });

    flowChartKit.refreshGrid();

    var canvas = $("#" + flowChartKit.cfg.canvasId);
    //处理画布拖动
    canvas.on('mousedown', function (event) {
        var old = new Vector(event.pageX, event.pageY);
        canvas.on('mousemove', function (ev) {
            var now = new Vector(ev.pageX, ev.pageY);
            var diff = Vector.sub(now, old);
            var pos = new Vector(container.offset().left, container.offset().top);
            pos = Vector.add(pos, diff);
            container.offset({ left: pos.x, top: pos.y });
            old = now;
        });
    });

    canvas.on('mouseup', function (event) {
        //要先关mousemove
        canvas.off('mousemove');
        //重置流程图panel的中心点
        flowChartKit.resetZoomCenter();
    });
    canvas.mouseleave(function (ev) {
        //要先关mousemove
        canvas.off('mousemove');
        //重置流程图panel的中心点
        flowChartKit.resetZoomCenter();
    });
    //============================================
    //处理画布缩放
    canvas.bind('mousewheel', function (event) {
        // console.log(event.deltaX, event.deltaY, event.deltaFactor);
        var delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
        delta = delta * event.deltaFactor * 0.001;
        var dir = delta > 0 ? 'Up' : 'Down';
        var zoom = flowChartKit.getZoom();
        var cfg = flowChartKit.cfg;
        zoom += delta;
        zoom = zoom >= cfg.zoomRange[1] ? cfg.zoomRange[1] : zoom;
        zoom = zoom <= cfg.zoomRange[0] ? cfg.zoomRange[0] : zoom;
        flowChartKit.setZoom(zoom, flowChartKit.zoomCenter);
        return false;
    });

    return jsPlumbIns;
}

/**
 * 导入配置
 */
flowChartKit.importDefaults = function (cfg) {
    flowChartKit.jsPlumbIns.importDefaults(cfg);
}

/**
 * 刷新网格
 */
flowChartKit.refreshGrid = function (gridSize, gridCellSize) {
    var cfg = flowChartKit.cfg;
    gridSize = gridSize || cfg.gridSize;
    gridCellSize = gridCellSize || cfg.gridCellSize;
    cfg.gridSize = gridSize;
    cfg.gridCellSize = gridCellSize;
    var grid = flowChartKit.grid;
    if (grid.Cols != gridSize || gridCellSize != grid.CellSize) {
        grid.clean();
    }

    grid.init(new Vector(0, 0), cfg.gridSize, cfg.gridSize, cfg.gridCellSize);

    if (cfg.isDrawGrid) {
        grid.DebugDraw("#DCDCDC");
    } else {
        grid.clean();
    }
    var flowChartcontainer = $("#" + cfg.containerId);
    var canvas = $("#" + cfg.canvasId);
    //设置画板的高度位置及缩放
    flowChartcontainer.width(grid.Width);
    flowChartcontainer.height(grid.Height);
    var w = flowChartcontainer.width() * flowChartKit.getZoom();
    var h = flowChartcontainer.height() * flowChartKit.getZoom();
    var offsetLeft = -w / 2 + canvas.width() / 2 + canvas.offset().left;
    var offsetTop = -h / 2 + canvas.height() / 2 + canvas.offset().top;
    flowChartcontainer.offset({ left: offsetLeft, top: offsetTop });
    // var old = flowChartKit.zoomCenter;
    // flowChartKit.zoomCenter = flowChartKit.getFlowZoomCenter(canvas, flowChartcontainer, flowChartKit.getZoom());
    flowChartKit.setZoom(1);
    flowChartKit.resetZoomCenter();
}

/*
* 取得流程图的每次缩放的中心点
*/
flowChartKit.getFlowZoomCenter = function () {
    var canvas = canvas || $("#" + flowChartKit.cfg.canvasId);
    var flowPanel = flowPanel || $("#" + flowChartKit.cfg.containerId);
    var zoomVal = flowChartKit.getZoom();

    var canvasLeft = canvas.offset().left;
    var canvasTop = canvas.offset().top;
    var flowLeft = flowPanel.offset().left;
    var flowTop = flowPanel.offset().top;

    var canvasW = canvas.width();
    var canvasH = canvas.height();
    var flowW = flowPanel.width() * zoomVal;
    var flowH = flowPanel.height() * zoomVal;

    var offX = ((canvasW / 2 + canvasLeft - flowLeft) / flowW);
    var offY = ((canvasH / 2 + canvasTop - flowTop) / flowH);
    return [offX, offY];
}

/**
 * 取得节点在网格中的坐标index
 */
flowChartKit.getNodeGridPos = function (nodeId) {
    var node = $("#" + nodeId);
    var zoom = flowChartKit.getZoom();
    var pos = new Vector(node.position().left, node.position().top)
    pos = Vector.mul(pos, 1 / zoom);
    var index = flowChartKit.grid.GetCellIndexByPos(pos);
    return index;
}

/**
 * 跳转到指定节点
 */
flowChartKit.gotoNode = function (node) {
    var nodeId = null;
    if (typeof (node) == "string") {
        nodeId = node;
    } else {
        nodeId = node.id;
    }
    console.log("flowChartKit.gotoNode ===" + nodeId);
    var cfg = flowChartKit.cfg;
    var index = flowChartKit.getNodeGridPos(nodeId);
    var pos = flowChartKit.grid.GetCellPositionByIndex(index);
    var zoom = flowChartKit.getZoom();
    var flowChartcontainer = $("#" + cfg.containerId);
    var canvas = $("#" + cfg.canvasId);
    var w = flowChartcontainer.width() * zoom;
    var h = flowChartcontainer.height() * zoom;
    var left = flowChartcontainer.offset().lfet;
    var top = flowChartcontainer.offset().top;

    var left = -pos.x + canvas.width() / 2 + canvas.offset().left;
    var top = -pos.y + canvas.height() / 2 + canvas.offset().top;
    flowChartcontainer.offset({ left: left, top: top });
    flowChartKit.resetZoomCenter()
}

/**
 * 递归取得所有的下层节点
 */
flowChartKit.getAllLowerNodes = function (node) {
    var list = [];
    list.push(node);    //先把root节点加入，防止循环情况可以正常跳出
    flowChartKit._getAllLowerNodes(list, node);
    // list.shift();   //把自己去掉
    return list;
}
flowChartKit._getAllLowerNodes = function (list, node) {
    var _list = flowChartKit.getNextLowerNodes(node);
    for (i in _list) {
        //如果已经在数组里了，就跳过
        if (!list.includes(_list[i])) {
            list.push(_list[i]);
            flowChartKit._getAllLowerNodes(list, _list[i]);
        }
    }
}

/**
 * 取得下一层的节点
 */
flowChartKit.getNextLowerNodes = function (node) {
    var list = [];
    flowChartKit.jsPlumbIns.select({ source: node }).each(function (connection) {
        list.push(connection.target.id);
    });
    return list;
}

/**
 * 新建节点
 * @method newNode
 * @for flowChartKit
 * @param {int} x 位置
 * @param {int} y 位置
 * @param {Object} data  data.cfg节点数据信息，详细信息如下,data.infor 其它数据信息
 * 节点的配置说明:
 * maxIn: 1, //最大连入的线数量, 默认为-1，表示不受限制
 * maxOut: 1,//最大连出的线数量, 默认为-1，表示不受限制
 * isSource: true,//可作为连接的来源，默认为true
 * isTarget: true,//可作为连接的目标，默认为true
 * sourceAnchor: 作为来源时连线的锚点，详细参见jsplumb的说明，默认Continuous
 * targetAnchor: 作为目标时连线的锚点，详细参见jsplumb的说明，默认Continuous
 * allowLoopback: false, //是否可以自己连自己，默认为false
 * JPList:[]//里面也是节点的配置
 * @param {String} assignNodeID 指定的nodeId,当导入流程图时可以使用
 * @return {Element} 节点
 */
flowChartKit.newNode = function (x, y, data, assignNodeID) {
    var d = flowChartKit._createNode(x, y, data, assignNodeID);
    flowChartKit.doCallback(flowChartKit.CallbackTypes.onNewNode, { node: d, data: data });
    return d
}

flowChartKit._createNode = function (x, y, data, assignNodeID) {
    var name = data.cfg.name;
    if (data.infor != null && data.infor.name != null) {
        name = data.infor.name;
    }
    var maxIn = data.cfg.maxIn || -1;
    var maxOut = data.cfg.maxOut || -1;
    var allowLoopback = data.cfg.allowLoopback || false;
    var isSource = data.cfg.isSource == null ? true : data.cfg.isSource;
    var isTarget = data.cfg.isTarget == null ? true : data.cfg.isTarget;

    var jsPlumbIns = flowChartKit.jsPlumbIns
    var d = document.createElement("div");
    var id = assignNodeID || jsPlumbUtil.uuid();
    var delBtnID = "del_" + id
    d.className = "w";
    d.id = id;
    d.setAttribute("jpNode", id);       //删除节点时，需要找到这个属性来取得id值，然后删掉节点
    d.setAttribute("tabindex", "0");    //要设置这个属性，div才能接收到keypress事件
    var innerHTML = "<div class=\"del\" delete-all id=\"" + delBtnID + "\"></div>" + name;
    if (isSource) {
        innerHTML += "<div class=\"ep\"></div>";
    }
    d.innerHTML = innerHTML;
    d.style.position = "absolute";
    // d.style.left = x+"px";
    // d.style.top = y+"px";
    jsPlumbIns.getContainer().appendChild(d);

    var zoom = flowChartKit.getZoom();
    var node = $('#' + id)
    var left = x - (node.width() * zoom / 2);
    var top = y - (node.height() * zoom / 2);
    // 坐标落在gird中
    var pos = new Vector(left, top)
    // pos = flowChartKit.grid.GetNearestCellCenter(pos)
    pos = flowChartKit.grid.GetNearestCellPosition(pos);
    d.style.left = pos.x + "px";
    d.style.top = pos.y + "px";

    var isDraging = false;
    node.on('mouseover', function (ev) {
        $('#' + delBtnID).show()
    });

    node.on('mouseout', function (ev) {
        $('#' + delBtnID).hide()
    });

    node.on('mousedown', function (ev) {
        node.off('mouseover');
        console.log("mousedown");
        node.on("keydown", function (e) {
            if (e.which == 16) {
                //shift
                var list = flowChartKit.getAllLowerNodes(id);
                // flowChartKit.addToPosse(id);
                for(i in list) {
                    console.log(list[i])
                }
                flowChartKit.addToPosse(list);
            }
        });
        node.on("keyup", function (e) {
            if (e.which == 16) {
                //shift
                flowChartKit.cleanPosse();
            }
        });
        node.focus();

        node.on('mousemove', function (ev) {
            isDraging = true;
            $('#' + delBtnID).hide()
        });
    });

    node.on('mouseup', function (ev) {
        if (isDraging) {
            // 坐标落在grid中
            console.log("坐标落在grid中");
            var zoom = flowChartKit.getZoom();
            var pos = new Vector(node.position().left, node.position().top)
            pos = Vector.mul(pos, 1 / zoom);
            // pos = flowChartKit.grid.GetNearestCellCenter(pos);
            pos = flowChartKit.grid.GetNearestCellPosition(pos);
            d.style.left = pos.x + "px";
            d.style.top = pos.y + "px";
            flowChartKit.jsPlumbIns.revalidate(id); //通知jsPlumb某个元素有变化
        }
        node.off("keydown");
        flowChartKit.cleanPosse();
        node.off('mousemove');
        node.on('mouseover', function (ev) {
            $('#' + delBtnID).show()
        });
        isDraging = false;
    });
    node.on("click", function (ev) {
        flowChartKit.doCallback(flowChartKit.CallbackTypes.onClickNode, { node: d, data: data });
    });

    d = flowChartKit.initNode(d, data);
    return d;
}

/**
 * 初始化节点
 * @method initNode
 * @for flowChartKit
 * @param {jsPlumb} jsPlumbIns jsPlumb的实例
 * @param {Element} el Element对象
 * @param {int} maxIn 节点作为目标时，最大可被节点连接的数量
 * @param {int} maxOut 节点作为源时，最大可连接其它节点的数量
 * @param {bool} allowLoopback 是否可以自己连接自己
 * @return {Element} 节点
 */
flowChartKit.initNode = function (el, data) {
    var jsPlumbIns = flowChartKit.jsPlumbIns
    var maxIn = data.cfg.maxIn || -1;
    var maxOut = data.cfg.maxOut || -1;
    var allowLoopback = data.cfg.allowLoopback || false;
    var isSource = data.cfg.isSource == null ? true : data.cfg.isSource;
    var isTarget = data.cfg.isTarget == null ? true : data.cfg.isTarget;
    var sourceAnchor = data.cfg.sourceAnchor || "Continuous";
    var targetAnchor = data.cfg.targetAnchor || "Continuous";

    // initialise draggable elements.
    // jsPlumbIns.draggable(el, { grid: [flowChartKit.grid.CellSize, flowChartKit.grid.CellSize] });
    flowChartKit.nodes[el.id] = el;
    jsPlumbIns.draggable(el);

    if (isSource && maxOut != 0) {
        jsPlumbIns.makeSource(el, {
            filter: ".ep",
            anchor: sourceAnchor,
            allowLoopback: allowLoopback,
            connectorStyle: { stroke: flowChartKit.lineColor, strokeWidth: 2, outlineStroke: "transparent", outlineWidth: 4 },
            connectionType: "basic",
            extract: {
                "action": "the-action"
            },
            maxConnections: maxOut,
            onMaxConnections: function (info, e) {
                alert("已经到达最大子节点连接数：" + info.maxConnections + "!");
            }
        });
    }
    if (isTarget && maxIn != 0) {
        jsPlumbIns.makeTarget(el, {
            dropOptions: { hoverClass: "dragHover" },
            anchor: targetAnchor,
            maxConnections: maxIn,
            allowLoopback: allowLoopback,
            onMaxConnections: function (info, e) {
                alert("已经到达最大父节点连接数：" + info.maxConnections + "!");
            },
        });
    }

    // this is not part of the core demo functionality; it is a means for the Toolkit edition's wrapped
    // version of this demo to find out about new nodes being added.
    //
    jsPlumbIns.fire("jsPlumbNodeAdded", el);
    return el;
};

flowChartKit.newListNode = function (
    x, y, data, assignNodeID) {
    var dataList = data.cfg.JPList;

    var instance = flowChartKit.jsPlumbIns;
    var node = flowChartKit._createNode(x, y, data, assignNodeID);

    var jqNode = $("#" + node.id);
    var listId = "list_" + node.id;
    jqNode.attr("JPListNode", true);
    var listHtml = "<div class=\"list list-lhs\" >";
    listHtml += "<ul id=\"" + listId + "\">"
    var tmpLidt = null;

    //如果有jp_children，说明导入流程图
    var jp_children = data.cfg.jp_children;
    if (jp_children != null) {
        tmpLidt = jp_children;
    } else {
        tmpLidt = dataList;
    }

    for (i = 0; i < tmpLidt.length; i++) {
        listHtml += "<li ";
        var childAssignNodeID = tmpLidt[i].jp_nid || jsPlumbUtil.uuid(); //指定子节点的id，导入流程图需要用到
        var index = tmpLidt[i].jp_dataIndex || i
        listHtml += " id=\"" + childAssignNodeID + "\"";
        listHtml += " dataIndex=\"" + index + "\">" + dataList[index].name + "</li>";
    }
    listHtml += "</ui></div>";
    jqNode.append(listHtml);

    var items = node.querySelectorAll("li");
    instance.batch(function () {
        // configure items
        for (var i = 0; i < items.length; i++) {
            var dataIndex = parseInt(items[i].getAttribute("dataIndex"));
            var subData = dataList[dataIndex];
            var maxIn = subData.maxIn || -1;
            var maxOut = subData.maxOut || -1;
            var allowLoopback = subData.allowLoopback || false;
            var isSource = subData.isSource == null ? true : subData.isSource;
            var isTarget = subData.isTarget == null ? true : subData.isTarget;

            if (isSource) {
                instance.makeSource(items[i], {
                    allowLoopback: allowLoopback,
                    maxConnections: maxOut,
                    connectorStyle: { stroke: flowChartKit.lineColor, strokeWidth: 2, outlineStroke: "transparent", outlineWidth: 4 },
                    anchor: ["Left", "Right"]
                });
            }

            if (isTarget) {
                instance.makeTarget(items[i], {
                    allowLoopback: allowLoopback,
                    maxConnections: maxIn,
                    anchor: ["Left", "Right"]
                });
            }
        }
    });
    instance.addList(document.querySelector("#" + listId));
    flowChartKit.doCallback(flowChartKit.CallbackTypes.onNewNode, { node: node, data: data, children: items });
    return node;
}

flowChartKit.addPoint = function () {

}

flowChartKit.connect = function (source, target, label, anchor, endPoint) {
    var common = {}
    if (label != null) {
        common["overlays"] = [
            ["Label", { label: label, id: "label", location: 0.75 }]];
    }
    if (anchor != null) {
        common["anchors"] = anchor;
        // } else {
        //     common["anchors"] = ["AutoDefault"];
    }
    if (endPoint != null) {
        common["endpoint"] = endPoint;
    }
    common.paintStyle = { stroke: flowChartKit.lineColor, strokeWidth: 2, outlineStroke: "transparent", outlineWidth: 4 };
    flowChartKit._connect(source, target, common);
}

flowChartKit._connect = function (source, target, common) {
    if (common != null) {
        flowChartKit.jsPlumbIns.connect({
            source: source, target: target,
        }, common);
    } else {
        flowChartKit.jsPlumbIns.connect({
            source: source, target: target,
        });
    }
}

/**
 * 删除节点
 * @method delNode
 * @for flowChartKit
 * @param {jsPlumb} jsPlumbIns jsPlumb的实例
 * @param {Element} node Element对象
 */
flowChartKit.delNode = function (node) {
    if (node == null) return;
    var nodeId = "";
    if (typeof (node) == "string") {
        nodeId = node;
    } else {
        nodeId = node.id;
    }
    var jsPlumbIns = flowChartKit.jsPlumbIns
    // jsPlumbIns.removeGroup(node, true);
    jsPlumbIns.remove(node)
    jsPlumbIns.deleteConnectionsForElement(node)
    flowChartKit.nodes[nodeId] = null;
    delete flowChartKit.nodes[nodeId];
    flowChartKit.doCallback(flowChartKit.CallbackTypes.onDeleteNode, { nodeID: nodeId });
}

/**
 * 删除连接
 * @method delConnection
 * @for flowChartKit
 * @param {Connection} connection 连接对象
 */
flowChartKit.delConnection = function (connection) {
    flowChartKit.jsPlumbIns.deleteConnection(connection);
}

flowChartKit.getNodeById = function () {

}

flowChartKit.getConnectionById = function (id) {
    var list = flowChartKit.jsPlumbIns.getConnections({ id: id }, true);
    if (list.length > 0) {
        return list[0];
    }
    return null;
}

/**
 * 清除
 */
flowChartKit.clean = function () {
    flowChartKit.activeConnection = null;
    flowChartKit.cleanPosse();

    for (k in flowChartKit.nodes) {
        flowChartKit.delNode(flowChartKit.nodes[k]);
    }
    flowChartKit.nodes = {};
    flowChartKit.jsPlumbIns.clear();
    flowChartKit.jsPlumbIns.reset(true);
    flowChartKit.refreshGrid();
}

flowChartKit.doCallback = function (callbackType, parmas) {
    for (x in flowChartKit.callbaksArray) {
        var callbackObj = flowChartKit.callbaksArray[x];
        var callback = callbackObj[callbackType];
        if (callback != null) {
            callback(parmas);
        }
    }
}

flowChartKit.getZoom = function () {
    return flowChartKit.jsPlumbIns.getZoom();
}

/*
el is a DOM element. You don't have to pass in el; if you do not, it uses the Container from the jsPlumb instance.
transformOrigin is optional; it defaults to [0.5, 0.5] - the middle of the element (this is the browser default too)
instance is an instance of jsPlumb - either jsPlumb, the static instance, or some instance you got through jsPlumb.newInstance(...). The function will default to using the static instance of jsPlumb if you do not provide one.
zoom is a decimal where 1 means 100%.
*/
flowChartKit.setZoom = function (zoom, transformOrigin, el) {
    var instance = flowChartKit.jsPlumbIns;
    // transformOrigin = transformOrigin || [0.5, 0.5];
    el = el || instance.getContainer();
    var p = ["webkit", "moz", "ms", "o"],
        s = "scale(" + zoom + ")";
    var oString = "";
    if (transformOrigin != null) {
        oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";
    }

    for (var i = 0; i < p.length; i++) {
        if (transformOrigin != null) {
            el.style[p[i] + "TransformOrigin"] = oString;
        }
        el.style[p[i] + "Transform"] = s;
    }

    if (transformOrigin != null) {
        el.style["transformOrigin"] = oString;
    }
    el.style["transform"] = s;

    instance.setZoom(zoom);
    // flowChartKit.grid.zoom(zoom);
    var zoomRange = flowChartKit.cfg.zoomRange;
    var zoomPersent = (zoom - zoomRange[0]) / (zoomRange[1] - zoomRange[0]);
    flowChartKit.doCallback(flowChartKit.CallbackTypes.onZooming, zoomPersent)
};
/**
 * 重新设置画布的重心
 */
flowChartKit.resetZoomCenter = function () {
    var newCenter = flowChartKit.getFlowZoomCenter();
    var old = flowChartKit.zoomCenter;
    flowChartKit.setZoomCenter(newCenter, old);
    flowChartKit.zoomCenter = newCenter;
}

flowChartKit.setZoomCenter = function (transformOrigin, oldOrigin, el) {
    var instance = flowChartKit.jsPlumbIns;
    el = el || instance.getContainer();

    //修正坐标
    var zoom = flowChartKit.getZoom();
    var offsetX = (transformOrigin[0] - oldOrigin[0]);
    var offsetY = (transformOrigin[1] - oldOrigin[1]);
    offsetX = offsetX * parseInt(el.style.width) * (zoom - 1);
    offsetY = offsetY * parseInt(el.style.height) * (zoom - 1);
    var x = parseFloat(el.style.left);
    var y = parseFloat(el.style.top);

    //=====================================
    var p = ["webkit", "moz", "ms", "o"],
        oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";

    for (var i = 0; i < p.length; i++) {
        el.style[p[i] + "TransformOrigin"] = oString;
    }

    el.style["transformOrigin"] = oString;

    //修正坐标
    el.style.left = (x + offsetX) + "px";
    el.style.top = (y + offsetY) + "px";
};

/**
 * 把节点加到组里
 */
flowChartKit.addToPosse = function (nodeId) {
    flowChartKit.jsPlumbIns.addToPosse(nodeId, flowChartKit.posseId);

    var nodes = !myUtl.isString(nodeId) && (nodeId.tagName == null && nodeId.length != null) ? nodeId : [nodeId];
    for (i in nodes) {
        flowChartKit.currPosse[nodes[i]] = true;
    }
}


/**
 * 把节点移除出组
 */
flowChartKit.removeFromPosse = function (nodeId) {
    flowChartKit.jsPlumbIns.removeFromPosse(nodeId, flowChartKit.posseId);

    var nodes = !myUtl.isString(nodeId) && (nodeId.tagName == null && nodeId.length != null) ? nodeId : [nodeId];
    for (i in nodes) {
        delete flowChartKit.currPosse[nodes[i]];
    }
}

/**
 * 清空组
 */
flowChartKit.cleanPosse = function () {
    for (k in flowChartKit.currPosse) {
        flowChartKit.jsPlumbIns.removeFromAllPosses(k);
    }
    flowChartKit.currPosse = {};
}

// 处理当左边树节点的事件
flowChartKit.treeNodeEventDelegate = {
    [myTree.CallbackTypes.onClick]:
        function (node, event) {
            //onclick node
        },
    [myTree.CallbackTypes.onDragStart]:
        function (node, event) {
            //drag start
        },
    [myTree.CallbackTypes.onDrag]:
        function (node, event) {
            //drag
        },
    [myTree.CallbackTypes.onDragStop]:
        function (node, event) {
            //dtarg stop
        }
}
