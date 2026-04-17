'use client';

import { getServiceIcon, SERVICE_ICON_OPTIONS } from '@/src/lib/service-icons';
import { cn } from '@/src/lib/utils';

type AdminIconKeyFieldProps = {
  iconKey: string;
  onChange: (key: string) => void;
  editable: boolean;
  fallback: string;
  /** Omit preview when another column already shows the icon (e.g. Industries table). */
  showPreview?: boolean;
  selectClassName?: string;
};

export function AdminIconKeyField({
  iconKey,
  onChange,
  editable,
  fallback,
  showPreview = true,
  selectClassName,
}: AdminIconKeyFieldProps) {
  const raw = iconKey?.trim() || fallback;
  const IconComp = getServiceIcon(raw);
  const selectValue = SERVICE_ICON_OPTIONS.includes(raw) ? raw : fallback;

  const selectEl = (
    <select
      value={selectValue}
      onChange={(e) => onChange(e.target.value)}
      disabled={!editable}
      aria-label="Icon"
      className={cn(
        'w-full min-w-0 rounded-lg border border-border-grey bg-white px-2 py-2 text-sm font-semibold text-navy focus:border-machine-orange focus:outline-none focus:ring-1 focus:ring-machine-orange/30',
        !editable && 'cursor-default border-transparent bg-transparent text-navy',
        selectClassName,
      )}
    >
      {SERVICE_ICON_OPTIONS.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );

  if (!showPreview) {
    if (!editable) {
      return <span className="font-mono text-xs text-navy">{raw}</span>;
    }
    return selectEl;
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border-grey bg-machine-orange/10 text-machine-orange"
        title={`iconKey: ${raw}`}
      >
        <IconComp size={22} className="shrink-0" aria-hidden />
        <span className="sr-only">Icon for {raw}</span>
      </span>
      {editable ? (
        selectEl
      ) : (
        <span className="min-w-0 flex-1 font-mono text-sm text-navy">{raw}</span>
      )}
    </div>
  );
}
