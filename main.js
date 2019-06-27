
//树的数据
function getTreeData() {
  var tree = [
    {
      text: "Nodes",
      nodes: [
        {
          text: "Node1",
        },
        {
          text: "Node2"
        }
      ]
    }
  ];

  return tree;
}

// flowchart处理
jsPlumb.ready(function () {
  console.log("jsPlumb is ready to use");

  //Initialize JsPlumb
  var instance = flowChartKit.init("flow-panel", flowChartKit.Connector.StateMachine);

  //Initialize Control Tree View
  $('#control-panel').treeview({ data: getTreeData() });

  //Handle drag and drop
  $('.list-group-item').attr('draggable', 'true').on('dragstart', function (ev) {
    //ev.dataTransfer.setData("text", ev.target.id);
    ev.originalEvent.dataTransfer.setData('text', ev.target.textContent);
    console.log('drag start');
  });

  $('#flow-panel').on('drop', function (ev) {
    //avoid event conlict for jsPlumb
    if (ev.target.className.indexOf('_jsPlumb') >= 0) {
      return;
    }

    ev.preventDefault();
    var mx = '' + ev.originalEvent.offsetX;
    var my = '' + ev.originalEvent.offsetY;

    console.log('on drop : ' + ev.originalEvent.dataTransfer.getData('text'));
    // var uid = new Date().getTime();
    // var node = addNode('flow-panel', 'node' + uid, 'node', { x: mx, y: my });
    // addPorts(instance, node, ['out'], 'output');
    // addPorts(instance, node, ['in1', 'in2'], 'input');
    // instance.draggable($(node));
    flowChartKit.newNode(null, mx, my, "new node")
  }).on('dragover', function (ev) {
    ev.preventDefault();
    console.log('on drag over');
  });

  jsPlumb.fire("jsFlowLoaded", instance);

});