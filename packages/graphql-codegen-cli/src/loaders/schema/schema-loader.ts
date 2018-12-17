import { GraphQLSchema, DocumentNode } from 'graphql';
import { Types } from 'graphql-codegen-core';

export interface SchemaLoader<T = any> {
  canHandle(pointerToSchema: string, schemaOptions?: T): Promise<boolean> | boolean;
  handle(
    pointerToSchema: string,
    config: Types.Config,
    schemaOptions: T
  ): Promise<DocumentNode | GraphQLSchema> | DocumentNode | GraphQLSchema;
}
