import { useState } from 'react';
import AdminPanel from './components/AdminPanel.jsx';
import SorteioView from './components/SorteioView.jsx';
import { SorteioProvider } from './context/SorteioContext.jsx';
import './App.css';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <SorteioProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {showAdmin ? (
            <AdminPanel onViewResults={() => setShowAdmin(false)} />
          ) : (
            <SorteioView onShowAdmin={() => setShowAdmin(true)} />
          )}
        </div>
      </div>
    </SorteioProvider>
  );
}

export default App;
