import { useState, useEffect } from 'react';
import { ScenarioSelector } from './components/ScenarioSelector';
import { ChatInterface } from './components/ChatInterface';
import { TriagePanel } from './components/TriagePanel';
import { FeedbackModal } from './components/FeedbackModal';
import { SessionHistory } from './components/SessionHistory';
import { SessionReview } from './components/SessionReview';
import { scenarios } from './scenarios';
import { Scenario, Message, TriageDecision, Session } from './types';
import { sendChatMessage } from './services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

type View = 'scenario-select' | 'training' | 'history';

function App() {
  const [currentView, setCurrentView] = useState<View>('scenario-select');
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [triageDecision, setTriageDecision] = useState<TriageDecision | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [reviewSession, setReviewSession] = useState<Session | null>(null);
  const [currentSessionId] = useState<string>(crypto.randomUUID());

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('triageSessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('triageSessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  const handleSelectScenario = (scenario: Scenario) => {
    setCurrentScenario(scenario);
    const systemMessage: Message = {
      id: crypto.randomUUID(),
      role: 'system',
      content: scenario.initialPrompt,
      timestamp: new Date(),
    };

    const welcomeMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: scenario.initialPrompt,
      timestamp: new Date(),
    };

    setMessages([systemMessage, welcomeMessage]);
    setCurrentView('training');
    setTriageDecision(null);
    setShowFeedback(false);
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const responseContent = await sendChatMessage(
        updatedMessages,
        currentScenario?.yaml_path,
        currentScenario?.initialPrompt
      );

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      };

      setMessages([...updatedMessages, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure the backend server is running.',
        timestamp: new Date(),
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitTriage = (decision: TriageDecision) => {
    setTriageDecision(decision);
    const isCorrect = decision.level === currentScenario?.correctTriage;

    // Save session
    const session: Session = {
      id: currentSessionId,
      scenarioId: currentScenario!.id,
      scenarioTitle: currentScenario!.title,
      messages,
      triageDecision: decision,
      isCorrect,
      score: isCorrect ? 100 : 0,
      startTime: messages[0].timestamp,
      endTime: new Date(),
    };

    setSessions(prev => [...prev, session]);
    setShowFeedback(true);
  };

  const handleCloseFeedback = () => {
    setShowFeedback(false);
    setCurrentView('scenario-select');
    setCurrentScenario(null);
    setMessages([]);
    setTriageDecision(null);
  };

  const handleViewSession = (session: Session) => {
    setReviewSession(session);
    setShowHistory(false);
  };

  return (
    <div className="vh-100 d-flex flex-column">
      {/* Header */}
      <nav className="navbar navbar-dark bg-primary">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">On-Call Triage and Prioritisation Training</span>
          <div>
            {currentView === 'training' && (
              <button
                className="btn btn-outline-light me-2"
                onClick={() => {
                  setCurrentView('scenario-select');
                  setCurrentScenario(null);
                  setMessages([]);
                }}
              >
                ← Back to Scenarios
              </button>
            )}
            <button
              className="btn btn-outline-light"
              onClick={() => setShowHistory(true)}
            >
              Session History
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className={`flex-grow-1 ${currentView === 'training' ? 'overflow-auto' : 'overflow-auto'}`}>
        {currentView === 'scenario-select' && (
          <ScenarioSelector
            scenarios={scenarios}
            onSelectScenario={handleSelectScenario}
          />
        )}

        {currentView === 'training' && currentScenario && (
          <div className="container-fluid h-100 py-3">
            <div className="row h-100">
              {/* Left side - Chat */}
              <div className="col-lg-8 h-100 d-flex flex-column">
                <div className="card h-100 d-flex flex-column">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">{currentScenario.title}</h5>
                  </div>
                  <div className="card-body p-0 flex-grow-1 d-flex flex-column overflow-hidden">
                    <ChatInterface
                      messages={messages}
                      onSendMessage={handleSendMessage}
                      isLoading={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Right side - Triage Panel */}
              <div className="col-lg-4 h-100">
                <TriagePanel
                  onSubmitTriage={handleSubmitTriage}
                  disabled={!!triageDecision}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showFeedback && currentScenario && triageDecision && (
        <FeedbackModal
          show={showFeedback}
          scenario={currentScenario}
          decision={triageDecision}
          isCorrect={triageDecision.level === currentScenario.correctTriage}
          onClose={handleCloseFeedback}
        />
      )}

      {showHistory && (
        <SessionHistory
          sessions={sessions}
          onViewSession={handleViewSession}
          onClose={() => setShowHistory(false)}
        />
      )}

      {reviewSession && (
        <SessionReview
          session={reviewSession}
          onClose={() => setReviewSession(null)}
        />
      )}
    </div>
  );
}

export default App;