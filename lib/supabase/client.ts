import { createClient as createSupabaseClient } from '@supabase/supabase-js';

let clientInstance: ReturnType<typeof createSupabaseClient> | null = null;

/**
 * عميل Supabase للمتصفح مع تخزين الجلسة في LocalStorage حصراً
 * هذا يمنع تماماً تراكم ملفات الكوكيز في الهيدر ويمنع أخطاء 400 على Netlify و 494 على Vercel
 */
export function createClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://opezychzfccccnbitwgr.supabase.co';
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    'sb_publishable_OXdfm7dowG3JVvNy56sc5g_tKRtSSuA';

  if (!clientInstance) {
    clientInstance = createSupabaseClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'mueen_auth_session',
      },
    });
  }

  return clientInstance;
}
