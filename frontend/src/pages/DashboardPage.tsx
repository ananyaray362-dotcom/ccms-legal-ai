import { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Clock, AlertCircle, Calendar } from 'lucide-react';

interface ActionPlan {
  id: string;
  case_number: string;
  date_of_order: string;
  responsible_department: string;
  nature_of_action: string;
  action_timelines: string;
  is_verified: boolean;
  cases: {
    file_name: string;
    status: string;
  };
}

export function DashboardPage() {
  const [plans, setPlans] = useState<ActionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/cases');
        if (response.data.success) {
          setPlans(response.data.data);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data. Ensure the backend is running and Supabase is configured.');
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  return (
    <div>
      <h1 className="page-title">Action Plans Dashboard</h1>

      <div className="status-cards">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '50%', color: 'var(--primary)' }}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{plans.length}</div>
            <div style={{ color: 'var(--text-muted)' }}>Verified Cases</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '50%', color: '#d97706' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{plans.filter(p => p.action_timelines && p.action_timelines !== 'Not explicitly stated').length}</div>
            <div style={{ color: 'var(--text-muted)' }}>Time-Bound Actions</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#fce7f3', borderRadius: '50%', color: '#db2777' }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{plans.filter(p => p.nature_of_action?.toLowerCase().includes('appeal')).length}</div>
            <div style={{ color: 'var(--text-muted)' }}>Appeals Considered</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
        ) : error ? (
           <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger)' }}>{error}</div>
        ) : plans.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No verified cases yet. Upload and verify a judgment to see it here.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Case Details</th>
                <th>Department</th>
                <th>Nature of Action</th>
                <th>Timeline</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {plans.map(plan => (
                <tr key={plan.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{plan.case_number}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                      <Calendar size={14} /> {plan.date_of_order}
                    </div>
                  </td>
                  <td>{plan.responsible_department}</td>
                  <td>{plan.nature_of_action}</td>
                  <td>
                    <span className={`badge ${plan.action_timelines === 'Not explicitly stated' ? '' : 'badge-warning'}`}>
                      {plan.action_timelines}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-success">Verified</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
