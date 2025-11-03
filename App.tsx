import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import DiseaseDetector from './components/DiseaseDetector';
import ProgressTracker from './components/ProgressTracker';
import AiAssistant from './components/AiAssistant';
import Auth from './components/Auth';
import { AnalysisReport, User } from './types';
import { Dna, Bot, BarChart3 } from 'lucide-react';
import { getCurrentUser, logout } from './services/authService';


type Tab = 'detector' | 'tracker' | 'assistant';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('detector');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisReport[]>([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      // In a real app, you'd fetch history from a backend
      const storedHistory = localStorage.getItem(`history_${user.email}`);
      if (storedHistory) {
        setAnalysisHistory(JSON.parse(storedHistory));
      }
    }
  }, []);

  const addAnalysisToHistory = useCallback((report: AnalysisReport) => {
    setAnalysisHistory(prevHistory => {
        const newHistory = [report, ...prevHistory];
        if (currentUser) {
            // In a real app, you'd save history to a backend
            localStorage.setItem(`history_${currentUser.email}`, JSON.stringify(newHistory));
        }
        return newHistory;
    });
  }, [currentUser]);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    // Load user-specific history on login
    const storedHistory = localStorage.getItem(`history_${user.email}`);
    setAnalysisHistory(storedHistory ? JSON.parse(storedHistory) : []);
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setAnalysisHistory([]);
    setActiveTab('detector');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'detector':
        return <DiseaseDetector addAnalysisToHistory={addAnalysisToHistory} />;
      case 'tracker':
        return <ProgressTracker history={analysisHistory} />;
      case 'assistant':
        return <AiAssistant />;
      default:
        return <DiseaseDetector addAnalysisToHistory={addAnalysisToHistory} />;
    }
  };

  if (!currentUser) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  const navItems = [
    { id: 'detector', label: 'Detector', icon: Dna },
    { id: 'tracker', label: 'Progress Tracker', icon: BarChart3 },
    { id: 'assistant', label: 'AI Assistant', icon: Bot },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Header user={currentUser} onLogout={handleLogout} />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl mx-auto">
          <div className="mb-8 border-b border-slate-200">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as Tab)}
                  className={`${
                    activeTab === item.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  } group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
                >
                  <item.icon className="-ml-0.5 mr-2 h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
          {renderContent()}
        </div>
      </main>
      <footer className="bg-slate-100 text-center p-4 text-xs text-slate-500">
        <p>
          <strong>Disclaimer:</strong> DermaDetect AI is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
        </p>
      </footer>
    </div>
  );
};

export default App;
