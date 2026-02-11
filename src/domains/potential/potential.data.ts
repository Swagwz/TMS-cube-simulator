import rawPotentialRegistry from "@/data/data-weight/potential_registry.json";
import rawNormal from "@/data/data-weight/normal.json";
import rawOther from "@/data/data-weight/other.json";
import rawAdditional from "@/data/data-weight/additional.json";

import type {
  PotentialMetadata,
  PotentialRegistry,
  PotentialWeightRegistry,
} from "./potential.type";

export const POTENTIAL_REGISTRY = rawPotentialRegistry as PotentialRegistry;
export const NORMAL_JSON = rawNormal as PotentialWeightRegistry;
export const OTHER_JSON = rawOther as PotentialWeightRegistry;
export const ADDITIONAL_JSON = rawAdditional as PotentialWeightRegistry;

export const POTENTIAL_METADATA_MAP = new Map<string, PotentialMetadata>();

function registerPotential(registry: PotentialRegistry) {
  for (const [name, entry] of Object.entries(registry)) {
    const { main, additional, template, field, limit } = entry;
    const items = [...main, ...additional];

    items.forEach((item) => {
      POTENTIAL_METADATA_MAP.set(item.id, {
        ...item,
        name,
        template,
        field,
        limit,
      });
    });
  }
}

registerPotential(POTENTIAL_REGISTRY);
