import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, FileText, MapPin, Users, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/admin/subscribers')}>
          <CardHeader>
            <div className="rounded-full bg-primary/10 p-3 w-fit mb-2">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Email Database</CardTitle>
            <CardDescription>View and manage subscriber records</CardDescription>
          </CardHeader>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/admin/content')}>
          <CardHeader>
            <div className="rounded-full bg-primary/10 p-3 w-fit mb-2">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Content Management</CardTitle>
            <CardDescription>Articles, route steps, resources, contacts, fallback</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </AdminLayout>
  );
}
