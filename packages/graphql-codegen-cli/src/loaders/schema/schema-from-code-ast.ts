import { DocumentNode, concatAST, parse } from 'graphql';
import { Types } from 'graphql-codegen-core';
import { SchemaLoader } from './schema-loader';
import gqlPluck from 'graphql-tag-pluck';
import isGlob = require('is-glob');
import glob = require('glob');

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
    const foundAst = files
      .map(path => gqlPluck.fromFile.sync(path) || null)
      .filter(a => a)
      .map(str => parse(str));

    if (foundAst.length === 0) {
      return null;
    } else {
      return concatAST(foundAst);
    }
  }
}
