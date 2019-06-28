
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
  var contanerId = "flow-panel"
  var flowChartContaner = $('#' + contanerId)
  //Initialize JsPlumb
  var instance = flowChartKit.init(contanerId, flowChartKit.Connector.StateMachine);
  var grid = Grid.new();
  grid.init(contanerId, 1000, 1000, 20);
  grid.DebugDraw("#DCDCDC")

  var canvas = $("#flow-canvas");

  canvas.on('mousedown', function (event) {
    var old = new Vector(event.originalEvent.offsetX, event.originalEvent.offsetY);
    canvas.on('mousemove', function (ev) {
      var now = new Vector(ev.originalEvent.offsetX, ev.originalEvent.offsetY);
      var diff = Vector.sub(now, old);

      var pos = new Vector(flowChartContaner.offset().left, flowChartContaner.offset().top);
      pos = Vector.add(pos, diff);
      flowChartContaner.offset({left:pos.x, top:pos.y});
      old = now;
    });
  });
  canvas.on('mouseup', function (event) {
    canvas.off('mousemove');
  });

  canvas.bind('mousewheel', function (event) {
    // console.log(event.deltaX, event.deltaY, event.deltaFactor);
    var delta = event.deltaY
    var dir = delta > 0 ? 'Up' : 'Down';
    // if (dir == 'Up') {
    //   console.log("向上滚动");
    // } else {
    //   console.log("向下滚动");
    // }
    var zoom = flowChartKit.getZoom();
    zoom += delta * event.deltaFactor * 0.001
    zoom = zoom > 3 ? 3 : zoom;
    zoom = zoom < 0.1 ? 0.1 : zoom;
    flowChartKit.setZoom(zoom)
    return false;
  });

  //Initialize Control Tree View
  $('#control-panel').treeview({ data: getTreeData() });

  //Handle drag and drop
  $('.list-group-item').attr('draggable', 'true').on('dragstart', function (ev) {
    //ev.dataTransfer.setData("text", ev.target.id);
    ev.originalEvent.dataTransfer.setData('text', ev.target.textContent);
    // console.log('drag start');
  });

  $('#flow-panel').on('drop', function (ev) {
    //avoid event conlict for jsPlumb
    if (ev.target.className.indexOf('_jsPlumb') >= 0) {
      return;
    }

    ev.preventDefault();
    var mx = '' + ev.originalEvent.offsetX;
    var my = '' + ev.originalEvent.offsetY;

    // console.log('on drop : ' + ev.originalEvent.dataTransfer.getData('text'));
    // var uid = new Date().getTime();
    // var node = addNode('flow-panel', 'node' + uid, 'node', { x: mx, y: my });
    // addPorts(instance, node, ['out'], 'output');
    // addPorts(instance, node, ['in1', 'in2'], 'input');
    // instance.draggable($(node));
    flowChartKit.newNode(null, mx, my, "new node")
  }).on('dragover', function (ev) {
    ev.preventDefault();
    // console.log('on drag over');
  });

  jsPlumb.fire("jsFlowLoaded", instance);

});