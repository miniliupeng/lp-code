import { atom } from 'jotai';
import { selectAtom } from 'jotai/utils';

/**
 * 数据模型字段的类型定义
 */
export interface RowData {
  id: string;
  fieldName: string;
  dataType: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  defaultValue: string;
}

/**
 * 生成初始数据
 * @param count 要生成的数据条数
 */
const generateData = (count: number): RowData[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `field_${i}`,
    fieldName: i === 0 ? 'id' : i === 1 ? 'name' : `field_${i}`,
    dataType: i === 0 ? 'number' : i === 1 ? 'string' : 
              i % 3 === 0 ? 'boolean' : i % 2 === 0 ? 'number' : 'string',
    description: i === 0 ? '主键ID' : i === 1 ? '名称' : `字段${i}的描述信息`,
    defaultValue: i === 0 ? '0' : i === 1 ? '' : i % 3 === 0 ? 'false' : i % 2 === 0 ? '0' : '',
  }));
};

/**
 * 主数据原子 - 所有数据的真理来源
 * 所有其他原子都是从这个原子派生的
 */
export const tableDataAtom = atom<RowData[]>(generateData(20));

/**
 * 派生原子 - 表格行数
 * 通过 selectAtom 创建，只在行数发生变化时更新
 */
export const tableRowCountAtom = selectAtom(tableDataAtom, (data) => data.length);

/**
 * 更新表格行数据的原子
 * 只更新指定行的指定列
 */
export const updateTableRowAtom = atom(
  null,
  (get, set, { rowIndex, columnKey, newValue }: { 
    rowIndex: number; 
    columnKey: keyof RowData; 
    newValue: string 
  }) => {
    const currentData = get(tableDataAtom);
    
    // 检查索引是否有效
    if (rowIndex < 0 || rowIndex >= currentData.length) {
      console.error(`行索引 ${rowIndex} 超出范围`);
      return;
    }
    
    // 创建新数据，只更新需要改变的行
    const newData = [...currentData];
    newData[rowIndex] = { ...newData[rowIndex], [columnKey]: newValue };
    
    // 更新主数据原子
    set(tableDataAtom, newData);
  }
);

/**
 * 添加新行的原子
 */
export const addRowAtom = atom(
  null,
  (get, set) => {
    const currentData = get(tableDataAtom);
    const newIndex = currentData.length;
    
    // 创建新行数据
    const newRow: RowData = {
      id: `field_${newIndex}`,
      fieldName: `field_${newIndex}`,
      dataType: 'string',
      description: '',
      defaultValue: '',
    };
    
    // 添加到数据末尾
    set(tableDataAtom, [...currentData, newRow]);
  }
);

/**
 * 删除行的原子
 */
export const deleteRowAtom = atom(
  null,
  (get, set, rowIndex: number) => {
    const currentData = get(tableDataAtom);
    
    // 检查索引是否有效
    if (rowIndex < 0 || rowIndex >= currentData.length) {
      console.error(`行索引 ${rowIndex} 超出范围`);
      return;
    }
    
    // 过滤掉要删除的行
    const newData = currentData.filter((_, index) => index !== rowIndex);
    set(tableDataAtom, newData);
  }
); 