var main = {}
/* 节点的配置说明
maxIn: 1, //最大连入的线数量, 默认为-1，表示不受限制
maxOut: 1,//最大连出的线数量, 默认为-1，表示不受限制
isSource: true,//可作为连接的来源，默认为true
isTarget: true,//可作为连接的目标，默认为true
allowLoopback: false, //是否可以自己连自己，默认为false
list:[]//里面也是节点的配置
*/
var treeData = [
  {
    name: "IVR流程",
    isParentNode: true,
    id: 1,
    children: [
      {
        id: 2,
        cmd: 1,
        name: "播放录音",
        maxIn: 1, //最大连入的线数量, 默认为-1，表示不受限制
        maxOut: 1,//最大连出的线数量, 默认为-1，表示不受限制
        isSource: true,//可作为连接的来源，默认为true
        isTarget: true,//可作为连接的目标，默认为true
        allowLoopback: false, //是否可以自己连自己，默认为false
      },
      {
        id: 3,
        cmd: 2,
        name: "重听",
        maxIn: 1, //最大连入的线数量, 默认为-1，表示不受限制
        maxOut: 1,//最大连出的线数量, 默认为-1，表示不受限制
      },
      {
        id: 4,
        cmd: 3,
        name: "返回上一层",
        maxIn: 1, //最大连入的线数量, 默认为-1，表示不受限制
        maxOut: 1,//最大连出的线数量, 默认为-1，表示不受限制
      },
      {
        id: 5,
        cmd: 4,
        name: "转人工",
        maxIn: 1, //最大连入的线数量, 默认为-1，表示不受限制
        maxOut: 1,//最大连出的线数量, 默认为-1，表示不受限制
      },
      {
        id: 5,
        cmd: 999,
        name: "按键",
        maxIn: 1,
        maxOut: 0,
        isSource: false,
        isTarget: true,
        list: [
          { name: "键1", cmd: 1010, maxIn: 0, maxOut: 1, isSource: true, isTarget: false, },
          { name: "键2", cmd: 1011, maxIn: 0, maxOut: 1, isSource: true, isTarget: false, },
          { name: "键3", cmd: 1011, maxIn: 0, maxOut: 1, isSource: true, isTarget: false, },
          { name: "键4", cmd: 1011, maxIn: 0, maxOut: 1, isSource: true, isTarget: false, },
          { name: "键5", cmd: 1011, maxIn: 0, maxOut: 1, isSource: true, isTarget: false, },
          { name: "键6", cmd: 1011, maxIn: 0, maxOut: 1, isSource: true, isTarget: false, },
          { name: "键7", cmd: 1011, maxIn: 0, maxOut: 1, isSource: true, isTarget: false, },
          { name: "键8", cmd: 1011, maxIn: 0, maxOut: 1, isSource: true, isTarget: false, },
          { name: "键9", cmd: 1011, maxIn: 0, maxOut: 1, isSource: true, isTarget: false, },
          { name: "键0", cmd: 1019, maxIn: 0, maxOut: 1, isSource: true, isTarget: false, },
          { name: "键#", cmd: 1020, maxIn: 0, maxOut: 1, isSource: true, isTarget: false, },
          { name: "键*", cmd: 1021, maxIn: 0, maxOut: 1, isSource: true, isTarget: false, },
        ],
      },
    ]
  }
];

//树的数据
main.getTreeData = function () {
  return treeData;
}

main.getTreeDataByCmd = function (treeData, cmd) {
  for (index in treeData) {
    var ret = main.eachGetTreeDataByCmd(treeData[index], cmd);
    if (ret != null) {
      return ret;
    }
  }
  return null;
}

main.eachGetTreeDataByCmd = function (treeData, cmd) {
  if (treeData.cmd != null) {
    if (treeData.cmd == cmd) {
      return treeData;
    }
  }
  if (treeData.children != null) {
    return main.getTreeDataByCmd(treeData.children, cmd);
  }
}

/*
* 取得流程图的每次缩放的中心点
*/
main.getFlowZoomCenter = function (canvas, flowPanel, zoomVal) {
  var canvasLeft = canvas.offset().left;
  var canvasTop = canvas.offset().top;
  var flowLeft = flowPanel.offset().left;
  var flowTop = flowPanel.offset().top;

  var canvasW = canvas.width();
  var canvasH = canvas.height();
  var flowW = flowPanel.width();
  var flowH = flowPanel.height();


  var offX = ((canvasW / 2 + canvasLeft - flowLeft) / flowW) / zoomVal;
  var offY = ((canvasH / 2 + canvasTop - flowTop) / flowH) / zoomVal;
  return [offX, offY];
}

main.doNewNode = function (x, y, nodeData, assignNodeID) {
  if (nodeData.list != null) {
    flowChartKit.newListNode(x, y, nodeData, assignNodeID);
  } else {
    flowChartKit.newNode(x, y, nodeData, assignNodeID);
  }
}

//特殊处理的节点
main.specNewNode = function (x, y, nodeData) {
  flowChartKit.jsPlumbIns.batch(function () {
    var node1 = flowChartKit.newNode(x, y, nodeData);
    var node2 = flowChartKit.newListNode(x + 100, y-50,
      main.getTreeDataByCmd(main.getTreeData(), 999));
    flowChartKit.connect(node1, node2);
  });
}

// flowchart处理
jsPlumb.ready(function () {
  console.log("jsPlumb is ready to use");

  //画布
  var canvas = $("#flow-canvas");
  //流程图的panel
  var contanerId = "flow-panel"
  var flowChartContaner = $('#' + contanerId)
  //============================================
  //设置网格
  var origin = new Vector(canvas.offset().left, canvas.offset().top)
  var grid = Grid.new(contanerId, origin, 1000, 1000, 20);
  // grid.DebugDraw("#DCDCDC");//TODO:画线还有问题，影响性，且还要影响拖动创建节点的坐标位置，导致位置不正确
  //============================================
  //设置画板的高度位置及缩放
  flowChartContaner.width(grid.Width);
  flowChartContaner.height(grid.Height);
  var offsetLeft = -flowChartContaner.width() / 2 + canvas.width() / 2 + canvas.offset().left;
  var offsetTop = -flowChartContaner.height() / 2 + canvas.height() / 2 + canvas.offset().top;
  flowChartContaner.offset({ left: offsetLeft, top: offsetTop });
  var zoomCenter = main.getFlowZoomCenter(canvas, flowChartContaner, 1);
  //============================================
  //Initialize JsPlumb
  var instance = flowChartKit.init(grid, contanerId, flowChartKit.Connector.StateMachine, myDataProc);
  flowChartKit.setZoom(1, zoomCenter);
  //============================================
  //处理画布拖动
  canvas.on('mousedown', function (event) {
    var old = new Vector(event.pageX, event.pageY);
    canvas.on('mousemove', function (ev) {
      var now = new Vector(ev.pageX, ev.pageY);
      var diff = Vector.sub(now, old);
      // diff = Vector.mul(diff, 1/flowChartKit.getZoom())
      // console.log(diff)
      var pos = new Vector(flowChartContaner.offset().left, flowChartContaner.offset().top);
      pos = Vector.add(pos, diff);
      flowChartContaner.offset({ left: pos.x, top: pos.y });
      old = now;
    });
  });
  canvas.on('mouseup', function (event) {
    //要先关mousemove
    canvas.off('mousemove');
    //重置流程图panel的中心点
    var old = zoomCenter
    zoomCenter = main.getFlowZoomCenter(canvas, flowChartContaner, flowChartKit.getZoom());
    flowChartKit.setZoomCenter(zoomCenter, old);
  });
  canvas.mouseleave(function (ev) {
    //要先关mousemove
    canvas.off('mousemove');
    //重置流程图panel的中心点
    var old = zoomCenter
    zoomCenter = main.getFlowZoomCenter(canvas, flowChartContaner, flowChartKit.getZoom());
    flowChartKit.setZoomCenter(zoomCenter, old);
  });
  //============================================
  //处理画布缩放
  canvas.bind('mousewheel', function (event) {
    // console.log(event.deltaX, event.deltaY, event.deltaFactor);
    var delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    delta = delta * event.deltaFactor * 0.001;
    var dir = delta > 0 ? 'Up' : 'Down';
    var zoom = flowChartKit.getZoom();
    zoom += delta;
    zoom = zoom > 3 ? 3 : zoom;
    zoom = zoom < 0.1 ? 0.1 : zoom;
    flowChartKit.setZoom(zoom, zoomCenter);
    return false;
  });
  //============================================
  //Initialize Control Tree View
  var isOverFlowChartCanvas = function (e) {
    var targetCollisionDiv = canvas;
    return (
      e.pageX > targetCollisionDiv.offset().left &&
      e.pageX <
      targetCollisionDiv.offset().left +
      targetCollisionDiv.width() &&
      e.pageY > targetCollisionDiv.offset().top &&
      e.pageY <
      targetCollisionDiv.offset().top + targetCollisionDiv.height()
    );
  }

  var isDragingTreeNode = false;
  $(function () {
    $('#control-panel').tree({
      data: main.getTreeData(),
      autoOpen: true,
      dragAndDrop: true,
      onCanMove: function (node) {
        return !node.isParentNode;
      },
      onCanMoveTo: function (moved_node, target_node, position) {
        //返回false后，就不能拖动改变tree的位置了
        return false;
      },
      onDragMove: function (node, event) {
        // flowChartContaner.trigger("mouseover", event);
        if (!isDragingTreeNode) {
          //drag start
        }
        isDragingTreeNode = true;
      },
      onDragStop: function (node, event) {
        isDragingTreeNode = false;
        if (isOverFlowChartCanvas(event)) {
          var mx = (event.pageX - flowChartContaner.offset().left) / flowChartKit.getZoom();
          var my = (event.pageY - flowChartContaner.offset().top) / flowChartKit.getZoom();
          if (node.cmd == 1) {
            main.specNewNode(mx, my, node);
          } else {
            main.doNewNode(mx, my, node);
          }
        }
      },
    });
  });

  jsPlumb.fire("jsFlowLoaded", instance);

});
