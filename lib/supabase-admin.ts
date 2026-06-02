import { randomBytes } from 'node:crypto';
import { createSupabaseBrowserClient, createSupabaseServiceClient } from './supabase';

type SyncSupabaseAdminUserParams = {
  email: string;
  previousEmail?: string;
  password?: string;
  name?: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function findSupabaseUserByEmail(email: string) {
  const supabase = createSupabaseServiceClient();
  const targetEmail = normalizeEmail(email);
  const perPage = 100;
  let page = 1;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });

    if (error) {
      throw error;
    }

    const user = data.users.find((item) => normalizeEmail(item.email || '') === targetEmail);

    if (user) {
      return user;
    }

    if (data.users.length < perPage) {
      return null;
    }

    page += 1;
  }
}

export async function syncSupabaseAdminUser({ email, previousEmail, password, name }: SyncSupabaseAdminUserParams) {
  const supabase = createSupabaseServiceClient();
  const desiredEmail = normalizeEmail(email);
  const lookupEmail = previousEmail ? normalizeEmail(previousEmail) : desiredEmail;
  const existingUser = await findSupabaseUserByEmail(lookupEmail);
  const fallbackPassword = password || randomBytes(16).toString('hex');

  if (existingUser) {
    const { error } = await supabase.auth.admin.updateUserById(existingUser.id, {
      email: desiredEmail,
      email_confirm: true,
      ...(password ? { password } : {}),
      user_metadata: {
        name: name || existingUser.user_metadata?.name || '',
      },
    });

    if (error) {
      throw error;
    }

    return existingUser.id;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: desiredEmail,
    password: fallbackPassword,
    email_confirm: true,
    user_metadata: {
      name: name || '',
    },
  });

  if (error) {
    throw error;
  }

  return data.user.id;
}

export async function ensureSupabaseAdminForReset(email: string, name?: string | null) {
  await syncSupabaseAdminUser({
    email,
    name: name || undefined,
  });
}

export async function sendSupabaseRecoveryEmail(email: string, redirectTo: string) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    throw error;
  }
}
