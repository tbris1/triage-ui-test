import { Scenario } from '../types';

interface ScenarioSelectorProps {
  scenarios: Scenario[];
  onSelectScenario: (scenario: Scenario) => void;
}

export function ScenarioSelector({ scenarios, onSelectScenario }: ScenarioSelectorProps) {
  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">On-Call Triage and Prioritisation Training</h1>
      <p className="text-center text-muted mb-5">
        <h4>The time is 23:00. You are the on-call FY1.</h4>
        <h4>Several nurses are requesting your assistance... </h4>
        <i>A work in progress.</i>
      </p>

      <div className="row g-4">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="col-md-6">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{scenario.title}</h5>
                <p className="card-text text-muted">{scenario.description}</p>
                <button
                  className="btn btn-primary w-100"
                  onClick={() => onSelectScenario(scenario)}
                >
                  Start Scenario
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
