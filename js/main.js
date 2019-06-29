
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

function offItemsDragDrop() {
  //Handle drag and drop
  $('.list-group-item').off('dragstart');
}
//重新设置一次列表的拖动
function onItemsDragDrop(flowChartContaner) {
  //Handle drag and drop
  $('.list-group-item').attr('draggable', 'true').on('dragstart', function (ev) {
    //ev.dataTransfer.setData("text", ev.target.id);
    ev.originalEvent.dataTransfer.setData('text', ev.target.textContent);
    // console.log("dragstart")
    flowChartContaner.on('drop', function (ev) {
      flowChartContaner.off('drop');
      //avoid event conlict for jsPlumb
      if (ev.target.className.indexOf('_jsPlumb') >= 0) {
        return;
      }

      ev.preventDefault();
      var mx = ev.originalEvent.offsetX;
      var my = ev.originalEvent.offsetY;

      flowChartKit.newNode(null, mx, my, "New Node")
    }).on('dragover', function (ev) {
      ev.preventDefault();
      // console.log('on drag over');
    });
  }).on("dragend", function (ev) {
    // console.log("dragend")
    flowChartContaner.off('drop');
  });
}

/*
* 取得流程图的每次缩放的中心点
*/
function getFlowZoomCenter(canvas, flowPanel, zoomVal) {
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
  // grid.DebugDraw("#DCDCDC");//TODO:画线还有问题，要影响拖动创建节点的坐标位置，导致位置不正确
  //============================================
  //设置画板的高度位置及缩放
  flowChartContaner.width(grid.Width);
  flowChartContaner.height(grid.Height);
  var offsetLeft = -flowChartContaner.width() / 2 + canvas.width() / 2 + canvas.offset().left;
  var offsetTop = canvas.offset().top;
  flowChartContaner.offset({ left: offsetLeft, top: offsetTop });
  var zoomCenter = getFlowZoomCenter(canvas, flowChartContaner, 1);
  //============================================
  //Initialize JsPlumb
  var callbacks = {
    [flowChartKit.CallbackTypes.onNewNode]: function (node) {
    },
    [flowChartKit.CallbackTypes.onClickNode]: function (node) {
    },
    [flowChartKit.CallbackTypes.onDeleteNode]: function () {
    },
    [flowChartKit.CallbackTypes.onClickConnection]: function (connection) {
    },
    [flowChartKit.CallbackTypes.connection]: function (connection) {
    },
    [flowChartKit.CallbackTypes.connectionDetached]: function (connection) {
    },
    [flowChartKit.CallbackTypes.connectionMoved]: function (connection) {
    },
  }
  var instance = flowChartKit.init(grid, contanerId, flowChartKit.Connector.StateMachine, callbacks);
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
    zoomCenter = getFlowZoomCenter(canvas, flowChartContaner, flowChartKit.getZoom());
    flowChartKit.setZoomCenter(zoomCenter, old);
  });
  canvas.mouseleave(function (ev) {
    //要先关mousemove
    canvas.off('mousemove');
    //重置流程图panel的中心点
    var old = zoomCenter
    zoomCenter = getFlowZoomCenter(canvas, flowChartContaner, flowChartKit.getZoom());
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
  $('#control-panel').treeview({ data: getTreeData() });
  onItemsDragDrop(flowChartContaner);//TODO:treeveiw 还有问题，当点击了后，dragable就无效了

  jsPlumb.fire("jsFlowLoaded", instance);

});