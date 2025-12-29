import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import { Layout } from './components/Layout';
import { AllTasksPage } from './pages/AllTasksPage';
import { CompletedTasksPage } from './pages/CompletedTasksPage';

function App() {
  return (
    <Router>
      <TaskProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<AllTasksPage />} />
            <Route path="/completed" element={<CompletedTasksPage />} />
          </Routes>
        </Layout>
      </TaskProvider>
    </Router>
  );
}

export default App;
