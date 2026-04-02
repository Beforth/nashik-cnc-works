import type { LucideIcon } from 'lucide-react';
import {
  Wrench,
  Cog,
  Settings,
  Factory,
  Cpu,
  Layers,
  Zap,
  Car,
  Building2,
  ClipboardCheck,
  Construction,
  Dna,
} from 'lucide-react';

const MAP: Record<string, LucideIcon> = {
  Wrench,
  Cog,
  Settings,
  Factory,
  Cpu,
  Layers,
  Zap,
  Car,
  Building2,
  ClipboardCheck,
  Construction,
  Dna,
};

export const SERVICE_ICON_OPTIONS = Object.keys(MAP).sort() as readonly string[];

export function getServiceIcon(key: string): LucideIcon {
  return MAP[key] ?? Wrench;
}
