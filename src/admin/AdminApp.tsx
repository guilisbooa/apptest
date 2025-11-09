import { useState } from "react";
import { AdminLogin } from "./components/AdminLogin";
import { AdminDashboard } from "./components/AdminDashboard";

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: string;
}

export function AdminApp() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  if (!adminUser) {
    return <AdminLogin onLogin={setAdminUser} />;
  }

  return <AdminDashboard adminUser={adminUser} onLogout={() => setAdminUser(null)} />;
}
