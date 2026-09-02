import './App.css';
import TodosPage from './features/Todos/TodosPage';
import Header from './shared/Header.jsx';
import Logon from './features/Logon.jsx';
// import { useState } from 'react';
import { useAuth } from './contexts/AuthContext.jsx';

function App() {

  // const [email, setEmail] = useState('');
  // const [token, setToken] = useState('');

  const { isAuthenticated } = useAuth();

  return (
    <div>
      <Header />
{/* 
      {token ? (
        <TodosPage token={token} />
      ) : (
        <Logon onSetEmail={setEmail} onSetToken={setToken} />
      )} */}

      {isAuthenticated ? (
        <TodosPage />
      ) : (
        <Logon />
      )}
    </div>
  );
}

export default App;
