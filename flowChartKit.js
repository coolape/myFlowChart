var flowChartKit = {}


/**
 * 初始化
 * @method init
 * @for flowChartKit
 * @param {jsPlumb} jsPlumbIns jsPlumb的实例
 */
flowChartKit.init = function (jsPlumbIns, ) {
    var canvas = jsPlumbIns.Defaults.Container;
    canvas = document.getElementById(canvas)
    // delete group button
    jsPlumb.on(canvas, "click", ".del", function () {
        var node = this.parentNode.getAttribute("jpNode");
        // jsPlumbIns.removeGroup(node, this.getAttribute("delete-all") != null);
        // jsPlumbIns.deleteConnectionsForElement(node)
        if (node != null) {
            flowChartKit.delNode(jsPlumbIns, node);
        }
    });

    // bind a click listener to each connection; the connection is deleted. you could of course
    // just do this: instance.bind("click", instance.deleteConnection), but I wanted to make it clear what was
    // happening.
    jsPlumbIns.bind("click", function (c) {
        jsPlumbIns.deleteConnection(c);
    });

    // bind a connection listener. note that the parameter passed to this function contains more than
    // just the new connection - see the documentation for a full list of what is included in 'info'.
    // this listener sets the connection's internal
    // id as the label overlay's text.
    jsPlumbIns.bind("connection", function (info) {
        // info.connection.getOverlay("label").setLabel(info.connection.id);
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
    // bind a double click listener to "canvas"; add new node when this occurs.
    jsPlumb.on(canvas, "dblclick", function (e) {
        flowChartKit.newNode(jsPlumbIns, null, e.offsetX, e.offsetY, "New Node");
    });
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
flowChartKit.newNode = function (jsPlumbIns, id, x, y, name) {
    var d = document.createElement("div");
    if (id == null) {
        id = jsPlumbUtil.uuid();
    }
    d.className = "w";
    d.id = id;
    d.setAttribute("jpNode", id)
    d.innerHTML = "<div class=\"del\" delete-all></div>" + name + "<div class=\"ep\"></div>";
    d.style.left = x + "px";
    d.style.top = y + "px";
    jsPlumbIns.getContainer().appendChild(d);
    flowChartKit.initNode(jsPlumbIns, d, 1, 1, false);
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
flowChartKit.initNode = function (jsPlumbIns, el, maxIn, maxOut, allowLoopback) {
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
flowChartKit.delNode = function (jsPlumbIns, node) {
    // jsPlumbIns.removeGroup(node, true);
    jsPlumbIns.deleteConnectionsForElement(node)
    jsPlumbIns.remove(node)
}

flowChartKit.addPoint = function () {

}

flowChartKit.connect = function () {

}

flowChartKit.delConnection = function () {

}

flowChartKit.getNodeInfor = function () {

}

flowChartKit.getConnectionInfor = function () {

}
