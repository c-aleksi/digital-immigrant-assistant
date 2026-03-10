import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, ChevronLeft, Save, Plus, X, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import {
  getContentItem, updateContentItem, createContentItem,
  listContentItems, listContentRelations, setContentRelations,
  type ContentItem, type ContentData,
} from '@/services/adminContentService';
import { municipalities } from '@/data/municipalities';
import { categories } from '@/data/categories';
import { scenarios } from '@/data/scenarios';

const CONTENT_TYPES = [
  { value: 'article', label: 'Article' },
  { value: 'route_step', label: 'Route Step' },
  { value: 'local_resource', label: 'Local Resource' },
  { value: 'contact_point', label: 'Contact Point' },
  { value: 'fallback_content', label: 'Fallback Content' },
  { value: 'step', label: 'Step (Next Steps)' },
  { value: 'guide_card', label: 'Guide Card (Bundle)' },
  { value: 'step_bundle', label: 'Step Bundle' },
];

const BUNDLE_TYPES = [
  { value: 'onboarding', label: 'Onboarding (scenario)' },
  { value: 'guide', label: 'Guide (regular)' },
  { value: 'thematic', label: 'Thematic' },
];

const SCENARIO_OPTIONS = scenarios.map(s => ({ value: s.id, label: s.name.en }));

export default function AdminContentEdit() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const [item, setItem] = useState<ContentItem | null>(null);
  const [formData, setFormData] = useState<ContentData>({});
  const [contentType, setContentType] = useState<string>('step');
  const [newId, setNewId] = useState('');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Bundle/guide card composition
  const [childStepIds, setChildStepIds] = useState<string[]>([]);
  const [availableSteps, setAvailableSteps] = useState<ContentItem[]>([]);
  const [loadingRelations, setLoadingRelations] = useState(false);

  useEffect(() => {
    if (isNew || !id) return;
    setLoading(true);
    getContentItem(id)
      .then((data) => {
        setItem(data);
        setContentType(data.content_type);
        setFormData(JSON.parse(JSON.stringify(data.data)));
      })
      .catch((e) => setError(e.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  // Load relations and available steps for bundles/guide cards
  const ct = isNew ? contentType : (item?.content_type || contentType);
  const isBundleType = ct === 'step_bundle' || ct === 'guide_card';

  useEffect(() => {
    if (!isBundleType) return;

    // Load available steps
    Promise.all([
      listContentItems('step'),
      listContentItems('route_step'),
    ]).then(([steps, routeSteps]) => {
      setAvailableSteps([...steps, ...routeSteps]);
    }).catch(() => {});

    // Load existing relations
    if (!isNew && id) {
      setLoadingRelations(true);
      listContentRelations(id)
        .then((rels) => setChildStepIds(rels.map(r => r.child_id)))
        .catch(() => {})
        .finally(() => setLoadingRelations(false));
    }
  }, [isBundleType, isNew, id]);

  const handleSave = async () => {
    if (isNew && !newId.trim()) {
      toast.error('Please enter an ID for the new item');
      return;
    }
    setSaving(true);
    try {
      const categoryValue = formData.categoryId || null;
      const itemId = isNew ? newId.trim() : id!;

      if (isNew) {
        await createContentItem(itemId, contentType, formData, categoryValue);
        toast.success('Item created successfully');
      } else {
        await updateContentItem(itemId, formData, categoryValue);
        toast.success('Content saved successfully');
      }

      // Save relations for bundle types
      if (isBundleType) {
        const relType = ct === 'step_bundle' ? 'bundle_step' : 'guide_card_step';
        await setContentRelations(itemId, childStepIds, relType);
      }

      navigate('/admin/content');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const updateLocalized = (field: string, lang: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }));
  };

  const updateField = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleScenario = (scenarioId: string) => {
    const current: string[] = formData.scenarios || formData.recommendedForScenarios || [];
    const field = formData.scenarios !== undefined ? 'scenarios' : 'recommendedForScenarios';
    if (current.includes(scenarioId)) {
      updateField(field, current.filter(s => s !== scenarioId));
    } else {
      updateField(field, [...current, scenarioId]);
    }
  };

  const addChildStep = (stepId: string) => {
    if (!childStepIds.includes(stepId)) {
      setChildStepIds([...childStepIds, stepId]);
    }
  };

  const removeChildStep = (stepId: string) => {
    setChildStepIds(childStepIds.filter(id => id !== stepId));
  };

  const moveChildStep = (index: number, direction: 'up' | 'down') => {
    const newIds = [...childStepIds];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newIds.length) return;
    [newIds[index], newIds[swapIndex]] = [newIds[swapIndex], newIds[index]];
    setChildStepIds(newIds);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      </AdminLayout>
    );
  }

  if (!isNew && (error || !item)) {
    return (
      <AdminLayout>
        <div className="text-center py-16 text-destructive">{error || 'Item not found'}</div>
      </AdminLayout>
    );
  }

  const isArticle = ct === 'article';
  const isRouteStep = ct === 'route_step';
  const isStep = ct === 'step';
  const isGuideCard = ct === 'guide_card';
  const isBundle = ct === 'step_bundle';
  const isResource = ct === 'local_resource';
  const isContact = ct === 'contact_point';
  const isFallback = ct === 'fallback_content';
  const isStepLike = isRouteStep || isStep || isGuideCard || isBundle;

  const scenariosList: string[] = formData.scenarios || formData.recommendedForScenarios || [];

  return (
    <AdminLayout>
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/content')}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Content
        </Button>
      </div>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            {isNew ? 'New Content Item' : (formData.title?.en || formData.name?.en || item?.id)}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">
              {CONTENT_TYPES.find(t => t.value === ct)?.label || ct}
            </Badge>
            {!isNew && <span className="text-sm text-muted-foreground">ID: {item?.id}</span>}
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
          {isNew ? 'Create' : 'Save'}
        </Button>
      </div>

      <div className="space-y-8 max-w-3xl">
        {/* New item fields */}
        {isNew && (
          <div className="space-y-4 p-4 border rounded-md bg-muted/30">
            <div className="space-y-1.5">
              <Label>Content Type</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Item ID</Label>
              <Input value={newId} onChange={(e) => setNewId(e.target.value)} placeholder="e.g. step-register-dvv" />
              <p className="text-xs text-muted-foreground">Unique identifier. Cannot be changed later.</p>
            </div>
          </div>
        )}

        {/* ===== LOCALIZED CONTENT ===== */}
        {(isArticle || isRouteStep || isStep || isGuideCard || isBundle) && (
          <>
            <LocalizedField label="Title" field="title" data={formData} onChange={updateLocalized} />
          </>
        )}

        {(isStep || isGuideCard || isRouteStep) && (
          <LocalizedField label="Short Action / Summary" field="shortAction" data={formData} onChange={updateLocalized} />
        )}

        {isBundle && (
          <LocalizedField label="Summary" field="summary" data={formData} onChange={updateLocalized} />
        )}

        {(isArticle) && (
          <LocalizedField label="Summary" field="summary" data={formData} onChange={updateLocalized} />
        )}

        {(isArticle || isRouteStep || isStep || isGuideCard || isBundle) && (
          <LocalizedTextarea label="Description" field="description" data={formData} onChange={updateLocalized} rows={6} />
        )}

        {isResource && (
          <>
            <LocalizedField label="Name" field="name" data={formData} onChange={updateLocalized} />
            <LocalizedTextarea label="Description" field="description" data={formData} onChange={updateLocalized} rows={3} />
            <div className="space-y-1.5">
              <Label>Website URL</Label>
              <Input value={formData.url || ''} onChange={(e) => updateField('url', e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-1.5">
              <Label>Address</Label>
              <Input value={formData.address || ''} onChange={(e) => updateField('address', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input value={formData.phone || ''} onChange={(e) => updateField('phone', e.target.value)} />
            </div>
          </>
        )}

        {isContact && (
          <>
            <LocalizedField label="Name" field="name" data={formData} onChange={updateLocalized} />
            <LocalizedTextarea label="Description" field="description" data={formData} onChange={updateLocalized} rows={3} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input value={formData.phone || ''} onChange={(e) => updateField('phone', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input value={formData.email || ''} onChange={(e) => updateField('email', e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Website URL</Label>
              <Input value={formData.url || ''} onChange={(e) => updateField('url', e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-1.5">
              <Label>Address</Label>
              <Input value={formData.address || ''} onChange={(e) => updateField('address', e.target.value)} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={!!formData.isEmergency} onCheckedChange={(v) => updateField('isEmergency', v)} />
              <Label>Emergency contact</Label>
            </div>
          </>
        )}

        {isFallback && (
          <LocalizedTextarea label="Fallback Message" field="message" data={formData} onChange={updateLocalized} rows={4} />
        )}

        {/* ===== ARTICLE CONTENT ===== */}
        {isArticle && (
          <LocalizedTextarea label="Full Content" field="content" data={formData} onChange={updateLocalized} rows={8} />
        )}

        {/* ===== CATEGORY & SCOPE (all except fallback) ===== */}
        {!isFallback && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Primary Category</Label>
              <Select value={formData.categoryId || ''} onValueChange={(v) => updateField('categoryId', v)}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.icon} {c.name.en}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Municipality / Scope</Label>
              <Select value={formData.municipalityId || ''} onValueChange={(v) => updateField('municipalityId', v)}>
                <SelectTrigger><SelectValue placeholder="Select scope" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All (Finland-wide)</SelectItem>
                  {municipalities.map(m => (
                    <SelectItem key={m.id} value={m.id}>{m.name.en}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {isFallback && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={formData.categoryId || ''} onValueChange={(v) => updateField('categoryId', v)}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.icon} {c.name.en}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Municipality</Label>
              <Select value={formData.municipalityId || ''} onValueChange={(v) => updateField('municipalityId', v)}>
                <SelectTrigger><SelectValue placeholder="Select municipality" /></SelectTrigger>
                <SelectContent>
                  {municipalities.map(m => (
                    <SelectItem key={m.id} value={m.id}>{m.name.en}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* ===== SCENARIOS (step-like + articles) ===== */}
        {(isStepLike || isArticle) && (
          <div className="space-y-2">
            <Label className="text-base font-semibold">Recommended for Scenarios</Label>
            <div className="flex flex-wrap gap-3">
              {SCENARIO_OPTIONS.map(s => (
                <label key={s.value} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox
                    checked={scenariosList.includes(s.value)}
                    onCheckedChange={() => toggleScenario(s.value)}
                  />
                  {s.label}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* ===== BUNDLE-FIRST SETTINGS (for bundles and guide cards) ===== */}
        {isBundleType && (
          <div className="space-y-4 p-4 border rounded-md bg-accent/10">
            <h3 className="text-base font-semibold">Bundle Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Bundle Type</Label>
                <Select value={formData.bundleType || 'guide'} onValueChange={(v) => updateField('bundleType', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {BUNDLE_TYPES.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  "Onboarding" bundles appear on the scenario selection screen
                </p>
              </div>
              <div className="space-y-1.5">
                <Label>Legacy Scenario ID</Label>
                <Select value={formData.legacyScenarioId || ''} onValueChange={(v) => updateField('legacyScenarioId', v === 'none' ? null : v)}>
                  <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {SCENARIO_OPTIONS.map(s => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Maps this bundle to a legacy scenario for backward compatibility
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={formData.useInOnboarding === true}
                onCheckedChange={(v) => updateField('useInOnboarding', v)}
              />
              <div>
                <Label>Available in onboarding</Label>
                <p className="text-xs text-muted-foreground">Show this bundle on the scenario selection screen</p>
              </div>
            </div>
          </div>
        )}

        {/* ===== NEXT STEPS EXTENDED FIELDS ===== */}
        {isStepLike && (
          <div className="space-y-6 p-4 border rounded-md bg-muted/10">
            <h3 className="text-base font-semibold">Next Steps Settings</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Priority / Default Order</Label>
                <Input
                  type="number"
                  value={formData.priority ?? formData.defaultOrder ?? ''}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    updateField('priority', val);
                    updateField('defaultOrder', val);
                  }}
                  className="w-32"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Estimated Time</Label>
                <Input
                  value={formData.estimatedTime || ''}
                  onChange={(e) => updateField('estimatedTime', e.target.value)}
                  placeholder="e.g. 15 min, 1 hour"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.visibilityInLibrary !== false}
                  onCheckedChange={(v) => updateField('visibilityInLibrary', v)}
                />
                <Label>Visible in user library</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.isRecommendedByDefault !== false}
                  onCheckedChange={(v) => updateField('isRecommendedByDefault', v)}
                />
                <Label>Recommended by default</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.canBeAddedByUser !== false}
                  onCheckedChange={(v) => updateField('canBeAddedByUser', v)}
                />
                <Label>Can be added by user</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.canBeRemovedByUser !== false}
                  onCheckedChange={(v) => updateField('canBeRemovedByUser', v)}
                />
                <Label>Can be removed by user</Label>
              </div>
            </div>

            {/* Status Tags */}
            <div className="space-y-1.5">
              <Label>Status Tags (comma-separated)</Label>
              <Input
                value={(formData.statusTags || []).join(', ')}
                onChange={(e) => updateField('statusTags', e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))}
                placeholder="e.g. mandatory, recommended, optional"
              />
            </div>

            {/* Secondary Categories */}
            <div className="space-y-1.5">
              <Label>Secondary Categories</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map(c => (
                  <label key={c.id} className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <Checkbox
                      checked={(formData.secondaryCategories || []).includes(c.id)}
                      onCheckedChange={(checked) => {
                        const current: string[] = formData.secondaryCategories || [];
                        updateField('secondaryCategories', checked
                          ? [...current, c.id]
                          : current.filter((id: string) => id !== c.id)
                        );
                      }}
                    />
                    {c.icon} {c.name.en}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== OFFICIAL LINKS ===== */}
        {(isArticle || isStepLike) && (
          <div className="space-y-1.5">
            <Label>Official Links (JSON)</Label>
            <Textarea
              rows={4}
              className="font-mono text-xs"
              value={JSON.stringify(formData.officialLinks || [], null, 2)}
              onChange={(e) => {
                try { updateField('officialLinks', JSON.parse(e.target.value)); } catch { /* ignore */ }
              }}
            />
            <p className="text-xs text-muted-foreground">
              Format: {'[{"label": {"en": "...", "ru": "..."}, "url": "https://..."}]'}
            </p>
          </div>
        )}

        {/* ===== BUNDLE / GUIDE CARD COMPOSITION ===== */}
        {isBundleType && (
          <div className="space-y-4 p-4 border rounded-md bg-muted/10">
            <h3 className="text-base font-semibold">
              {isBundle ? 'Bundle Steps' : 'Guide Card Steps'}
            </h3>
            <p className="text-sm text-muted-foreground">
              Select and order the steps included in this {isBundle ? 'bundle' : 'guide card'}.
            </p>

            {loadingRelations ? (
              <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
            ) : (
              <>
                {/* Current children */}
                {childStepIds.length > 0 && (
                  <div className="space-y-1">
                    {childStepIds.map((stepId, index) => {
                      const step = availableSteps.find(s => s.id === stepId);
                      const title = step?.data?.title?.en || step?.data?.name?.en || stepId;
                      return (
                        <div key={stepId} className="flex items-center gap-2 p-2 border rounded bg-background">
                          <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-xs font-mono text-muted-foreground w-6">{index + 1}</span>
                          <span className="flex-1 text-sm truncate">{title}</span>
                          <Badge variant="outline" className="text-xs shrink-0">
                            {step?.content_type || '?'}
                          </Badge>
                          <div className="flex gap-1 shrink-0">
                            <Button variant="ghost" size="icon" className="h-6 w-6" disabled={index === 0} onClick={() => moveChildStep(index, 'up')}>↑</Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6" disabled={index === childStepIds.length - 1} onClick={() => moveChildStep(index, 'down')}>↓</Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeChildStep(stepId)}>
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Add step selector */}
                {availableSteps.filter(s => !childStepIds.includes(s.id)).length > 0 && (
                  <div className="space-y-1.5">
                    <Label className="text-sm">Add step</Label>
                    <Select onValueChange={(v) => addChildStep(v)}>
                      <SelectTrigger><SelectValue placeholder="Select a step to add..." /></SelectTrigger>
                      <SelectContent>
                        {availableSteps
                          .filter(s => !childStepIds.includes(s.id))
                          .map(s => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.data?.title?.en || s.data?.name?.en || s.id}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ===== ACTION ITEMS ===== */}
        {(isStep || isGuideCard) && (
          <div className="space-y-1.5">
            <Label>Action Items (JSON)</Label>
            <Textarea
              rows={4}
              className="font-mono text-xs"
              value={JSON.stringify(formData.actionItems || [], null, 2)}
              onChange={(e) => {
                try { updateField('actionItems', JSON.parse(e.target.value)); } catch { /* ignore */ }
              }}
            />
            <p className="text-xs text-muted-foreground">
              Format: {'[{"en": "Do this first", "ru": "Сделайте это первым"}]'}
            </p>
          </div>
        )}

        {/* ===== SAVE ===== */}
        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
            {isNew ? 'Create item' : 'Save changes'}
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/content')}>Cancel</Button>
        </div>
      </div>
    </AdminLayout>
  );
}

// --- Reusable localized field components ---

function LocalizedField({
  label, field, data, onChange,
}: {
  label: string;
  field: string;
  data: ContentData;
  onChange: (field: string, lang: string, value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">{label}</Label>
      <div className="space-y-2">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">English</Label>
          <Input value={data[field]?.en || ''} onChange={(e) => onChange(field, 'en', e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Russian</Label>
          <Input value={data[field]?.ru || ''} onChange={(e) => onChange(field, 'ru', e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Finnish</Label>
          <Input value={data[field]?.fi || ''} onChange={(e) => onChange(field, 'fi', e.target.value)} />
        </div>
      </div>
    </div>
  );
}

function LocalizedTextarea({
  label, field, data, onChange, rows = 4,
}: {
  label: string;
  field: string;
  data: ContentData;
  onChange: (field: string, lang: string, value: string) => void;
  rows?: number;
}) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">{label}</Label>
      <div className="space-y-2">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">English</Label>
          <Textarea rows={rows} value={data[field]?.en || ''} onChange={(e) => onChange(field, 'en', e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Russian</Label>
          <Textarea rows={rows} value={data[field]?.ru || ''} onChange={(e) => onChange(field, 'ru', e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Finnish</Label>
          <Textarea rows={rows} value={data[field]?.fi || ''} onChange={(e) => onChange(field, 'fi', e.target.value)} />
        </div>
      </div>
    </div>
  );
}
