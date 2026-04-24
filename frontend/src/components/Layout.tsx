import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UploadCloud } from 'lucide-react';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-title">CCMS Legal AI</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
          <NavLink to="/upload" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <UploadCloud size={20} />
            Upload Judgment
          </NavLink>
        </nav>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
