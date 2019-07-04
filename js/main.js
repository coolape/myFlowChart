var main = {}
/* 节点的配置说明
maxIn: 1, //最大连入的线数量, 默认为-1，表示不受限制
maxOut: 1,//最大连出的线数量, 默认为-1，表示不受限制
isSource: true,//可作为连接的来源，默认为true
isTarget: true,//可作为连接的目标，默认为true
sourceAnchor: 作为来源时连线的锚点，详细参见jsplumb的说明，默认Continuous
targetAnchor: 作为目标时连线的锚点，详细参见jsplumb的说明，默认Continuous
allowLoopback: false, //是否可以自己连自己，默认为false
JPList:[]//里面也是节点的配置
fields:字段信息。。。。。
*/
var treeData = [
  {
    name: "IVR流程",
    isParentNode: true,
    icon: "littledot.png",
    id: 1,
    children: [
      {
        id: 2,
        icon: "littledot.png",
        cmd: 1,
        name: "播放录音",
        maxIn: 1, //最大连入的线数量, 默认为-1，表示不受限制
        maxOut: 1,//最大连出的线数量, 默认为-1，表示不受限制
        isSource: true,//可作为连接的来源，默认为true
        isTarget: true,//可作为连接的目标，默认为true
        targetAnchor: ["Top", "Left"],
        allowLoopback: false, //是否可以自己连自己，默认为false
      },
      {
        id: 3,
        icon: "littledot.png",
        cmd: 2,
        name: "重听",
        maxIn: 1, //最大连入的线数量, 默认为-1，表示不受限制
        maxOut: 1,//最大连出的线数量, 默认为-1，表示不受限制
      },
      {
        id: 4,
        icon: "littledot.png",
        cmd: 3,
        name: "返回上一层",
        maxIn: 1, //最大连入的线数量, 默认为-1，表示不受限制
        maxOut: 1,//最大连出的线数量, 默认为-1，表示不受限制
      },
      {
        id: 5,
        icon: "littledot.png",
        cmd: 4,
        name: "转人工",
        maxIn: -1, //最大连入的线数量, 默认为-1，表示不受限制
        maxOut: 1,//最大连出的线数量, 默认为-1，表示不受限制
      },
      {
        id: 6,
        icon: "littledot.png",
        cmd: 999,
        name: "按键",
        maxIn: 1,
        maxOut: 0,
        isSource: false,
        isTarget: true,
        JPList: [
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


//新建节点
main.doNewNode = function (x, y, nodeData, assignNodeID) {
  if (nodeData.JPList != null) {
    flowChartKit.newListNode(x, y, nodeData, assignNodeID);
  } else {
    flowChartKit.newNode(x, y, nodeData, assignNodeID);
  }
}

//特殊处理的节点
main.specNewNode = function (x, y, nodeData) {
  flowChartKit.jsPlumbIns.batch(function () {
    var node1 = flowChartKit.newNode(x, y, nodeData);
    var x2 = x + 120
    var y2 = y - 120
    var node2 = flowChartKit.newListNode(x2, y2,
      myTree.getTreeDataById(6));
    flowChartKit.connect(node1, node2);
  });
}

//流程图操作的回调处理逻辑
main.getCallbacks4Logic = function () {
  return callbacks = {
    [flowChartKit.CallbackTypes.onNewNode]: function (params) {
      var node = params.node;
      var nodeData = params.data;
      var nodeId = node.id;
      if (nodeData.JPList != null) {
        //说明是节点组
        $("#panel-fields").append("新建了节点组：" + nodeData.name + "<br>")
      } else {
        $("#panel-fields").append("新建了节点：" + nodeData.name + "<br>")
      }
    },

    [flowChartKit.CallbackTypes.onClickNode]: function (params) {
      var node = params.node;
      var nodeData = params.data;
      var nodeId = node.id;
      if (nodeData.JPList != null) {
        //说明是节点组
      }
      $("#panel-fields").append("点击了节点：" + nodeData.name + "<br>")
    },
    [flowChartKit.CallbackTypes.onDeleteNode]: function (params) {
      var deletedId = params.nodeID;
      $("#panel-fields").append("删除了节点：" + deletedId + "<br>")
    },
    [flowChartKit.CallbackTypes.onClickConnection]: function (connection) {
      $("#panel-fields").append("点击了连接：" + connection.id + "<br>")
    },
    [flowChartKit.CallbackTypes.connection]: function (connection) {
      $("#panel-fields").append("新的连接：" + connection.id + "<br>")
    },
    [flowChartKit.CallbackTypes.connectionDetached]: function (connection) {
      $("#panel-fields").append("连接断开：" + connection.id + "<br>")
    },
    [flowChartKit.CallbackTypes.connectionMoved]: function (connection) {
      $("#panel-fields").append("连接moved：" + connection.id + "<br>")
    },
  }
}

//================================================
//================================================
// flowchart处理
jsPlumb.ready(function () {
  console.log("jsPlumb is ready to use");

  //画布
  var canvas = $("#flow-canvas");
  //流程图的panel
  var contanerId = "flow-panel"
  var flowChartContaner = $('#' + contanerId)
  //============================================
  //Initialize JsPlumb
  /*
  cfg.gridSize; 网格的大小
  cfg.gridCellSize; 网格单元格的大小
  cfg.isDrawGrid;是否画网格线
  cfg.canvasId; 画布的id
  cfg.containerId; 流程图的容器id
  cfg.connector; 连接线的方式，默认是StateMachine
  */
  var instance = flowChartKit.init({
    gridSize: 400,
    gridCellSize: 50,
    isDrawGrid: true,
    canvasId: "flow-canvas",
    containerId: "flow-panel",
    connector: flowChartKit.Connector.StateMachine,
  },
    [myDataProc, main.getCallbacks4Logic()]);
  //============================================

  //============================================
  //Initialize Control Tree View
  var treeEventDelegate = {
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
        if (myUtl.isPointOverElement(event.pageX, event.pageY, canvas)) {
          var mx = (event.pageX - flowChartContaner.offset().left) / flowChartKit.getZoom();
          var my = (event.pageY - flowChartContaner.offset().top) / flowChartKit.getZoom();
          if (node.cmd == 1) {
            main.specNewNode(mx, my, node);
          } else {
            main.doNewNode(mx, my, node);
          }
        }
      }
  }
  myTree.init("control-panel", main.getTreeData(), [treeEventDelegate, flowChartKit.treeNodeEventDelegate]);

  jsPlumb.fire("jsFlowLoaded", instance);


  //test==========================================
  $("#radio1").on("click", function () {
    flowChartKit.importDefaults({ Connector: flowChartKit.Connector.Flowchart });
  });
  var json;
  $("#export").on("click", function () {
    json = myDataProc.exportJson();
    console.log(json);
  });
  $("#import").on("click", function () {
    myDataProc.importJson(json);
  });

});
