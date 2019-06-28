var Grid = {}
Grid.new = function () {
    var grid = {}

    var kXAxis = new Vector(1, 0);       // points in the directon of the positive X axis
    var kZAxis = new Vector(0, 1);       // points in the direction of the positive Y axis
    var kDepth = 1;           // used for intersection tests done in 3D.

    var m_numberOfRows = 10;
    var m_numberOfColumns = 10;
    var m_cellSize = 1;
    var m_origin = null;

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


    grid.DrawLine = function (from, to, color) {
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
        var left= from.x;
        var content = '<div style="width:' + width + 'px;height:' + height + 'px; background:' + color + ';position:absolute;top:' + top + 'px;left:' + left + 'px;"></div>';
        var le = grid.Contaner.append(content);
        return le;
    }

    /**
     * Use this for initialization
     * @method init
     * @for flowChartKit
     * @param {String} contanerID 容器id
     * @param {Number} numRows 网格行
     * @param {Number} numCols 网格列
     * @param {Number} cellSize 网格大小
     * @return {null} null
     */
    grid.init = function (contanerID, numRows, numCols, cellSize) {
        var contaner = $("#" + contanerID)
        var origin = new Vector(contaner.offset().left, contaner.offset().top);
        m_origin = new Vector(0,0);// origin;
        m_numberOfRows = numRows;
        m_numberOfColumns = numCols;
        m_cellSize = cellSize;

        grid.Contaner = contaner;
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

    grid.DebugDraw = function (color) {
        var width = grid.Width;
        var height = grid.Height;

        // Draw the horizontal grid lines
        for (i = 0; i < m_numberOfRows + 1; i++) {
            var startPos = Vector.add(grid.Origin, Vector.mul(kZAxis, i * grid.CellSize));
            var endPos = Vector.add(startPos, Vector.mul(kXAxis, width));
            grid.DrawLine(startPos, endPos, color);
        }

        // Draw the vertial grid lines
        for (i = 0; i < m_numberOfColumns + 1; i++) {
            // var startPos = origin + i * cellSize * kXAxis;
            var startPos = Vector.add(grid.Origin, Vector.mul(kXAxis, i * grid.CellSize));
            var endPos = Vector.add(startPos, Vector.mul(kZAxis, height));
            grid.DrawLine(startPos, endPos, color);
        }
    }

    // pos is in world space coordinates. The returned position is also in world space coordinates.
    grid.GetNearestCellCenter = function (pos) {
        var index = grid.GetCellIndexByPos(pos);
        var cellPos = grid.GetCellPositionByIndex(index);
        cellPos.addScalarX(m_cellSize / 2);
        cellPos.addScalarY(m_cellSize / 2);
        return cellPos;
    }

    // returns a position in world space coordinates.
    grid.GetCellCenterByIndex = function (index) {
        var cellPosition = grid.GetCellPositionByIndex(index);
        cellPosition.addScalarX(m_cellSize / 2);
        cellPosition.addScalarY(m_cellSize / 2);
        return cellPosition;
    }
    grid.GetCellCenter = function (col, row) {
        return grid.GetCellCenterByIndex(grid.GetCellIndex(col, row));
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
        var cellPosition = grid.Origin.add(new Vector(x, y));
        return cellPosition;
    }

    // pass in world space coords. Get the tile index at the passed position
    grid.GetCellIndexByPos = function (pos) {
        if (!grid.IsPosInBounds(pos)) {
            return -1;
        }

        pos.subtract(Origin);
        var col = parseInt(pos.x / m_cellSize);
        var row = parseInt(pos.y / m_cellSize);
        return grid.GetCellIndex(col, row);
    }

    grid.GetCellIndex = function (col, row) {
        return (row * m_numberOfColumns + col);
    }

    grid.GetRow = function (index) {
        var row = index / m_numberOfColumns; //m_numberOfRows;
        return row;
    }

    grid.GetColumn = function (index) {
        var col = index % m_numberOfColumns;
        return col;
    }
    grid.GetX = function (index) {
        return GetColumn(index);
    }

    grid.GetY = function (index) {
        return GetRow(index);
    }

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
            pos.z <= grid.Top &&
            pos.z >= grid.Bottom);
    }


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

    /// <summary>
    /// Gets the own grids.根据中心点及占用格子size,取得占用格子index数,注意只有在长宽一样的情况时
    /// </summary>
    /// <returns>
    /// The own grids.
    /// </returns>
    /// <param name='center'>
    /// Center. 中心点index
    /// </param>
    /// <param name='size'>
    /// Size. Size * Size的范围
    /// </param>
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
    return grid;
}
