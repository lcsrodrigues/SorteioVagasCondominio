import { useState } from 'react';
import AdminPanel from './components/AdminPanel.jsx';
import SorteioView from './components/SorteioView.jsx';
import AuthModal from './components/AuthModal.jsx';
import { SorteioProvider } from './context/SorteioContext.jsx';
import './App.css';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const handleShowAdmin = () => {
    setShowAuth(true);
  };

  const handleAuthenticated = () => {
    setShowAuth(false);
    setShowAdmin(true);
  };

  const handleAuthCancel = () => {
    setShowAuth(false);
  };

  return (
    <SorteioProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {showAdmin ? (
            <AdminPanel onViewResults={() => setShowAdmin(false)} />
          ) : (
            <SorteioView onShowAdmin={handleShowAdmin} />
          )}
        </div>
        
        {showAuth && (
          <AuthModal 
            onAuthenticated={handleAuthenticated}
            onCancel={handleAuthCancel}
          />
        )}
      </div>
    </SorteioProvider>
  );
}

export default App;
