import { useState, useEffect } from 'react';

/**
 * 简易版 useTable Hook - 适用于 Ant Design Table
 * @param {Function} fetchData - 请求函数，返回 { data, total }
 * @param {Object} options - 配置项
 */
function useTable(fetchData, options = {}) {
  const { defaultPageSize = 10, manual = false } = options;

  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: defaultPageSize,
    total: 0,
  });

  // 加载数据
  const loadData = async (params = {}) => {
    setLoading(true);
    try {
      const result = await fetchData({
        current: pagination.current,
        pageSize: pagination.pageSize,
        ...params,
      });

      setDataSource(result.data || []);
      setPagination(prev => ({
        ...prev,
        total: result.total || 0,
        ...params,
      }));
    } catch (error) {
      console.error('加载失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // Table onChange 处理
  const handleTableChange = (newPagination) => {
    loadData({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  // 初始加载
  useEffect(() => {
    if (!manual) loadData();
  }, []);

  return {
    dataSource,
    loading,
    pagination,
    onChange: handleTableChange,
    refresh: () => loadData(),
    run: loadData,
  };
}

export default useTable;
