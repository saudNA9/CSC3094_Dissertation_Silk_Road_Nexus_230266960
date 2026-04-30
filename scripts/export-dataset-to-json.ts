import fs from "fs";
import path from "path";

import {
  SILK_ROAD_ENTITIES,
  SILK_ROAD_ROUTES,
  SILK_ROAD_RELATIONSHIPS,
  SILK_ROAD_CENTURY_NOTES,
  DATASET_STATS,
} from "../lib/silk-road-data";

const output = {
  metadata: DATASET_STATS,
  entities: SILK_ROAD_ENTITIES,
  routes: SILK_ROAD_ROUTES,
  relationships: SILK_ROAD_RELATIONSHIPS,
  centuryNotes: SILK_ROAD_CENTURY_NOTES,
};

const outPath = path.join(process.cwd(), "data", "silk-road-data.json");

fs.writeFileSync(outPath, JSON.stringify(output, null, 2), "utf-8");

console.log("Dataset exported to:", outPath);
console.log("Entities:", SILK_ROAD_ENTITIES.length);
console.log("Routes:", SILK_ROAD_ROUTES.length);
console.log("Relationships:", SILK_ROAD_RELATIONSHIPS.length);
console.log("Century notes:", SILK_ROAD_CENTURY_NOTES.length);