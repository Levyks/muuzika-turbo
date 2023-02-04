import { json } from '@sveltejs/kit';
import { PrismaClient } from 'database';
import path from 'path';

import { fileURLToPath } from 'url';

/** @type {import('./$types').RequestHandler} */
export function GET({ url }) {
  global.__dirname = path.dirname(fileURLToPath(import.meta.url));

  console.log('prisma', PrismaClient);

  return json({ url });
}
