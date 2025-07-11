import { useMemo } from 'react';
import { useAtom } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { Input, Select, Tooltip } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { tableDataAtom, updateTableRowAtom } from './store';
import type { RowData } from './store';

const { Option } = Select;

interface CellProps {
  rowIndex: number;
  columnKey: keyof RowData;
  readOnly?: boolean;
  required?: boolean;
}

/**
 * 单元格组件 - 根据列类型渲染不同的输入控件
 * 
 * 特性:
 * 1. 使用 useMemo 确保原子在重新渲染时保持稳定
 * 2. 为每个单元格创建单独的原子，以实现细粒度更新
 * 3. 根据列类型渲染不同的编辑控件
 * 4. 添加必填字段标记和验证
 * 5. 优化空值显示
 */
const Cell = ({ rowIndex, columnKey, readOnly = false, required = false }: CellProps) => {
  // 使用 useMemo 创建专用于此单元格的原子
  // 这是关键的性能优化点：确保只有当前单元格数据变化时才重新渲染
  const cellAtom = useMemo(() => {
    return selectAtom(
      tableDataAtom,
      (data) => data[rowIndex]?.[columnKey] || '',
      (a, b) => a === b // 精确比较避免不必要的重渲染
    );
  }, [rowIndex, columnKey]);

  // 获取单元格值和更新函数
  const [value] = useAtom(cellAtom);
  const [, updateRow] = useAtom(updateTableRowAtom);

  // 处理值变化的统一函数
  const handleChange = (newValue: string) => {
    updateRow({ rowIndex, columnKey, newValue });
  };

  // 检查单元格值是否为空但必填
  const hasError = required && (!value || value.trim() === '');

  // 错误状态配置
  const errorProps = hasError ? {
    status: 'error' as const,
    suffix: (
      <Tooltip title="此字段为必填项">
        <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
      </Tooltip>
    )
  } : {};

  // 只读模式直接返回文本
  if (readOnly) {
    return (
      <div className="table-cell table-cell-readonly">
        {value || <span className="empty-value">-</span>}
      </div>
    );
  }

  // 数据类型列使用下拉选择框
  if (columnKey === 'dataType') {
    return (
      <Select 
        className="table-cell" 
        value={value as string} 
        onChange={handleChange}
        style={{ width: '100%' }}
        status={hasError ? 'error' : undefined}
        placeholder="请选择数据类型"
      >
        <Option value="string">字符串</Option>
        <Option value="number">数字</Option>
        <Option value="boolean">布尔值</Option>
        <Option value="object">对象</Option>
        <Option value="array">数组</Option>
        <Option value="null">空值</Option>
        <Option value="undefined">未定义</Option>
      </Select>
    );
  }

  // 为不同列设置不同的占位符文本
  const placeholderText = 
    columnKey === 'fieldName' ? '请输入字段名称' : 
    columnKey === 'description' ? '请输入字段描述' : 
    columnKey === 'defaultValue' ? '请输入默认值' : 
    '请输入内容';

  // 其他列使用文本输入框
  return (
    <Input
      className="table-cell"
      value={value as string}
      onChange={(e) => handleChange(e.target.value)}
      placeholder={placeholderText}
      onBlur={() => {
        // 失去焦点时执行额外逻辑，如数据格式化等
        if (columnKey === 'fieldName' && value) {
          // 例如：自动格式化字段名称，移除空格，转为驼峰等
          const formattedValue = value.trim().replace(/\s+/g, '');
          if (formattedValue !== value) {
            handleChange(formattedValue);
          }
        }
      }}
      {...errorProps}
    />
  );
};

export default Cell; 