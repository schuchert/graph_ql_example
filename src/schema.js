import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { buildSchema } from 'graphql';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const schemaString = readFileSync(
  join(__dirname, 'schema.graphql'),
  'utf-8'
);

export const schema = buildSchema(schemaString);

