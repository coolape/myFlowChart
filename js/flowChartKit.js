var flowChartKit = {}

//连接类型枚举
flowChartKit.Connector = {
    Bezier: "Bezier",
    Straight: "Straight",
    StateMachine: "StateMachine",
    Flowchart: "Flowchart",
}

flowChartKit.activeConnection = null;   // 活动的连接
flowChartKit.jsPlumbIns = null;   // jsPlumb的实例

/**
 * 初始化
 * @method init
 * @for flowChartKit
 * @param {String} container 容器id
 * @param {flowChartKit.Connector} connector 连接类型
 */
flowChartKit.init = function (container, connector, onClickNode, onClickConnection) {
    var w = $("#"+container).width()
    var h = $("#"+container).height()
    $("#"+container).width(w*10)
    $("#"+container).height(h*10)
    var color = "#E8C870";
    var jsPlumbIns = jsPlumb.getInstance({
        Endpoint: ["Dot", { radius: 5 }],
        EndpointStyle: { fill: "#ffa500" },
        Connector: connector,
        HoverPaintStyle: { stroke: "#1e8151", strokeWidth: 2 },
        ConnectionOverlays: [
            ["Arrow", {
                location: 1,
                id: "arrow",
                length: 8,
                width: 10,
                foldback: 0.623
            }],
            ["Label", {
                location: 0.75,
                label: "con", id: "label",
                cssClass: "aLabel"
            }],
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
        Container: container
    });

    var canvas = jsPlumbIns.Defaults.Container;
    canvas = document.getElementById(canvas);

    // jsPlumbIns.importDefaults({
    //     Connector: ["Bezier", { curviness: 150 }],
    //     Anchors: ["TopCenter", "BottomCenter"]
    // });

    // bind a click listener to each connection; the connection is deleted. you could of course
    // just do this: instance.bind("click", instance.deleteConnection), but I wanted to make it clear what was
    // happening.
    jsPlumbIns.bind("click", function (c) {
        // jsPlumbIns.deleteConnection(c);
        if (onClickConnection != null) {
            onClickConnection(c)
        }
    });

    // bind a connection listener. note that the parameter passed to this function contains more than
    // just the new connection - see the documentation for a full list of what is included in 'info'.
    // this listener sets the connection's internal
    // id as the label overlay's text.
    jsPlumbIns.bind("connection", function (info) {
        info.connection.getOverlay("label").setLabel(info.connection.id);
        console.log("connection==" + info.connection.id);
        console.log("source==" + info.connection.source.id)
        console.log("target==" + info.connection.target.id)
    });

    jsPlumbIns.bind("connectionDetached", function (info) {
        // info.connection.getOverlay("label").setLabel(info.connection.id);
        console.log("connectionDetached==" + info.connection.id);
    });

    jsPlumbIns.bind("connectionMoved", function (info) {
        // info.connection.getOverlay("label").setLabel(info.connection.id);
        console.log("connectionMoved==" + info.connection.id);
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
    jsPlumb.on(canvas, "click", ".del", function () {
        var node = this.parentNode.getAttribute("jpNode");
        // jsPlumbIns.removeGroup(node, this.getAttribute("delete-all") != null);
        // jsPlumbIns.deleteConnectionsForElement(node)
        if (node != null) {
            flowChartKit.delNode(node);
        }
    });

    // bind a double click listener to "canvas"; add new node when this occurs.
    jsPlumb.on(canvas, "dblclick", function (e) {
        flowChartKit.newNode(null, e.offsetX, e.offsetY, "New Node");
    });
    flowChartKit.jsPlumbIns = jsPlumbIns;
    return jsPlumbIns;
}

/**
 * 新建节点
 * @method newNode
 * @for flowChartKit
 * @param {jsPlumb} jsPlumbIns jsPlumb的实例
 * @param {Element} el Element对象
 * @param {int} x 位置
 * @param {int} y 位置
 * @param {String} name 节点名
 * @return {Element} 节点
 */
flowChartKit.newNode = function (id, x, y, name) {
    var jsPlumbIns = flowChartKit.jsPlumbIns
    var d = document.createElement("div");
    if (id == null) {
        id = jsPlumbUtil.uuid();
    }
    var delBtnID = "del_" + id
    d.className = "w";
    d.id = id;
    d.setAttribute("jpNode", id)
    d.innerHTML = "<div class=\"del\" delete-all id=\"" + delBtnID + "\"></div>" + name + "<div class=\"ep\"></div>";
    d.style.left = x + "px";
    d.style.top = y + "px";
    jsPlumbIns.getContainer().appendChild(d);

    $('#' + id).on('mouseover', function (ev) {
        $('#' + delBtnID).show()
    });

    $('#' + id).on('mouseout', function (ev) {
        $('#' + delBtnID).hide()
    });

    $('#' + id).on('mousedown', function (ev) {
        $('#' + id).off('mouseover');
        $('#' + id).on('mousemove', function (ev) {
            $('#' + delBtnID).hide()
        });
    });

    $('#' + id).on('mouseup', function (ev) {
        $('#' + id).off('mousemove');
        $('#' + id).on('mouseover', function (ev) {
            $('#' + delBtnID).show()
        });
    });

    flowChartKit.initNode(d, -1, -1, false);
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
flowChartKit.initNode = function (el, maxIn, maxOut, allowLoopback) {
    var jsPlumbIns = flowChartKit.jsPlumbIns
    // initialise draggable elements.
    jsPlumbIns.draggable(el);

    jsPlumbIns.makeSource(el, {
        filter: ".ep",
        anchor: "Continuous",
        connectorStyle: { stroke: "#5c96bc", strokeWidth: 2, outlineStroke: "transparent", outlineWidth: 4 },
        connectionType: "basic",
        extract: {
            "action": "the-action"
        },
        maxConnections: maxOut,
        onMaxConnections: function (info, e) {
            alert("Maximum connections (" + info.maxConnections + ") reached");
        }
    });

    jsPlumbIns.makeTarget(el, {
        dropOptions: { hoverClass: "dragHover" },
        anchor: "Continuous",
        maxConnections: maxIn,
        allowLoopback: allowLoopback,
        onMaxConnections: function (info, e) {
            alert("Maximum connections (" + info.maxConnections + ") reached");
        },
    });

    // this is not part of the core demo functionality; it is a means for the Toolkit edition's wrapped
    // version of this demo to find out about new nodes being added.
    //
    // jsPlumbIns.fire("jsPlumbDemoNodeAdded", el);
    return el;
};

/**
 * 删除节点
 * @method delNode
 * @for flowChartKit
 * @param {jsPlumb} jsPlumbIns jsPlumb的实例
 * @param {Element} node Element对象
 */
flowChartKit.delNode = function (node) {
    var jsPlumbIns = flowChartKit.jsPlumbIns
    // jsPlumbIns.removeGroup(node, true);
    jsPlumbIns.deleteConnectionsForElement(node)
    jsPlumbIns.remove(node)
}

flowChartKit.addPoint = function () {

}

flowChartKit.connect = function () {

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

flowChartKit.getNodeInfor = function () {

}

flowChartKit.getConnectionInfor = function () {

}

flowChartKit.clean = function () {
    flowChartKit.activeConnection = null;
}

flowChartKit.getZoom = function()
{
    return flowChartKit.jsPlumbIns.getZoom();
}

/*
el is a DOM element. You don't have to pass in el; if you do not, it uses the Container from the jsPlumb instance.
transformOrigin is optional; it defaults to [0.5, 0.5] - the middle of the element (this is the browser default too)
instance is an instance of jsPlumb - either jsPlumb, the static instance, or some instance you got through jsPlumb.newInstance(...). The function will default to using the static instance of jsPlumb if you do not provide one.
zoom is a decimal where 1 means 100%.
*/
flowChartKit.setZoom = function (zoom, instance, transformOrigin, el) {
    instance = instance || flowChartKit.jsPlumbIns;
    transformOrigin = transformOrigin || [0.5, 0.5];
    instance = instance || jsPlumb;
    el = el || instance.getContainer();
    var p = ["webkit", "moz", "ms", "o"],
        s = "scale(" + zoom + ")",
        oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";

    for (var i = 0; i < p.length; i++) {
        el.style[p[i] + "Transform"] = s;
        el.style[p[i] + "TransformOrigin"] = oString;
    }

    el.style["transform"] = s;
    el.style["transformOrigin"] = oString;

    instance.setZoom(zoom);
};
