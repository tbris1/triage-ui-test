import { Scenario, TriageDecision } from '../types';

interface FeedbackModalProps {
  show: boolean;
  scenario: Scenario;
  decision: TriageDecision;
  isCorrect: boolean;
  onClose: () => void;
}

export function FeedbackModal({ show, scenario, decision, isCorrect, onClose }: FeedbackModalProps) {
  if (!show) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Triage Assessment Results</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className={`alert ${isCorrect ? 'alert-success' : 'alert-warning'}`}>
              <h5 className="alert-heading">
                {isCorrect ? '✓ Correct Assessment!' : '⚠ Incorrect Assessment'}
              </h5>
              <p className="mb-0">
                {isCorrect
                  ? 'You correctly identified the appropriate triage level for this patient.'
                  : 'Your triage assessment does not match the recommended level for this case.'}
              </p>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-subtitle mb-2 text-muted">Your Decision</h6>
                    <p className="card-text">
                      <span className={`badge ${
                        decision.level === 'emergency' ? 'bg-danger' :
                        decision.level === 'urgent' ? 'bg-warning text-dark' :
                        'bg-success'
                      }`}>
                        {decision.level.toUpperCase()}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-subtitle mb-2 text-muted">Correct Answer</h6>
                    <p className="card-text">
                      <span className={`badge ${
                        scenario.correctTriage === 'emergency' ? 'bg-danger' :
                        scenario.correctTriage === 'urgent' ? 'bg-warning text-dark' :
                        'bg-success'
                      }`}>
                        {scenario.correctTriage.toUpperCase()}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <h6>Your Reasoning:</h6>
              <p className="bg-light p-3 rounded">{decision.reasoning}</p>
            </div>

            <div>
              <h6>Key Learning Points:</h6>
              <ul>
                {scenario.learningPoints.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
