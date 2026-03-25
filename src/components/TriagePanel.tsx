import { useState } from 'react';
import { TriageDecision } from '../types';

interface TriagePanelProps {
  onSubmitTriage: (decision: TriageDecision) => void;
  disabled: boolean;
}

export function TriagePanel({ onSubmitTriage, disabled }: TriagePanelProps) {
  const [level, setLevel] = useState<'emergency' | 'urgent' | 'non-urgent' | ''>('');
  const [reasoning, setReasoning] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (level && reasoning.trim()) {
      onSubmitTriage({ level: level as 'emergency' | 'urgent' | 'non-urgent', reasoning: reasoning.trim() });
    }
  };

  return (
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title mb-4">Submit Your Triage Decision</h5>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Triage Level</label>
            <select
              className="form-select"
              value={level}
              onChange={(e) => setLevel(e.target.value as any)}
              disabled={disabled}
              required
            >
              <option value="">Select triage level...</option>
              <option value="emergency">Emergency (Immediate)</option>
              <option value="urgent">Urgent (Within one hour)</option>
              <option value="non-urgent">Non-Urgent (Later in shift)</option>
              <option value="dayteam">Dayteam (Not a job for out of hours)</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Your Summary</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Summarise this case as though you were writing a clinical note to yourself."
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              disabled={disabled}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={!level || !reasoning.trim() || disabled}
          >
            Submit Triage Decision
          </button>
        </form>

        <div className="mt-4 p-3 bg-light rounded">
          <small className="text-muted">
            <strong>Guidelines:</strong>
            <ul className="mb-0 mt-2">
              <li><strong>Emergency:</strong> Life-threatening, needs immediate attention</li>
              <li><strong>Urgent:</strong> Serious but stable, needs attention within next hour ideally</li>
              <li><strong>Non-Urgent:</strong> Can wait until later in the shift</li>
              <li><strong>Dayteam:</strong> Can be handed over to the dayteam</li>
            </ul>
          </small>
        </div>
      </div>
    </div>
  );
}
