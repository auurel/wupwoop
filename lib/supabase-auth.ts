import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function assertConfigured(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
}

export function getSupabaseBrowserClient() {
  return createClient(
    assertConfigured(supabaseUrl, 'NEXT_PUBLIC_SUPABASE_URL'),
    assertConfigured(supabaseAnonKey, 'NEXT_PUBLIC_SUPABASE_ANON_KEY')
  );
}

export function getSupabaseAnonServerClient() {
  return createClient(
    assertConfigured(supabaseUrl, 'NEXT_PUBLIC_SUPABASE_URL'),
    assertConfigured(supabaseAnonKey, 'NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

export function getSupabaseServiceClient() {
  return createClient(
    assertConfigured(supabaseUrl, 'NEXT_PUBLIC_SUPABASE_URL'),
    assertConfigured(supabaseServiceRoleKey, 'SUPABASE_SERVICE_ROLE_KEY'),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

async function getAuthUserByEmail(client: SupabaseClient, email: string) {
  const targetEmail = email.trim().toLowerCase();
  const perPage = 100;
  let page = 1;

  while (true) {
    const { data, error } = await client.auth.admin.listUsers({ page, perPage });

    if (error) {
      throw error;
    }

    const user = data.users.find((item) => (item.email || '').trim().toLowerCase() === targetEmail);

    if (user) {
      return user;
    }

    if (data.users.length < perPage) {
      return null;
    }

    page += 1;
  }
}

export async function syncSupabaseAdminUser(params: {
  email: string;
  name?: string;
  password?: string;
  createIfMissing?: boolean;
}) {
  const client = getSupabaseServiceClient();
  const email = params.email.trim().toLowerCase();
  const existingUser = await getAuthUserByEmail(client, email);

  if (!existingUser && !params.createIfMissing) {
    return null;
  }

  if (existingUser) {
    const updates: Record<string, unknown> = {};

    if (params.password) {
      updates.password = params.password;
    }

    if (params.name) {
      updates.user_metadata = {
        ...(existingUser.user_metadata || {}),
        name: params.name,
      };
    }

    const { data, error } = await client.auth.admin.updateUserById(existingUser.id, updates);

    if (error) {
      throw error;
    }

    return data.user;
  }

  const { data, error } = await client.auth.admin.createUser({
    email,
    password: params.password || `Temp-${Math.random().toString(36).slice(2)}-${Date.now()}`,
    email_confirm: true,
    user_metadata: params.name ? { name: params.name } : undefined,
  });

  if (error) {
    throw error;
  }

  return data.user;
}

export async function sendSupabaseResetPasswordEmail(email: string, redirectTo: string) {
  const client = getSupabaseAnonServerClient();
  const { error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    throw error;
  }
}