import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import type { Dataset } from '../types';
import { apiFetch } from '../services/api';

type LocationState = {
  dataset?: Dataset;
};

function normalizeUrlList(raw: any): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map(x => String(x).trim()).filter(Boolean);
  }
  if (typeof raw === 'string') return splitUrls(raw);
  return [String(raw).trim()].filter(Boolean);
}

function splitUrls(raw: unknown): string[] {
  if (!raw || typeof raw !== 'string') return [];
  const s = raw.trim();
  if (!s || s === 'N/A') return [];
  // Common separators: semicolon, comma, newline
  const parts = s.split(/[;\n,]+/).map(x => x.trim()).filter(Boolean);
  return parts.length ? parts : [s];
}

function formatValue(v: any): React.ReactNode {
  if (v === null || v === undefined) return <span className="text-gray-400">N/A</span>;
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  if (Array.isArray(v)) {
    if (v.length === 0) return <span className="text-gray-400">[]</span>;
    return (
      <ul className="list-disc pl-5 space-y-1">
        {v.map((x, i) => (
          <li key={i} className="break-words">
            {typeof x === 'string' && (x.startsWith('http://') || x.startsWith('https://')) ? (
              <a className="text-blue-600 hover:underline" href={x} target="_blank" rel="noreferrer">
                {x}
              </a>
            ) : (
              <span>{String(x)}</span>
            )}
          </li>
        ))}
      </ul>
    );
  }
  if (typeof v === 'object') {
    return (
      <pre className="bg-slate-50 border border-slate-200 rounded p-3 overflow-auto text-xs text-slate-700 whitespace-pre-wrap break-words">
        {JSON.stringify(v, null, 2)}
      </pre>
    );
  }
  return <span className="break-words">{String(v)}</span>;
}

export const DatasetDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;

  const [dataset, setDataset] = useState<Dataset | null>(state.dataset ?? null);
  const [loading, setLoading] = useState<boolean>(!state.dataset);
  const [error, setError] = useState<string | null>(null);

  // If we navigated with state but the param doesn't match, refetch.
  useEffect(() => {
    const param = (id ?? '').trim();
    if (!param) return;
    if (state.dataset && String(state.dataset.id) === param) return;

    setLoading(true);
    setError(null);
    apiFetch(`/dataset/${encodeURIComponent(param)}`)
      .then(async (resp) => {
        if (!resp.ok) {
          const txt = await resp.text().catch(() => '');
          throw new Error(`Failed to load dataset (${resp.status}). ${txt}`);
        }
        return resp.json();
      })
      .then((data) => {
        setDataset(data as Dataset);
      })
      .catch((e) => {
        console.error(e);
        setError('Failed to load dataset details. Please check backend.');
        setDataset(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const entries = useMemo(() => {
    if (!dataset) return [];
    const hiddenKeys = new Set([
      'year_start',
      'year_end',
      'country',
      'Other_Information',
      'year_bucket',
      'id',
      'ref',
      'original_id',
    ]);

    const preferredOrder = [
      'Data_Name',
      'Data_summary',
      'Category',
      'Sub_Category',
      'Matched_URLs',
      'Time_Coverage',
      'Geographic_Coverage',
      'Need_Author_Contact',
      'URL',
      'paper_url',
    ];

    const seen = new Set<string>();
    const ordered: [string, any][] = [];
    for (const k of preferredOrder) {
      if (Object.prototype.hasOwnProperty.call(dataset, k)) {
        if (!hiddenKeys.has(k)) ordered.push([k, (dataset as any)[k]]);
        seen.add(k);
      }
    }
    const rest = Object.entries(dataset)
      .filter(([k]) => !seen.has(k) && !hiddenKeys.has(k))
      .sort(([a], [b]) => a.localeCompare(b));
    return [...ordered, ...rest];
  }, [dataset]);

  const urlList = useMemo(() => splitUrls(dataset?.URL), [dataset?.URL]);
  const matchedUrlList = useMemo(() => normalizeUrlList((dataset as any)?.Matched_URLs), [dataset]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <Link to="/" className="text-sm text-blue-600 hover:underline">
            Return to Explorer
          </Link>
        </div>

        {loading ? (
          <div className="text-slate-600">Loading dataset details…</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : !dataset ? (
          <div className="text-slate-600">Dataset not found.</div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-2xl font-bold text-slate-900 break-words">
                    {dataset.Data_Name || 'Untitled Dataset'}
                  </h1>
                  {dataset.Data_summary && (
                    <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                      {dataset.Data_summary}
                    </p>
                  )}
                </div>

                {urlList.length > 0 && (
                  <a
                    href={urlList[0]}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
                    title="Open dataset URL"
                  >
                    Open URL
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>

            <div className="p-6">
              {matchedUrlList.length > 0 && (
                <div className="mb-6">
                  <div className="text-sm font-semibold text-slate-800 mb-2">Matched URLs</div>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {matchedUrlList.map((u) => (
                      <li key={u} className="break-words">
                        <a className="text-blue-600 hover:underline" href={u} target="_blank" rel="noreferrer">
                          {u}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {urlList.length > 1 && (
                <div className="mb-6">
                  <div className="text-sm font-semibold text-slate-800 mb-2">URLs</div>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {urlList.map((u) => (
                      <li key={u} className="break-words">
                        <a className="text-blue-600 hover:underline" href={u} target="_blank" rel="noreferrer">
                          {u}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {entries.map(([k, v]) => (
                  <div key={k} className="border border-slate-200 rounded-md p-4">
                    <div className="text-xs font-semibold text-slate-700 mb-2 break-words">{k}</div>
                    <div className="text-sm text-slate-800">{formatValue(v)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


