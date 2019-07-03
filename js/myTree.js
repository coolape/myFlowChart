
var myTree = {}

//回调函数类型
myTree.CallbackTypes = {
    onClick: "onClick",
    onDragStart: "onDragStart",
    onDrag: "onDrag",
    onDragStop: "onDragStop",
}

myTree.isDragingTreeNode = false;
myTree.dragOutAlpha = 0.1;
myTree.eventDelegateList = null;//[{onClickNode:, onDragStart:, onDrag:, onDragStop:}]
myTree.init = function (contaner, data, eventDelegateList) {
    myTree.eventDelegateList = eventDelegateList;
    $(function () {
        $('#' + contaner).tree({
            data: data,
            openedIcon: '-',
            closedIcon: '+',
            autoOpen: true,
            dragAndDrop: true,
            onCreateLi: function (node, $li, is_selected) {
                // Add 'icon' span before title
                if (node.icon != null && node.icon != "") {
                    // $li.find('.jqtree-title').before('<span class="icon"></span>');
                    var iconHtml = '<img style="background-repeat:no-repeat;' +
                        'vertical-align: middle;' +
                        'display:inline-block;width: 30px;height: 30px;"' +
                        'src="treeIcon/' + node.icon + '"/>' + node.name;
                    $li.find('.jqtree-title').html(iconHtml);
                }
            },
            onCanMove: function (node) {
                return !node.isParentNode;
            },
            onCanMoveTo: function (moved_node, target_node, position) {
                //返回false后，就不能拖动改变tree的位置了
                return false;
            },
            onDragMove: function (node, event) {
                if (!myTree.isDragingTreeNode) {
                    //drag start
                    var dragObj = $(".jqtree-dragging");
                    dragObj.css("opacity", myTree.dragOutAlpha);
                    myTree.doCallback(myTree.CallbackTypes.onDragStart, node, event)
                } else {
                    //drag
                    myTree.doCallback(myTree.CallbackTypes.onDrag, node, event)
                }
                myTree.isDragingTreeNode = true;
            },
            onDragStop: function (node, event) {
                myTree.isDragingTreeNode = false;
                myTree.doCallback(myTree.CallbackTypes.onDragStop, node, event)
            },
        }).on(
            'tree.click',
            function (event) {
                // The clicked node is 'event.node'
                var node = event.node;
                myTree.doCallback(myTree.CallbackTypes.onClick, node, event)
            });

        $('#' + contaner).on("mouseenter", function () {
            if (myTree.isDragingTreeNode) {
                var dragObj = $(".jqtree-dragging");
                dragObj.css("opacity", 1);
            }
        }).on("mouseleave", function () {
            if (myTree.isDragingTreeNode) {
                var dragObj = $(".jqtree-dragging");
                dragObj.css("opacity", myTree.dragOutAlpha);
            }
        });
    });
}

myTree.doCallback = function (callbackType, node, event) {
    for (x in myTree.eventDelegateList) {
        var callbackObj = myTree.eventDelegateList[x];
        var callback = callbackObj[callbackType];
        if (callback != null) {
            callback(node, event);
        }
    }
}
