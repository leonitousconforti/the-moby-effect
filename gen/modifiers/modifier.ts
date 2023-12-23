import type { ISchemaDefinition } from "../types.js";

export type Modifier = (definition: ISchemaDefinition, existingType: string) => string;
