-- Explicitly remove Supabase client-role EXECUTE grants from the platform-only RPCs.
-- Supabase may grant function execution to API roles independently of PUBLIC,
-- so fail closed for both client roles and keep only service_role access.
revoke execute on function public.record_operational_signal(text, text, text, text, integer, text) from anon;
revoke execute on function public.record_operational_signal(text, text, text, text, integer, text) from authenticated;
revoke execute on function public.purge_expired_operational_signals() from anon;
revoke execute on function public.purge_expired_operational_signals() from authenticated;
