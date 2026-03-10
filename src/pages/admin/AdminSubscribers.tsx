import { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, Search, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  listSubscribers,
  getSubscriber,
  updateSubscriber,
  deleteSubscriber,
  type Subscriber,
  type ListParams,
} from '@/services/adminSubscriberService';

const PER_PAGE = 25;

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Filters
  const [search, setSearch] = useState('');
  const [filterLang, setFilterLang] = useState<string>('');
  const [filterMuni, setFilterMuni] = useState<string>('');
  const [filterScenario, setFilterScenario] = useState<string>('');
  const [filterConsent, setFilterConsent] = useState<string>('');

  // Dialogs
  const [viewRecord, setViewRecord] = useState<Subscriber | null>(null);
  const [editRecord, setEditRecord] = useState<Subscriber | null>(null);
  const [editForm, setEditForm] = useState<Partial<Subscriber>>({});
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: ListParams = { page, per_page: PER_PAGE, sort_by: 'created_at', sort_dir: 'desc' };
      if (search) params.search = search;
      if (filterLang) params.language = filterLang;
      if (filterMuni) params.municipality = filterMuni;
      if (filterScenario) params.scenario = filterScenario;
      if (filterConsent === 'true') params.consent = true;
      if (filterConsent === 'false') params.consent = false;

      const result = await listSubscribers(params);
      setSubscribers(result.data);
      setTotal(result.total);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  }, [page, search, filterLang, filterMuni, filterScenario, filterConsent]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  // View
  const openView = async (id: string) => {
    try {
      const rec = await getSubscriber(id);
      setViewRecord(rec);
    } catch { toast.error('Failed to load record'); }
  };

  // Edit
  const openEdit = async (id: string) => {
    try {
      const rec = await getSubscriber(id);
      setEditRecord(rec);
      setEditForm({ email: rec.email, consent_status: rec.consent_status, language: rec.language, municipality: rec.municipality, scenario: rec.scenario });
    } catch { toast.error('Failed to load record'); }
  };

  const handleSave = async () => {
    if (!editRecord) return;
    setSaving(true);
    try {
      await updateSubscriber(editRecord.id, editForm);
      toast.success('Record updated');
      setEditRecord(null);
      fetchData();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteSubscriber(deleteId);
      toast.success('Record deleted');
      setDeleteId(null);
      fetchData();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/dashboard')}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Dashboard
        </Button>
      </div>
      <h1 className="text-2xl font-bold mb-6">Email Database</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search email…" className="pl-9" value={search} onChange={(e) => handleSearch(e.target.value)} />
        </div>
        <Select value={filterLang} onValueChange={(v) => { setFilterLang(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-[130px]"><SelectValue placeholder="Language" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All languages</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ru">Russian</SelectItem>
            <SelectItem value="fi">Finnish</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterConsent} onValueChange={(v) => { setFilterConsent(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-[130px]"><SelectValue placeholder="Consent" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All consent</SelectItem>
            <SelectItem value="true">Consented</SelectItem>
            <SelectItem value="false">Not consented</SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder="Municipality" className="w-[160px]" value={filterMuni} onChange={(e) => { setFilterMuni(e.target.value); setPage(1); }} />
        <Input placeholder="Scenario" className="w-[140px]" value={filterScenario} onChange={(e) => { setFilterScenario(e.target.value); setPage(1); }} />
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2 p-4 mb-4 border border-destructive/50 bg-destructive/5 rounded-md text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
          <Button variant="outline" size="sm" className="ml-auto" onClick={fetchData}>Retry</Button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : subscribers.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No subscribers found</div>
      ) : (
        <>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Consent</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Municipality</TableHead>
                  <TableHead>Scenario</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.email}</TableCell>
                    <TableCell>
                      <Badge variant={s.consent_status ? 'default' : 'secondary'}>
                        {s.consent_status ? 'Yes' : 'No'}
                      </Badge>
                    </TableCell>
                    <TableCell>{s.language}</TableCell>
                    <TableCell>{s.municipality || '—'}</TableCell>
                    <TableCell>{s.scenario || '—'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openView(s.id)}><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(s.id)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">{total} record{total !== 1 ? 's' : ''}</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">{page} / {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* View Dialog */}
      <Dialog open={!!viewRecord} onOpenChange={() => setViewRecord(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Subscriber Detail</DialogTitle><DialogDescription>Full record information</DialogDescription></DialogHeader>
          {viewRecord && (
            <div className="grid gap-3 text-sm">
              {([['Email', viewRecord.email], ['Consent', viewRecord.consent_status ? 'Yes' : 'No'], ['Language', viewRecord.language], ['Municipality', viewRecord.municipality || '—'], ['Scenario', viewRecord.scenario || '—'], ['Created', new Date(viewRecord.created_at).toLocaleString()], ['Updated', new Date(viewRecord.updated_at).toLocaleString()]] as [string, string][]).map(([l, v]) => (
                <div key={l} className="flex justify-between border-b pb-2 last:border-0">
                  <span className="text-muted-foreground">{l}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editRecord} onOpenChange={() => setEditRecord(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Subscriber</DialogTitle><DialogDescription>Modify subscriber details</DialogDescription></DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={editForm.email || ''} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Consent</Label>
              <Switch checked={!!editForm.consent_status} onCheckedChange={(v) => setEditForm({ ...editForm, consent_status: v })} />
            </div>
            <div className="space-y-1.5">
              <Label>Language</Label>
              <Select value={editForm.language || 'en'} onValueChange={(v) => setEditForm({ ...editForm, language: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ru">Russian</SelectItem>
                  <SelectItem value="fi">Finnish</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Municipality</Label>
              <Input value={editForm.municipality || ''} onChange={(e) => setEditForm({ ...editForm, municipality: e.target.value || null })} />
            </div>
            <div className="space-y-1.5">
              <Label>Scenario</Label>
              <Input value={editForm.scenario || ''} onChange={(e) => setEditForm({ ...editForm, scenario: e.target.value || null })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRecord(null)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-1" />}Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Delete</DialogTitle><DialogDescription>This action cannot be undone. The subscriber record will be permanently removed.</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting && <Loader2 className="h-4 w-4 animate-spin mr-1" />}Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
