import type OpenApi from "openapi-types";

export interface ISchemaDefinition extends OpenApi.OpenAPIV2.SchemaObject {
    name: string;
    parent?: ISchemaDefinition | undefined;
}
