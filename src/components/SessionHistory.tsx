import { Session } from '../types';

interface SessionHistoryProps {
  sessions: Session[];
  onViewSession: (session: Session) => void;
  onClose: () => void;
}

export function SessionHistory({ sessions, onViewSession, onClose }: SessionHistoryProps) {
  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Session History</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {sessions.length === 0 ? (
              <div className="text-center text-muted py-5">
                <p>No completed sessions yet. Complete a scenario to see it here!</p>
              </div>
            ) : (
              <div className="list-group">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="list-group-item list-group-item-action"
                    style={{ cursor: 'pointer' }}
                    onClick={() => onViewSession(session)}
                  >
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="mb-1">{session.scenarioTitle}</h6>
                      <small className="text-muted">
                        {new Date(session.startTime).toLocaleDateString()}
                      </small>
                    </div>

                    {session.triageDecision && (
                      <div className="mt-2">
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

                    <p className="mb-1 mt-2">
                      <small className="text-muted">
                        {session.messages.length} messages exchanged
                      </small>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
