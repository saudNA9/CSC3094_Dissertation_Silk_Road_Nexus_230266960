/**
 * silk-road-data.ts
 * Silk Road Nexus — Curated Dataset v1.0
 * Creator: Saud Najem S Alnajem (230266960)
 * Newcastle University, CSC3094 Final Year Project
 * Supervisor: Dr Rouaa Yassin Kassab | Published: March 2026
 * DOI: https://doi.org/10.5281/zenodo.19684922
 * License: CC BY-NC 4.0
 */

// ─── Types ──────────────────────────────────────────────────────────────────

import dataset from "@/data/silk-road-data.json";

export type EntityType =
  | "City"
  | "Route"
  | "Person"
  | "Good"
  | "Event"
  | "Inscription";

export type Region = string;

export type Importance = "Major" | "Regional" | "Minor";

export type CityRole =
  | "Trade Hub"
  | "Religious Centre"
  | "Political Capital"
  | "Port City"
  | "Oasis Town"
  | "Cultural Centre"
  | "Military Outpost";

export type RelationshipType =
  | "visited"
  | "traded_via"
  | "established"
  | "connects"
  | "occurred_at"
  | "part_of";

export interface SilkRoadEntity {
  id: string;
  name: string;
  type: EntityType;
  region: Region;
  lat: number;
  lng: number;
  startYear: number;
  endYear: number;
  description: string;
  importance: Importance;
  source: string;
  relatedEntities?: string[];
  relatedGoods?: string[];
  relatedEvents?: string[];
  roles?: CityRole[];
  centuryNotes?: Record<string, string>;
  heroImage?: string;
  facts?: Record<string, string>;
}

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: RelationshipType;
  historicalContext: string;
  source: string;
}

export interface RouteSegment {
  id: string;
  name: string;
  type: "primary" | "secondary";
  routeKind: "land" | "maritime";
  coordinates: [number, number][];
  startYear: number;
  endYear: number;
  description: string;
  primaryCommodities: string[];
  source: string;
}

export interface CenturyNote {
  noteId: string;
  entityId: string;
  entityName: string;
  centuryRange: string;
  note: string;
  source: string;
}

export const SILK_ROAD_ENTITIES = dataset.entities as SilkRoadEntity[];
export const SILK_ROAD_ROUTES = dataset.routes as RouteSegment[];
export const SILK_ROAD_RELATIONSHIPS = dataset.relationships as Relationship[];
export const SILK_ROAD_CENTURY_NOTES = dataset.centuryNotes as CenturyNote[];
export const DATASET_STATS = dataset.metadata;

export const ISTANBUL_CENTER: [number, number] = [28.98, 41.01];

export const CITIES = SILK_ROAD_ENTITIES.filter(e => e.type === "City");
export const EVENTS = SILK_ROAD_ENTITIES.filter(e => e.type === "Event");
export const GOODS = SILK_ROAD_ENTITIES.filter(e => e.type === "Good");
export const PERSONS = SILK_ROAD_ENTITIES.filter(e => e.type === "Person");
export const INSCRIPTIONS = SILK_ROAD_ENTITIES.filter(e => e.type === "Inscription");

export const ALL_ENTITIES = SILK_ROAD_ENTITIES;
export const ROUTES = SILK_ROAD_ROUTES;

export function getEntityById(id: string): SilkRoadEntity | undefined {
  return SILK_ROAD_ENTITIES.find(e => e.id === id);
}

export function getEntitiesByType(type: EntityType): SilkRoadEntity[] {
  return SILK_ROAD_ENTITIES.filter(e => e.type === type);
}

export function getEntitiesForCentury(year: number): SilkRoadEntity[] {
  const centuryStart = Math.floor(year / 100) * 100;
  const centuryEnd = centuryStart + 99;

  return SILK_ROAD_ENTITIES.filter(
    e => e.startYear <= centuryEnd && e.endYear >= centuryStart
  );
}

export function getRoutesForCentury(year: number): RouteSegment[] {
  const centuryStart = Math.floor(year / 100) * 100;
  const centuryEnd = centuryStart + 99;

  return SILK_ROAD_ROUTES.filter(
    r => r.startYear <= centuryEnd && r.endYear >= centuryStart
  );
}

export function getRelationshipsForEntity(entityId: string): Relationship[] {
  return SILK_ROAD_RELATIONSHIPS.filter(
    r => r.sourceId === entityId || r.targetId === entityId
  );
}

export function getCenturyNotesForEntity(entityId: string): CenturyNote[] {
  return SILK_ROAD_CENTURY_NOTES.filter(n => n.entityId === entityId);
}

export function getCenturyNoteForYear(
  entityId: string,
  year: number
): string | undefined {
  const centuryStart = Math.floor(year / 100) * 100;
  const centuryEnd = centuryStart + 99;

  const entity = getEntityById(entityId);
  if (!entity?.centuryNotes) return undefined;

  const key = Object.keys(entity.centuryNotes).find(k => {
    const parts = k.split(" to ").map(Number);
    return parts[0] <= centuryEnd && parts[1] >= centuryStart;
  });

  return key ? entity.centuryNotes[key] : undefined;
}

export function generateGraphData(entities: SilkRoadEntity[]) {
  const entityIds = new Set(entities.map(e => e.id));

  const nodes = entities.map(e => ({
    id: e.id,
    name: e.name,
    type: e.type,
    importance: e.importance,
  }));

  const links = SILK_ROAD_RELATIONSHIPS
    .filter(r => entityIds.has(r.sourceId) && entityIds.has(r.targetId))
    .map(r => ({
      source: r.sourceId,
      target: r.targetId,
      type: r.type,
    }));

  return { nodes, links };
}

export function getCenturyWindow(year: number): {
  start: number;
  end: number;
  label: string;
} {
  const centuryStart = Math.floor(year / 100) * 100;
  const centuryEnd = centuryStart + 99;
  const centuryNumber = Math.floor(centuryStart / 100) + 1;

  const suffix =
    centuryNumber === 1
      ? "st"
      : centuryNumber === 2
        ? "nd"
        : centuryNumber === 3
          ? "rd"
          : "th";

  return {
    start: centuryStart,
    end: centuryEnd,
    label: `${centuryStart}–${centuryEnd} (${centuryNumber}${suffix} Century)`,
  };
}

export function getCenturyKey(year: number): string {
  const centuryStart = Math.floor(year / 100) * 100;
  const centuryEnd = centuryStart + 99;
  return `${centuryStart}-${centuryEnd}`;
}

export function searchEntities(query: string): SilkRoadEntity[] {
  if (!query || query.trim().length < 2) return [];

  const q = query.toLowerCase().trim();
  const terms = q.split(/\s+/);

  const scored: { entity: SilkRoadEntity; score: number }[] = [];

  SILK_ROAD_ENTITIES.forEach(entity => {
    let score = 0;

    const name = entity.name.toLowerCase();
    const desc = entity.description.toLowerCase();
    const region = entity.region.toLowerCase();
    const type = entity.type.toLowerCase();

    terms.forEach(term => {
      if (name.includes(term)) score += 10;
      if (name.startsWith(term)) score += 5;
      if (type === term) score += 6;
      if (region.includes(term)) score += 4;
      if (desc.includes(term)) score += 2;
      if (entity.relatedGoods?.some(g => g.toLowerCase().includes(term))) score += 5;
      if (entity.relatedEvents?.some(e => e.toLowerCase().includes(term))) score += 4;
      if (entity.roles?.some(r => r.toLowerCase().includes(term))) score += 4;
      if (entity.source?.toLowerCase().includes(term)) score += 2;
    });

    if (score > 0) scored.push({ entity, score });
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .map(s => s.entity);
}