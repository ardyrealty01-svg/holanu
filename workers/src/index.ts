/**
 * HOLANU — Cloudflare Workers API
 * Entry point: routes semua request ke handler yang tepat
 */

import { handleListings }   from './routes/listings';
import { handleUsers }      from './routes/users';
import { handleLeads }      from './routes/leads';
import { handleInquiries }  from './routes/inquiries';
import { handleUpload }     from './routes/upload';
import { handleAdmin }      from './routes/admin';
import { corsHeaders, errorResponse } from './utils';

export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
  CORS_ORIGIN: string;
  CLERK_SECRET_KEY?: string;
  IMAGEKIT_PUBLIC_KEY?: string;
  IMAGEKIT_PRIVATE_KEY?: string;
  IMAGEKIT_URL_ENDPOINT?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url    = new URL(request.url);
    const path   = url.pathname;
    const method = request.method;

    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(env, request) });
    }

    if (path === '/health') {
      return Response.json(
        { status: 'ok', env: env.ENVIRONMENT, ts: new Date().toISOString() },
        { headers: corsHeaders(env, request) }
      );
    }

    try {
      if (path.startsWith('/api/listings'))   return handleListings(request, env, url);
      if (path.startsWith('/api/users'))      return handleUsers(request, env, url);
      if (path.startsWith('/api/leads'))      return handleLeads(request, env, url);
      if (path.startsWith('/api/inquiries'))  return handleInquiries(request, env, url);
      if (path.startsWith('/api/upload'))     return handleUpload(request, env, url);
      if (path.startsWith('/api/admin'))      return handleAdmin(request, env, url);

      return errorResponse('Route not found', 404, env, request);
    } catch (err: any) {
      console.error('Worker error:', err);
      return errorResponse(err.message ?? 'Internal server error', 500, env, request);
    }
  },
};
