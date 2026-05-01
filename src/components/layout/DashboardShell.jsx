import Sidebar from "./Sidebar";
import PageHeader from "./PageHeader";
import "../../styles/dashboard-shell.css";

export function DashboardShell({ title, description, children }) {
  return (
    <div className="dashboard-shell-layout">
      <Sidebar />
      <div className="dashboard-main">
        <PageHeader title={title} description={description} />
        <main className="dashboard-content">
          <div className="dashboard-page-body">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default DashboardShell;
