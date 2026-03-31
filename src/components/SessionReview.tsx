import { Session } from '../types';

interface SessionReviewProps {
  session: Session;
  onClose: () => void;
}

function downloadSession(session: Session) {
  const payload = {
    exported_at: new Date().toISOString(),
    scenario: session.scenarioTitle,
    started: new Date(session.startTime).toISOString(),
    completed: session.endTime ? new Date(session.endTime).toISOString() : null,
    triage_decision: session.triageDecision ?? null,
    is_correct: session.isCorrect ?? null,
    conversation: session.messages
      .filter(m => m.role !== 'system')
      .map(m => ({ role: m.role, content: m.content, timestamp: new Date(m.timestamp).toISOString() })),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = new Date(session.startTime).toISOString().slice(0, 10);
  const slug = session.scenarioTitle.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
  a.href = url;
  a.download = `triage-session-${slug}-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function SessionReview({ session, onClose }: SessionReviewProps) {
  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Session Review: {session.scenarioTitle}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">Started: {new Date(session.startTime).toLocaleString()}</small>
                </div>
                {session.triageDecision && (
                  <div>
                    <span className={`badge ${
                      session.isCorrect ? 'bg-success' : 'bg-danger'
                    } me-2`}>
                      {session.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                    <span className={`badge ${
                      session.triageDecision.level === 'emergency' ? 'bg-danger' :
                      session.triageDecision.level === 'urgent' ? 'bg-warning text-dark' :
                      'bg-info'
                    }`}>
                      {session.triageDecision.level.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {session.triageDecision && (
              <div className="card mb-4">
                <div className="card-body">
                  <h6 className="card-title">Your Triage Decision</h6>
                  <p className="mb-0">{session.triageDecision.reasoning}</p>
                </div>
              </div>
            )}

            <h6 className="mb-3">Conversation Transcript</h6>
            <div className="border rounded p-3 bg-light">
              {session.messages.filter(m => m.role !== 'system').map((message) => (
                <div key={message.id} className="mb-3">
                  <div className={`p-3 rounded ${
                    message.role === 'user' ? 'bg-primary text-white' : 'bg-white'
                  }`}>
                    <div className="small mb-1">
                      <strong>{message.role === 'user' ? 'You' : 'Nurse'}</strong>
                      {' - '}
                      <span className="opacity-75">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div>{message.content}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => downloadSession(session)}>
              Download Transcript
            </button>
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
