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
        maxIn: -1, //最大连入的线数量, 默认为-1，表示不受限制
        maxOut: 1,//最大连出的线数量, 默认为-1，表示不受限制
        isSource: true,//可作为连接的来源，默认为true
        isTarget: true,//可作为连接的目标，默认为true
        sourceAnchor: ["Right", "Bottom"],
        targetAnchor: ["Left", "Top"],
        allowLoopback: false, //是否可以自己连自己，默认为false
      },
      {
        id: 3,
        icon: "littledot.png",
        cmd: 2,
        name: "重听",
        sourceAnchor: ["Right", "Bottom"],
        targetAnchor: ["Left", "Top"],
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
        sourceAnchor: ["Right", "Bottom"],
        targetAnchor: ["Left", "Top"],
      },
      {
        id: 5,
        icon: "littledot.png",
        cmd: 4,
        name: "转人工",
        maxIn: -1, //最大连入的线数量, 默认为-1，表示不受限制
        maxOut: 1,//最大连出的线数量, 默认为-1，表示不受限制
        sourceAnchor: ["Right", "Bottom"],
        targetAnchor: ["Left", "Top"],
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
      {
        id: 7,
        icon: "littledot.png",
        cmd: 6,
        name: "开始",
        maxIn: 0, //最大连入的线数量, 默认为-1，表示不受限制
        maxOut: 1,//最大连出的线数量, 默认为-1，表示不受限制
        isSource: true,//可作为连接的来源，默认为true
        isTarget: false,//可作为连接的目标，默认为true
        allowLoopback: false, //是否可以自己连自己，默认为false
        sourceAnchor: ["Right", "Bottom"],
        targetAnchor: ["Left", "Top"],
      },
    ]
  }
  , {
    name: "常用流程",
    isParentNode: true,
    icon: "littledot.png",
    id: 10100,
    children: [
      {
        id: 10102,
        icon: "littledot.png",
        cmd: 1000,
        flowChart: '{"jp_name":"new flowchart","jp_gridSize":400,"jp_gridCellSize":50,"jp_nodes":[{"jp_nid":"4699e054-6803-48df-a9eb-426da199825b","jp_cfgId":7,"jp_pos":78994,"jp_isRoot":true,"jp_connections":[{"jp_target":"1c4c9f11-7af3-458d-a491-af709d08e7c1"}]},{"jp_nid":"1c4c9f11-7af3-458d-a491-af709d08e7c1","jp_cfgId":2,"jp_pos":78996,"jp_connections":[{"jp_target":"ea26d55e-e88d-40f0-a599-ba617f240bbf"}]},{"jp_nid":"ea26d55e-e88d-40f0-a599-ba617f240bbf","jp_cfgId":6,"jp_children":[{"jp_nid":"71eb57d2-d0b7-48c1-b20e-efb8f5027da5","jp_dataIndex":0,"jp_connections":[{"jp_target":"a0a64d0a-8092-4b44-aa27-7312a815ec22"}]},{"jp_nid":"7718ae9f-5cbc-41a9-bd03-55570b6e2bd3","jp_dataIndex":1,"jp_connections":[{"jp_target":"484dfaca-6297-437e-a656-2d9a504860a1"}]},{"jp_nid":"f3192dee-b55e-47b8-8027-18538dbf8faf","jp_dataIndex":2,"jp_connections":[]},{"jp_nid":"f1e28bf2-ee52-4750-82fa-d6853de1d388","jp_dataIndex":3,"jp_connections":[]},{"jp_nid":"3466e5cb-d402-40bd-92cd-d7c34aabbb9a","jp_dataIndex":4,"jp_connections":[]},{"jp_nid":"4915e615-b80b-4727-ab41-d7e98d907cd1","jp_dataIndex":5,"jp_connections":[]},{"jp_nid":"f22263b1-29fe-46b3-a4ad-05bd5988e99b","jp_dataIndex":6,"jp_connections":[]},{"jp_nid":"322f04f5-6553-4a39-b996-cb9dc6889967","jp_dataIndex":7,"jp_connections":[]},{"jp_nid":"f6c2bf15-327d-4b4f-bb9e-47bea3275252","jp_dataIndex":8,"jp_connections":[{"jp_target":"ba44e8d8-5189-479a-9b54-a28019155ee1"}]},{"jp_nid":"a15f152d-a4b8-4022-844c-2311e0769cc7","jp_dataIndex":9,"jp_connections":[{"jp_target":"8a5d0b48-aeb5-43be-a3a2-c8e4b3b2fdd6"}]},{"jp_nid":"880c5ef1-60a5-4bfe-8372-31ce4e35ff29","jp_dataIndex":10,"jp_connections":[]},{"jp_nid":"e7b551a7-32f6-425e-9859-324b98c1801f","jp_dataIndex":11,"jp_connections":[]}],"jp_pos":78199,"jp_connections":[]},{"jp_nid":"484dfaca-6297-437e-a656-2d9a504860a1","jp_cfgId":3,"jp_pos":79002,"jp_connections":[{"jp_target":"1c4c9f11-7af3-458d-a491-af709d08e7c1"}]},{"jp_nid":"a0a64d0a-8092-4b44-aa27-7312a815ec22","jp_cfgId":2,"jp_pos":78202,"jp_connections":[{"jp_target":"f87619d7-a4f6-45d6-8809-68272499b3cf"}]},{"jp_nid":"f87619d7-a4f6-45d6-8809-68272499b3cf","jp_cfgId":6,"jp_children":[{"jp_nid":"85c1ae2a-9d3f-43b6-8c9c-1a561d327ff4","jp_dataIndex":0,"jp_connections":[{"jp_target":"8a5d0b48-aeb5-43be-a3a2-c8e4b3b2fdd6"}]},{"jp_nid":"892258fa-d371-4d8a-aa1c-444b1284e4c1","jp_dataIndex":1,"jp_connections":[{"jp_target":"222c2991-4030-40ab-9a6d-086cce9ef5f4"}]},{"jp_nid":"ba1e2a7b-ab84-4e5e-a83c-0e9e243ffc94","jp_dataIndex":2,"jp_connections":[{"jp_target":"4c91040c-7ea1-4710-865a-9e1d719181f9"}]},{"jp_nid":"8a60ea46-802b-402a-80b9-43d7916dde9e","jp_dataIndex":3,"jp_connections":[]},{"jp_nid":"258c18ad-9659-4e9f-988d-c618e8bdd9c4","jp_dataIndex":4,"jp_connections":[]},{"jp_nid":"b17383b0-5c66-4ae7-9d01-7b402bd4445b","jp_dataIndex":5,"jp_connections":[]},{"jp_nid":"6a3b0b72-325f-4585-88ef-41ece6df1bbe","jp_dataIndex":6,"jp_connections":[]},{"jp_nid":"6259c925-6e7a-4c83-adad-54809e3c2e60","jp_dataIndex":7,"jp_connections":[]},{"jp_nid":"80960488-2ea2-44e9-925e-12eeb12373e5","jp_dataIndex":8,"jp_connections":[]},{"jp_nid":"a185b586-1a65-4eae-ad0d-cd5ccc97bc85","jp_dataIndex":9,"jp_connections":[{"jp_target":"8a5d0b48-aeb5-43be-a3a2-c8e4b3b2fdd6"}]},{"jp_nid":"1c2a4d30-04e7-451f-9683-8adf762f4047","jp_dataIndex":10,"jp_connections":[]},{"jp_nid":"6517923a-dbaa-470b-bad6-3f406bf17d2a","jp_dataIndex":11,"jp_connections":[]}],"jp_pos":78205,"jp_connections":[]},{"jp_nid":"ba44e8d8-5189-479a-9b54-a28019155ee1","jp_cfgId":4,"jp_pos":79802,"jp_connections":[]},{"jp_nid":"8a5d0b48-aeb5-43be-a3a2-c8e4b3b2fdd6","jp_cfgId":5,"jp_pos":80602,"jp_connections":[]},{"jp_nid":"222c2991-4030-40ab-9a6d-086cce9ef5f4","jp_cfgId":3,"jp_pos":78609,"jp_connections":[{"jp_target":"a0a64d0a-8092-4b44-aa27-7312a815ec22"}]},{"jp_nid":"4c91040c-7ea1-4710-865a-9e1d719181f9","jp_cfgId":4,"jp_pos":80209,"jp_connections":[{"jp_target":"a0a64d0a-8092-4b44-aa27-7312a815ec22"}]}]}',
        name: "电话推销",
      }
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
    flowChartKit.newListNode(x, y, { cfg: nodeData }, assignNodeID);
  } else {
    flowChartKit.newNode(x, y, { cfg: nodeData }, assignNodeID);
  }
}

//特殊处理的节点
main.specNewNode = function (x, y, nodeData) {
  flowChartKit.jsPlumbIns.batch(function () {
    var node1 = flowChartKit.newNode(x, y, { cfg: nodeData });
    var x2 = x + 150
    var y2 = y - 150
    var node2 = flowChartKit.newListNode(x2, y2,
      { cfg: myTree.getTreeDataById(6) });
    flowChartKit.connect(node1.id, node2.id);
  });
}
main.addFlowchart = function (x, y, nodeCfg) {
  myDataProc.importJson(nodeCfg.flowChart, new Vector(x, y), true);
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
        $("#panel-fields").append("新建了节点组：" + nodeData.cfg.name + "<br>")
      } else {
        $("#panel-fields").append("新建了节点：" + nodeData.cfg.name + "<br>")
      }
    },

    [flowChartKit.CallbackTypes.onClickNode]: function (params) {
      var node = params.node;
      var nodeData = params.data;
      var nodeId = node.id;
      if (nodeData.JPList != null) {
        //说明是节点组
      }
      $("#panel-fields").append("点击了节点：" + nodeData.cfg.name + "<br>")
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
    [flowChartKit.CallbackTypes.onZooming]: function (persent) {
      $("#panel-fields").append(flowChartKit.CallbackTypes.onZooming + ":" + persent + "<br>")
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
  cfg.zoomRange:[0.1, 5] 缩放范围
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
          } else if (node.cmd == 1000) {
            main.addFlowchart(mx, my, node);
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
  $("#clean").on("click", function () {
    flowChartKit.clean();
    myDataProc.clean();
  });
  var json = '';
  $("#export").on("click", function () {
    json = myDataProc.exportJson();
    alert(json);
    console.log(json);
  });
  $("#import").on("click", function () {
    myDataProc.importJson(json);
  });

});
