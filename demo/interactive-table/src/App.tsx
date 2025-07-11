import { Provider } from 'jotai';
import { ConfigProvider, Button, Card } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import './App.css';
import InteractiveTable from './components/InteractiveTable';

function App() {
  return (
    <Provider>
      <ConfigProvider locale={zhCN}>
        <div className="app-container">
            <Card title="用户数据模型" 
              extra={
                <Button type="primary">导出模型</Button>
              }
            >
              <InteractiveTable />
            </Card>
        </div>
      </ConfigProvider>
    </Provider>
  );
}

export default App;
