import './App.css';
import { Routes, Route } from 'react-router';
import TodosPage from './features/Todos/TodosPage.jsx';
import Header from './shared/Header.jsx';
import HomePage from './pages/HomePage.jsx';
import Logon from './features/Logon.jsx';

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Logon />} />

        <Route path="/todos" element={<TodosPage />} />
      </Routes>
    </>
  );
}

export default App;
