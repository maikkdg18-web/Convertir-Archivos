-- Programa la limpieza automática de archivos viejos del bucket "conversions"
-- (usuarios no tienen cuenta, así que los archivos no tienen dueño que los borre).
--
-- Requiere que existan dos secretos en Vault (Project Settings > Vault),
-- creados UNA sola vez después de desplegar, con el project URL y el anon key
-- reales del proyecto (ver README, sección "Limpieza automática de archivos"):
--
--   select vault.create_secret('https://<project-ref>.supabase.co', 'project_url');
--   select vault.create_secret('<tu-anon-key>', 'anon_key');
--
-- Sin esos secretos, el cron se crea igual pero las llamadas fallarán hasta
-- que se agreguen.

create extension if not exists pg_cron;
create extension if not exists pg_net;

select
  cron.schedule(
    'cleanup-old-files-hourly',
    '0 * * * *', -- cada hora, en punto
    $$
    select
      net.http_post(
        url := (select decrypted_secret from vault.decrypted_secrets where name = 'project_url')
          || '/functions/v1/cleanup-old-files',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'anon_key')
        ),
        body := '{}'::jsonb
      );
    $$
  );
