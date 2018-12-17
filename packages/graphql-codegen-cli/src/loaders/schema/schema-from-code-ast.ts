import { DocumentNode, parse } from 'graphql';
import { Types } from 'graphql-codegen-core';
import { SchemaLoader } from './schema-loader';
import isGlob = require('is-glob');
import glob = require('glob');
const gqlPluck = require('graphql-tag-pluck-temp');
import isValidPath = require('is-valid-path');

export interface SchemaFromCodeFileOptions {
  asAst?: boolean;
}

export class SchemaFromCodeAst implements SchemaLoader<SchemaFromCodeFileOptions> {
  canHandle(pointerToSchema: string, schemaOptions: SchemaFromCodeFileOptions): boolean {
    if (schemaOptions.asAst) {
      return isValidPath(pointerToSchema) || isGlob(pointerToSchema);
    }

    return false;
  }

  async handle(file: string, config: Types.Config, schemaOptions: any): Promise<DocumentNode> {
    const files = isValidPath(file) ? [file] : glob.sync(file);
    const allFoundAst = files
      .map(path => gqlPluck.fromFile.sync(path) || null)
      .filter(a => a)
      .join('\n');

    return parse(allFoundAst);
  }
}
