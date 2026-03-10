import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Pencil, ChevronLeft, AlertCircle, Database, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { listContentItems, seedContentItems, type ContentItem } from '@/services/adminContentService';
import { articles } from '@/data/articles';
import { routeSteps } from '@/data/routeSteps';
import { resources } from '@/data/resources';
import { contacts } from '@/data/contacts';
import { fallbackContent } from '@/data/fallbackContent';
import { categories } from '@/data/categories';

const CONTENT_TYPES = [
  { value: 'article', label: 'Articles' },
  { value: 'route_step', label: 'Route Steps' },
  { value: 'local_resource', label: 'Local Resources' },
  { value: 'contact_point', label: 'Contact Points' },
  { value: 'fallback_content', label: 'Fallback Content' },
  { value: 'step', label: 'Steps (Next Steps)' },
  { value: 'guide_card', label: 'Guide Cards' },
  { value: 'step_bundle', label: 'Step Bundles' },
];

export default function AdminContent() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [seeding, setSeeding] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listContentItems(filterType || undefined, search || undefined, filterCategory || undefined);
      setItems(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  }, [search, filterType, filterCategory]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const seedItems = [
        ...articles.map(a => ({ id: a.id, content_type: 'article' as const, data: { ...a } })),
        ...routeSteps.map(s => ({ id: s.id, content_type: 'route_step' as const, data: { ...s } })),
        ...resources.map(r => ({ id: r.id, content_type: 'local_resource' as const, data: { ...r } })),
        ...contacts.map(c => ({ id: c.id, content_type: 'contact_point' as const, data: { ...c } })),
        ...fallbackContent.map((f) => ({ id: `fallback-${f.categoryId}-${f.municipalityId}`, content_type: 'fallback_content' as const, data: { ...f } })),
      ];
      await seedContentItems(seedItems);
      toast.success(`Seeded ${seedItems.length} content items`);
      fetchData();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Seed failed');
    } finally {
      setSeeding(false);
    }
  };

  const getTitle = (item: ContentItem): string => {
    const d = item.data;
    return d?.title?.en || d?.name?.en || d?.message?.en || item.id;
  };

  const getTypeLabel = (type: string) => {
    return CONTENT_TYPES.find(t => t.value === type)?.label || type;
  };

  const getTypeBadgeVariant = (type: string): 'default' | 'secondary' | 'outline' | 'destructive' => {
    if (type === 'article') return 'default';
    if (type === 'route_step' || type === 'step') return 'secondary';
    if (type === 'guide_card') return 'default';
    if (type === 'step_bundle') return 'destructive';
    if (type === 'local_resource' || type === 'contact_point') return 'outline';
    return 'secondary';
  };

  return (
    <AdminLayout>
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/dashboard')}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Dashboard
        </Button>
      </div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Content Management</h1>
        <div className="flex gap-2">
          {items.length === 0 && !loading && !error && (
            <Button onClick={handleSeed} disabled={seeding} size="sm">
              {seeding ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Database className="h-4 w-4 mr-1" />}
              Seed from defaults
            </Button>
          )}
          <Button size="sm" onClick={() => navigate('/admin/content/new')}>
            <Plus className="h-4 w-4 mr-1" />
            New item
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search content…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filterType} onValueChange={(v) => setFilterType(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Content type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {CONTENT_TYPES.map(t => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.icon} {c.name.en}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 mb-4 border border-destructive/50 bg-destructive/5 rounded-md text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
          <Button variant="outline" size="sm" className="ml-auto" onClick={fetchData}>Retry</Button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>No content items found</p>
          <p className="text-sm mt-2">Click "Seed from defaults" to populate from built-in content</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden md:table-cell">ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Title / Name</TableHead>
                <TableHead className="hidden sm:table-cell">Scope</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} className="cursor-pointer" onClick={() => navigate(`/admin/content/${item.id}`)}>
                  <TableCell className="font-mono text-xs text-muted-foreground hidden md:table-cell">{item.id}</TableCell>
                  <TableCell>
                    <Badge variant={getTypeBadgeVariant(item.content_type)}>
                      {getTypeLabel(item.content_type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">{getTitle(item)}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{item.data?.municipalityId || '—'}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{(() => { const catId = item.category || item.data?.categoryId; const cat = categories.find(c => c.id === catId); return cat ? `${cat.icon} ${cat.name.en}` : catId || '—'; })()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); navigate(`/admin/content/${item.id}`); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </AdminLayout>
  );
}
