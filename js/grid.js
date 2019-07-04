var Grid = {}
Grid.current = null;
/**
 * 创建grid实例
 * @method new
 * @for grid
 * @param {String} contanerID 容器id
 * @param {Vector} origin 容器id
 * @param {Number} numRows 网格行
 * @param {Number} numCols 网格列
 * @param {Number} cellSize 网格大小
 * @return {null} null
 */
Grid.new = function (contanerID, origin, numRows, numCols, cellSize) {
    var grid = {}

    var kXAxis = new Vector(1, 0);       // points in the directon of the positive X axis
    var kZAxis = new Vector(0, 1);       // points in the direction of the positive Y axis
    var kDepth = 1;           // used for intersection tests done in 3D.

    var m_numberOfRows = 10;
    var m_numberOfColumns = 10;
    var m_cellSize = 1;
    var originCellSize = 1;
    var m_origin = new Vector(0, 0);

    grid.Contaner = $("#" + contanerID)
    grid.Rows = null;
    grid.Cols = null;
    grid.CellSize = null;
    grid.Width = null;
    grid.Height = null;
    grid.Origin = null;
    grid.NumberOfCells = null;
    grid.Left = null;
    grid.Right = null;
    grid.Top = null;
    grid.Bottom = null;
    grid.lines = new Array();

    /**
     * 画直线
     * @method DrawLine
     * @for grid
     * @param {Vector} from 开始位置
     * @param {Vector} to 结束位置
     * @param {Color} color 颜色
     * @return {jquery obj} 
     */
    var DrawLine = function (from, to, color) {
        var width = 1;
        var height = 1;
        var diff = Vector.sub(to, from);
        if (diff.x > diff.y) {
            width = diff.x
            height = 1
        } else {
            width = 1
            height = diff.y
        }
        var top = from.y;
        var left = from.x;
        var content = '<div style="z-index:0;width:' + width + 'px;height:' + height + 'px; background:' + color + ';position:absolute;top:' + top + 'px;left:' + left + 'px;"></div>';
        var le = grid.Contaner.append(content);
        return le;
    }

    /**
     * Use this for initialization
     * @method init
     * @for grid
     * @param {String} contanerID 容器id
     * @param {Number} numRows 网格行
     * @param {Number} numCols 网格列
     * @param {Number} cellSize 网格大小
     * @return {null} null
     */
    grid.init = function (origin, numRows, numCols, cellSize) {
        
        // var origin = new Vector(contaner.offset().left, contaner.offset().top);
        // m_origin = new Vector(0,0);// origin;
        m_origin = origin;
        originCellSize = cellSize;
        m_numberOfRows = numRows;
        m_numberOfColumns = numCols;
        m_cellSize = cellSize;

        grid.Rows = numRows;
        grid.Cols = numCols;
        grid.CellSize = m_cellSize;
        grid.Width = (m_numberOfColumns * m_cellSize);
        grid.Height = (m_numberOfRows * m_cellSize);
        grid.Origin = m_origin;
        grid.NumberOfCells = m_numberOfRows * m_numberOfColumns;
        grid.Left = grid.Origin.x;
        grid.Right = grid.Origin.x + grid.Width;
        grid.Top = grid.Origin.y + grid.Height;
        grid.Bottom = grid.Origin.y;
    }

    grid.zoom = function (zoomVal) {
        grid.CellSize = originCellSize * zoomVal;
        m_cellSize = originCellSize * zoomVal;
    }
    /**
     * 画网格
     * @method DrawLine
     * @for grid
     * @param {Color} color 颜色
     */
    grid.DebugDraw = function (color, numRows, numCols, cellSize) {
        numRows = numRows || grid.Rows;
        numCols = numCols || grid.Cols;
        cellSize = cellSize || grid.CellSize
        var width = numCols * cellSize;
        var height = numRows * cellSize;

        // Draw the horizontal grid lines
        for (i = 0; i < numRows + 1; i++) {
            var startPos = Vector.add(grid.Origin, Vector.mul(kZAxis, i * cellSize));
            var endPos = Vector.add(startPos, Vector.mul(kXAxis, width));
            grid.lines.push(DrawLine(startPos, endPos, color))
        }

        // Draw the vertial grid lines
        for (i = 0; i < numCols + 1; i++) {
            // var startPos = origin + i * cellSize * kXAxis;
            var startPos = Vector.add(grid.Origin, Vector.mul(kXAxis, i * cellSize));
            var endPos = Vector.add(startPos, Vector.mul(kZAxis, height));
            grid.lines.push(DrawLine(startPos, endPos, color))
        }
    }

    grid.clean = function()
    {
        for(i in grid.lines) {
            grid.lines[i].remove();
        }
        grid.lines = [];
    }

    /**
     * pos is in world space coordinates. The returned position is also in world space coordinates.
     * @method GetNearestCellCenter
     * @for grid
     * @param {Vector} pos 坐标
     * @return {Vector} 所以所在网格的中心坐标
     */
    grid.GetNearestCellCenter = function (pos) {
        var index = grid.GetCellIndexByPos(pos);
        return grid.GetCellCenterByIndex(index);
    }

    grid.GetNearestCellPosition = function (pos) {
        var index = grid.GetCellIndexByPos(pos);
        return grid.GetCellPositionByIndex(index);
    }
    /**
     * returns a position in world space coordinates.
     * @method GetCellCenterByIndex
     * @for grid
     * @param {Int} index 网格的index
     * @return {Vector} 所以所在网格的中心坐标
     */
    grid.GetCellCenterByIndex = function (index) {
        var cellPosition = grid.GetCellPositionByIndex(index);
        var offset = m_cellSize / 2
        cellPosition = Vector.add(cellPosition, new Vector(offset, offset))
        return cellPosition;
    }

    /**
     * returns a position in world space coordinates.
     * @method GetCellCenterByIndex
     * @for grid
     * @param {Int} x 网格的x
     * @param {Int} y 网格的y
     * @return {Vector} 所以所在网格的中心坐标
     */
    grid.GetCellCenter = function (x, y) {
        return grid.GetCellCenterByIndex(grid.GetCellIndex(x, y));
    }

    /// <summary>
    /// Returns the lower left position of the grid cell at the passed tile index. The origin of the grid is at the lower left,
    /// so it uses a cartesian coordinate system.
    /// </summary>
    /// <param name="index">index to the grid cell to consider</param>
    /// <returns>Lower left position of the grid cell (origin position of the grid cell), in world space coordinates</returns>
    grid.GetCellPositionByIndex = function (index) {
        var row = grid.GetRow(index);
        var col = grid.GetColumn(index);
        var x = col * m_cellSize;
        var y = row * m_cellSize;
        var cellPosition = Vector.add(grid.Origin, new Vector(x, y));
        return cellPosition;
    }

    /**
     * pass in world space coords. Get the tile index at the passed position
     * @method GetCellIndexByPos
     * @for grid
     * @param {Vector} pos 坐标
     * @return {Int} 所以所在网格的index
     */
    grid.GetCellIndexByPos = function (pos) {
        if (!grid.IsPosInBounds(pos)) {
            return -1;
        }

        pos = Vector.sub(pos, grid.Origin);
        var col = parseInt(pos.x / m_cellSize);
        var row = parseInt(pos.y / m_cellSize);
        return grid.GetCellIndex(col, row);
    }

    grid.GetCellIndex = function (col, row) {
        return (row * m_numberOfColumns + col);
    }

    grid.GetRow = function (index) {
        var row = parseInt(index / m_numberOfColumns); //m_numberOfRows;
        return row;
    }

    grid.GetColumn = function (index) {
        var col = index % m_numberOfColumns;
        return col;
    }
    grid.GetX = function (index) {
        return grid.GetColumn(index);
    }

    grid.GetY = function (index) {
        return grid.GetRow(index);
    }

    /**
     * 给定的xy是否在网格内
     * @method IsInBounds
     * @for grid
     * @param {Int} col 
     * @param {Int} row
     * @return {Bool} true代表在网格中
     */
    grid.IsInBounds = function (col, row) {
        if (col < 0 || col >= m_numberOfColumns) {
            return false;
        }
        else if (row < 0 || row >= m_numberOfRows) {
            return false;
        }
        else {
            return true;
        }
    }

    grid.IsIndexInBounds = function (index) {
        return (index >= 0 && index < grid.NumberOfCells);
    }

    // pass in world space coords
    grid.IsPosInBounds = function (pos) {
        return (pos.x >= grid.Left &&
            pos.x <= grid.Right &&
            pos.y <= grid.Top &&
            pos.y >= grid.Bottom);
    }

    /**
     * 取得给定index的左边的index
     * @method LeftIndex
     * @for grid
     * @param {Int} index
     * @return {Int} 为-1时表示左没有格子了
     */
    grid.LeftIndex = function (index) {
        var col = grid.GetColumn(index);
        var row = grid.GetRow(index);
        col = col - 1;
        if (grid.IsInBounds(col, row)) {
            return grid.GetCellIndex(col, row);
        }
        else {
            return -1;
        }
    }

    grid.RightIndex = function (index) {
        var col = grid.GetColumn(index);
        var row = grid.GetRow(index);
        col = col + 1;
        if (grid.IsInBounds(col, row)) {
            return grid.GetCellIndex(col, row);
        }
        else {
            return -1;
        }
    }
    grid.UpIndex = function (index) {
        var col = grid.GetColumn(index);
        var row = grid.GetRow(index);
        row = row + 1;
        if (grid.IsInBounds(col, row)) {
            return grid.GetCellIndex(col, row);
        }
        else {
            return -1;
        }
    }

    grid.DownIndex = function (index) {
        var col = grid.GetColumn(index);
        var row = grid.GetRow(index);
        row = row - 1;
        if (grid.IsInBounds(col, row)) {
            return grid.GetCellIndex(col, row);
        }
        else {
            return -1;
        }
    }

    grid.LeftUpIndex = function (index) {
        var col = grid.GetColumn(index);
        var row = grid.GetRow(index);
        col = col - 1;
        row = row + 1;
        if (grid.IsInBounds(col, row)) {
            return grid.GetCellIndex(col, row);
        }
        else {
            return -1;
        }
    }

    grid.RightUpIndex = function (index) {
        var col = grid.GetColumn(index);
        var row = grid.GetRow(index);
        col = col + 1;
        row = row + 1;
        if (grid.IsInBounds(col, row)) {
            return grid.GetCellIndex(col, row);
        }
        else {
            return -1;
        }
    }

    grid.LeftDownIndex = function (index) {
        var col = grid.GetColumn(index);
        var row = grid.GetRow(index);
        col = col - 1;
        row = row - 1;
        if (grid.IsInBounds(col, row)) {
            return grid.GetCellIndex(col, row);
        }
        else {
            return -1;
        }
    }

    grid.RightDownIndex = function (index) {
        var col = grid.GetColumn(index);
        var row = grid.GetRow(index);
        col = col + 1;
        row = row - 1;
        if (grid.IsInBounds(col, row)) {
            return grid.GetCellIndex(col, row);
        }
        else {
            return -1;
        }
    }

    /**
     * Gets the own grids.根据中心点及占用格子size,取得占用格子index数,注意只有在长宽一样的情况时
     * @method getCells
     * @for grid
     * @param {Int} center 网络的index
     * @param {Int} size Size * Size的范围
     * @return {Array} 包含所有index的列表
     */
    grid.getCells = function (center, size) {
        var ret = new Array();
        if (center < 0) {
            return ret;
        }

        var half = parseInt(size / 2);
        var numRows = m_numberOfColumns;// m_numberOfRows;
        if (size % 2 == 0) {
            for (row = 0; row <= half; row++) {
                for (i = 1; i <= half; i++) {
                    var tpindex = center - row * numRows - i;
                    if (tpindex / numRows != (center - row * numRows) / numRows) {
                        tpindex = -1;
                    }
                    ret.push(tpindex);
                }
                for (i = 0; i < half; i++) {
                    var tpindex = center - row * numRows + i;
                    if (tpindex / numRows != (center - row * numRows) / numRows) {
                        tpindex = -1;
                    }
                    ret.push(tpindex);
                }
            }
            for (row = 1; row <= half - 1; row++) {
                for (i = 1; i <= half; i++) {
                    var tpindex = center + row * numRows - i;
                    if (tpindex / numRows != (center + row * numRows) / numRows) {
                        tpindex = -1;
                    }
                    ret.push(tpindex);
                }
                for (i = 0; i < half; i++) {
                    var tpindex = center + row * numRows + i;
                    if (tpindex / numRows != (center + row * numRows) / numRows) {
                        tpindex = -1;
                    }
                    ret.push(tpindex);
                }
            }

        }
        else {
            for (row = 0; row <= half; row++) {
                for (i = 0; i <= half; i++) {
                    var tpindex = center - row * numRows - i;
                    if (tpindex / numRows != (center - row * numRows) / numRows) {
                        tpindex = -1;
                    }
                    ret.push(tpindex);
                }

                for (i = 1; i <= half; i++) {
                    var tpindex = center - row * numRows + i;
                    if (tpindex / numRows != (center - row * numRows) / numRows) {
                        tpindex = -1;
                    }
                    ret.push(tpindex);
                }
            }

            for (row = 1; row <= half; row++) {
                for (i = 0; i <= half; i++) {
                    var tpindex = center + row * numRows - i;
                    if (tpindex / numRows != (center + row * numRows) / numRows) {
                        tpindex = -1;
                    }
                    ret.push(tpindex);
                }

                for (i = 1; i <= half; i++) {
                    var tpindex = center + row * numRows + i;
                    if (tpindex / numRows != (center + row * numRows) / numRows) {
                        tpindex = -1;
                    }
                    ret.push(tpindex);
                }
            }
        }
        return ret;
    }
    grid.init(origin, numRows, numCols, cellSize);
    Grid.current = grid;
    return grid;
}
