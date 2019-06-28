
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

  //画布
  var canvas = $("#flow-canvas");
  //流程图的panel
  var contanerId = "flow-panel"
  var flowChartContaner = $('#' + contanerId)
  //============================================
  //设置网格
  var grid = Grid.new(contanerId, 1000, 1000, 20);
  grid.DebugDraw("#DCDCDC");
  flowChartContaner.width(grid.Width);
  flowChartContaner.height(grid.Height);
  console.log(-flowChartContaner.width()/2 + canvas.width()/2)
  flowChartContaner.offset({ left: -flowChartContaner.width()/2 + canvas.width()/2 + canvas.offset().left });
  //============================================
  //Initialize JsPlumb
  var instance = flowChartKit.init(contanerId, flowChartKit.Connector.StateMachine);
  flowChartKit.setZoom(1, [50, 0]);
  //============================================
  //处理画布拖动
  canvas.on('mousedown', function (event) {
    var old = new Vector(event.pageX, event.pageY);
    canvas.on('mousemove', function (ev) {
      var now = new Vector(ev.pageX, ev.pageY);
      var diff = Vector.sub(now, old);
      // console.log(diff)
      var pos = new Vector(flowChartContaner.offset().left, flowChartContaner.offset().top);
      pos = Vector.add(pos, diff);
      flowChartContaner.offset({ left: pos.x, top: pos.y });
      old = now;
    });
  });
  canvas.on('mouseup', function (event) {
    canvas.off('mousemove');
  });
  canvas.mouseleave(function(ev)
  {
    canvas.off('mousemove');
  });
  //============================================
  //处理画布缩放
  canvas.bind('mousewheel', function (event) {
    // console.log(event.deltaX, event.deltaY, event.deltaFactor);
    var delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    delta = delta * event.deltaFactor * 0.001
    var dir = delta > 0 ? 'Up' : 'Down';
    var zoom = flowChartKit.getZoom();
    zoom += delta
    zoom = zoom > 3 ? 3 : zoom;
    zoom = zoom < 0.1 ? 0.1 : zoom;

    // var pos = new Vector(flowChartContaner.offset().left, flowChartContaner.offset().top);
    // var per = canvas.width() / canvas.height();
    // var diff = Vector.mul(new Vector(1, 1 / per), delta)
    // pos = Vector.add(pos, diff);
    // flowChartContaner.offset({left:pos.x, top:pos.y});

    flowChartKit.setZoom(zoom, [0.5, 0])
    return false;
  });
  //============================================
  //Initialize Control Tree View
  $('#control-panel').treeview({ data: getTreeData() });

  //Handle drag and drop
  $('.list-group-item').attr('draggable', 'true').on('dragstart', function (ev) {
    //ev.dataTransfer.setData("text", ev.target.id);
    ev.originalEvent.dataTransfer.setData('text', ev.target.textContent);
    // console.log('drag start');
  });

  canvas.on('drop', function (ev) {
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