var grid = {}

grid.kXAxis = new Victor(1, 0);       // points in the directon of the positive X axis
grid.kZAxis = new Victor(0, 1);       // points in the direction of the positive Y axis
grid.kDepth = 1;           // used for intersection tests done in 3D.

grid.m_numberOfRows = 10;
grid.m_numberOfColumns = 10;
grid.m_cellSize = 1;
grid.m_origin = null;


grid.DrawLine = function (from, to, color, contaner) {
    //<div style="width:480px;height:1px; background:#E0E0E0;"></div>
    var le = document.createElement("div");
    return le;
}
/**
 * Use this for initialization
 * @method init
 * @for flowChartKit
 * @param {Victor} origin jsPlumb的实例
 * @param {Number} numRows 网格行
 * @param {Number} numCols 网格列
 * @param {Number} cellSize 网格大小
 * @return {null} null
 */
grid.init = function (origin, numRows, numCols, cellSize) {
    grid.m_origin = origin;
    grid.m_numberOfRows = numRows;
    grid.m_numberOfColumns = numCols;
    grid.m_cellSize = cellSize;

    grid.Width = (grid.m_numberOfColumns * grid.m_cellSize);
    grid.Height = (grid.m_numberOfRows * grid.m_cellSize);
    grid.Origin = grid.m_origin;
    grid.NumberOfCells = grid.m_numberOfRows * grid.m_numberOfColumns;
    grid.Left = grid.Origin.x;
    grid.Right = grid.Origin.x + grid.Width;
    grid.Top = grid.Origin.z + grid.Height;
    grid.Bottom = grid.Origin.z;
    grid.CellSize = grid.m_cellSize;
}

grid.DebugDraw = function (color) {
    var width = grid.Width;
    var height = grid.Height;

    // Draw the horizontal grid lines
    for (i = 0; i < grid.m_numberOfRows + 1; i++) {
        var startPos = grid.Origin.add( grid.kZAxis.multiplyScalar(i * grid.CellSize));
        var endPos = startPos + width * grid.kXAxis;
        grid.DrawLine(startPos, endPos, color);
    }

    // Draw the vertial grid lines
    for (i = 0; i < grid.m_numberOfColumns + 1; i++) {
        // var startPos = origin + i * cellSize * kXAxis;
        var startPos = grid.Origin.add( grid.kXAxis.multiplyScalar(i * grid.CellSize));
        var endPos = startPos.add(grid.kZAxis.multiplyScalar(height));
        grid.DrawLine(startPos, endPos, color);
    }
}

// pos is in world space coordinates. The returned position is also in world space coordinates.
grid.GetNearestCellCenter(pos) = function () {
    var index = grid.GetCellIndex(pos);
    var cellPos = grid.GetCellPosition(index);
    cellPos.x += (m_cellSize / 2);
    cellPos.z += (m_cellSize / 2);
    return cellPos;
}

// returns a position in world space coordinates.
grid.GetCellCenter(int index)
{
    Vector3 cellPosition = GetCellPosition(index);
    cellPosition.x += (m_cellSize / 2.0f);
    cellPosition.z += (m_cellSize / 2.0f);
    return cellPosition;
}
grid.GetCellCenter(int col, int row)
{
    return GetCellCenter(GetCellIndex(col, row));
}
/// <summary>
/// Returns the lower left position of the grid cell at the passed tile index. The origin of the grid is at the lower left,
/// so it uses a cartesian coordinate system.
/// </summary>
/// <param name="index">index to the grid cell to consider</param>
/// <returns>Lower left position of the grid cell (origin position of the grid cell), in world space coordinates</returns>
grid.GetCellPosition(int index)
{
    int row = GetRow(index);
    int col = GetColumn(index);
    float x = col * m_cellSize;
    float z = row * m_cellSize;
    Vector3 cellPosition = Origin + new Vector3(x, 0.0f, z);
    return cellPosition;
}

// pass in world space coords. Get the tile index at the passed position
grid.GetCellIndex(Vector3 pos)
{
    if (!IsInBounds(pos)) {
        return -1;
    }

    pos -= Origin;

    return GetCellIndex((int)(pos.x / m_cellSize), (int)(pos.z / m_cellSize));
}

grid.GetCellIndex(int col, int row)
{
    return (row * m_numberOfColumns + col);
}

// pass in world space coords. Get the tile index at the passed position, clamped to be within the grid.
grid.GetCellIndexClamped(Vector3 pos)
{
    pos -= Origin;

    int col = (int)(pos.x / m_cellSize);
    int row = (int)(pos.z / m_cellSize);

    //make sure the position is in range.
    col = (int)Mathf.Clamp(col, 0, m_numberOfColumns - 1);
    row = (int)Mathf.Clamp(row, 0, m_numberOfRows - 1);

    return (row * m_numberOfColumns + col);
}

grid.GetRow(int index)
{
    int row = index / m_numberOfColumns; //m_numberOfRows;
    return row;
}

grid.GetColumn(int index)
{
    int col = index % m_numberOfColumns;
    return col;
}
grid.GetX(int index)
{
    return GetColumn(index);
}

grid.GetY(int index)
{
    return GetRow(index);
}


grid.IsInBounds(int col, int row)
{
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

grid.IsInBounds(int index)
{
    return (index >= 0 && index < NumberOfCells);
}

// pass in world space coords
grid.IsInBounds(Vector3 pos)
{
    return (pos.x >= Left &&
        pos.x <= Right &&
        pos.z <= Top &&
        pos.z >= Bottom);
}


grid.LeftIndex(int index)
{
    int col = GetColumn(index);
    int row = GetRow(index);
    col = col - 1;
    if (IsInBounds(col, row)) {
        return GetCellIndex(col, row);
    }
    else {
        return -1;
    }
}

grid.RightIndex(int index)
{
    int col = GetColumn(index);
    int row = GetRow(index);
    col = col + 1;
    if (IsInBounds(col, row)) {
        return GetCellIndex(col, row);
    }
    else {
        return -1;
    }
}
grid.UpIndex(int index)
{
    int col = GetColumn(index);
    int row = GetRow(index);
    row = row + 1;
    if (IsInBounds(col, row)) {
        return GetCellIndex(col, row);
    }
    else {
        return -1;
    }
}

grid.DownIndex(int index)
{
    int col = GetColumn(index);
    int row = GetRow(index);
    row = row - 1;
    if (IsInBounds(col, row)) {
        return GetCellIndex(col, row);
    }
    else {
        return -1;
    }
}

grid.LeftUpIndex(int index)
{
    int col = GetColumn(index);
    int row = GetRow(index);
    col = col - 1;
    row = row + 1;
    if (IsInBounds(col, row)) {
        return GetCellIndex(col, row);
    }
    else {
        return -1;
    }
}

grid.RightUpIndex(int index)
{
    int col = GetColumn(index);
    int row = GetRow(index);
    col = col + 1;
    row = row + 1;
    if (IsInBounds(col, row)) {
        return GetCellIndex(col, row);
    }
    else {
        return -1;
    }
}

grid.LeftDownIndex(int index)
{
    int col = GetColumn(index);
    int row = GetRow(index);
    col = col - 1;
    row = row - 1;
    if (IsInBounds(col, row)) {
        return GetCellIndex(col, row);
    }
    else {
        return -1;
    }
}

grid.RightDownIndex(int index)
{
    int col = GetColumn(index);
    int row = GetRow(index);
    col = col + 1;
    row = row - 1;
    if (IsInBounds(col, row)) {
        return GetCellIndex(col, row);
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
grid.getCells(int center, int size)
{
    List < int > ret = new List<int>();
    if (center < 0) {
        return ret;
    }

    int half = size / 2;
    int numRows = m_numberOfColumns;// m_numberOfRows;
    if (size % 2 == 0) {
        for (int row = 0; row <= half; row++)
        {
            for (int i = 1; i <= half; i++)
            {
                int tpindex = center - row * numRows - i;
                if (tpindex / numRows != (center - row * numRows) / numRows) {
                    tpindex = -1;
                }
                ret.Add(tpindex);
            }
            for (int i = 0; i < half; i++)
            {
                int tpindex = center - row * numRows + i;
                if (tpindex / numRows != (center - row * numRows) / numRows) {
                    tpindex = -1;
                }
                ret.Add(tpindex);
            }
        }
        for (int row = 1; row <= half - 1; row++)
        {
            for (int i = 1; i <= half; i++)
            {
                int tpindex = center + row * numRows - i;
                if (tpindex / numRows != (center + row * numRows) / numRows) {
                    tpindex = -1;
                }
                ret.Add(tpindex);
            }
            for (int i = 0; i < half; i++)
            {
                int tpindex = center + row * numRows + i;
                if (tpindex / numRows != (center + row * numRows) / numRows) {
                    tpindex = -1;
                }
                ret.Add(tpindex);
            }
        }

    }
    else {
        for (int row = 0; row <= half; row++)
        {
            for (int i = 0; i <= half; i++)
            {
                int tpindex = center - row * numRows - i;
                if (tpindex / numRows != (center - row * numRows) / numRows) {
                    tpindex = -1;
                }
                ret.Add(tpindex);
            }

            for (int i = 1; i <= half; i++)
            {
                int tpindex = center - row * numRows + i;
                if (tpindex / numRows != (center - row * numRows) / numRows) {
                    tpindex = -1;
                }
                ret.Add(tpindex);
            }
        }

        for (int row = 1; row <= half; row++)
        {
            for (int i = 0; i <= half; i++)
            {
                int tpindex = center + row * numRows - i;
                if (tpindex / numRows != (center + row * numRows) / numRows) {
                    tpindex = -1;
                }
                ret.Add(tpindex);
            }

            for (int i = 1; i <= half; i++)
            {
                int tpindex = center + row * numRows + i;
                if (tpindex / numRows != (center + row * numRows) / numRows) {
                    tpindex = -1;
                }
                ret.Add(tpindex);
            }
        }
    }
    return ret;
}
