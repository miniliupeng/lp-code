import { useAtom } from 'jotai';
import { VariableSizeGrid as Grid } from 'react-window';
import { useRef, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Spin, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { tableRowCountAtom, addRowAtom, deleteRowAtom } from './store';
import CellComponent from './Cell';
import type { RowData } from './store';
import './Table.css';

// 表格列配置
const COLUMNS = [
  { key: 'fieldName', title: '字段名称', width: 200, required: true },
  { key: 'dataType', title: '数据类型', width: 150, required: true },
  { key: 'description', title: '字段描述', width: 300, required: false },
  { key: 'defaultValue', title: '默认值', width: 150, required: false },
  { key: 'operation', title: '操作', width: 100, required: false },
] as const;

// 表格配置参数
const TABLE_HEIGHT = 500;
const ROW_HEIGHT = 40;
const ROW_BATCH_SIZE = 50; // 懒加载批次大小

/**
 * 交互式表格组件
 * 
 * 优化亮点:
 * 1. 使用虚拟滚动处理大量数据
 * 2. 使用原子化状态管理避免不必要的重新渲染
 * 3. 懒加载机制优化初始加载性能
 * 4. 添加快捷键支持
 * 5. 表头提示增强用户体验
 */
const InteractiveTable = () => {
  // 性能跟踪
  const renderCount = useRef(0);
  const gridRef = useRef<Grid>(null);
  
  // 状态管理
  const [rowCount] = useAtom(tableRowCountAtom);
  const [, addRow] = useAtom(addRowAtom);
  const [, deleteRow] = useAtom(deleteRowAtom);
  
  // 计算表格总宽度
  const totalWidth = useMemo(() => 
    COLUMNS.reduce((acc, col) => acc + col.width, 0),
    []
  );

  // 懒加载状态
  const [isLoading, setIsLoading] = useState(false);
  const loadedRowsRef = useRef(Math.min(ROW_BATCH_SIZE, rowCount));

  // 开发模式性能跟踪
  useEffect(() => {
    renderCount.current += 1;
    console.log(`[性能跟踪] 表格组件渲染次数: ${renderCount.current}`);
  });

  // 列宽度计算函数
  const getColumnWidth = useCallback((index: number) => {
    return COLUMNS[index]?.width || 150;
  }, []);

  // 添加行处理函数
  const handleAddRow = useCallback(() => {
    addRow();
    // 添加后滚动到底部
    setTimeout(() => {
      gridRef.current?.scrollToItem({
        align: 'end',
        rowIndex: rowCount,
      });
    }, 0);
  }, [addRow, rowCount]);

  // 删除行处理函数
  const handleDeleteRow = useCallback((rowIndex: number) => {
    deleteRow(rowIndex);
  }, [deleteRow]);

  // 懒加载更多行
  const loadMoreRows = useCallback(() => {
    if (loadedRowsRef.current >= rowCount || isLoading) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      loadedRowsRef.current = Math.min(
        loadedRowsRef.current + ROW_BATCH_SIZE,
        rowCount
      );
      setIsLoading(false);
    }, 300); // 模拟网络延迟
  }, [rowCount, isLoading]);

  // 滚动事件处理
  const handleScroll = useCallback(({ scrollTop, scrollUpdateWasRequested }: {
    scrollTop: number;
    scrollUpdateWasRequested: boolean;
  }) => {
    if (!scrollUpdateWasRequested) {
      const visibleRowsCount = Math.ceil(TABLE_HEIGHT / ROW_HEIGHT);
      const lastVisibleRow = Math.floor(scrollTop / ROW_HEIGHT) + visibleRowsCount;
      
      if (lastVisibleRow > loadedRowsRef.current - 10) {
        loadMoreRows();
      }
    }
  }, [loadMoreRows]);

  // 键盘快捷键处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+N: 添加新行
      if (e.altKey && e.key === 'n') {
        e.preventDefault();
        handleAddRow();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAddRow]);

  // 单元格渲染函数
  const renderCell = useCallback(({ columnIndex, rowIndex, style }: {
    columnIndex: number;
    rowIndex: number;
    style: React.CSSProperties;
  }) => {
    // 如果行还未加载，显示加载占位符
    if (rowIndex >= loadedRowsRef.current) {
      return (
        <div style={style} className="table-cell-wrapper loading-cell">
          <Spin size="small" />
        </div>
      );
    }

    const column = COLUMNS[columnIndex];
    const isLastColumn = columnIndex === COLUMNS.length - 1;

    // 最后一列渲染操作按钮
    if (isLastColumn) {
      return (
        <div style={style} className="table-cell-wrapper">
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteRow(rowIndex)}
            aria-label="删除行"
          />
        </div>
      );
    }

    // 其他列渲染输入组件
    return (
      <div style={style} className="table-cell-wrapper">
        <CellComponent 
          rowIndex={rowIndex} 
          columnKey={column.key as keyof RowData}
          readOnly={column.key === 'fieldName' && rowIndex === 0} // 只有第一行的字段名称是只读的
          required={column.required} 
        />
      </div>
    );
  }, [handleDeleteRow, loadedRowsRef]);

  return (
    <div className="table-container">
      {/* 表头 */}
      <div className="table-header" style={{ width: totalWidth }}>
        {COLUMNS.map((column) => (
          <div
            key={column.key}
            className="table-header-cell"
            style={{ width: column.width }}
          >
            {column.title}
            {column.required && (
              <Tooltip title="必填字段">
                <InfoCircleOutlined className="required-icon" />
              </Tooltip>
            )}
          </div>
        ))}
      </div>

      {/* 表格主体 - 虚拟滚动 */}
      <Grid
        ref={gridRef}
        className="table-grid"
        columnCount={COLUMNS.length}
        columnWidth={getColumnWidth}
        height={TABLE_HEIGHT}
        rowCount={rowCount}
        rowHeight={() => ROW_HEIGHT}
        width={totalWidth}
        onScroll={handleScroll}
        overscanRowCount={5} // 预渲染行数提高滚动性能
      >
        {renderCell}
      </Grid>

      {/* 表格底部控制区 */}
      <div className="table-footer" style={{ width: totalWidth }}>
        <Button 
          type="dashed" 
          onClick={handleAddRow} 
          style={{ width: '100%' }} 
          icon={<PlusOutlined />}
        >
          添加字段 (Alt+N)
        </Button>
      </div>
      
      {/* 数据统计展示 */}
      <div className="table-summary">
        总计 {rowCount} 个字段 | 已加载 {loadedRowsRef.current} 个
      </div>
    </div>
  );
};

export default InteractiveTable; 