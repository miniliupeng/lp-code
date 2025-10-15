import React from 'react';
import { Table } from 'antd';
import useTable from './index';

// 模拟 API 请求
const fetchUserList = async (params) => {
  console.log('请求参数:', params);
  // 实际使用时替换为真实接口
  return {
    data: [
      { id: 1, name: '张三', age: 28 },
      { id: 2, name: '李四', age: 32 },
    ],
    total: 100,
  };
};

function UserTable() {
  const { dataSource, loading, pagination, onChange } = useTable(fetchUserList);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '年龄', dataIndex: 'age', key: 'age' },
  ];

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      pagination={pagination}
      onChange={onChange}
      rowKey="id"
    />
  );
}

export default UserTable;

