import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar'; 

function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto ml-64">
        <Outlet />
      </main>
    </div>
  );
}

export default App;