import { ISchemaDefinition } from "../types.js";

export const descriptionModifier = (definition: ISchemaDefinition) =>
    definition.description
        ? `
        /**
         * ${definition.description}
         */
        `
        : "";
