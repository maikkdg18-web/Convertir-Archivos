-- Bucket público para archivos subidos y resultados de conversión.
-- Los archivos se limpian periódicamente (ver función de limpieza futura).
insert into storage.buckets (id, name, public)
values ('conversions', 'conversions', true)
on conflict (id) do nothing;

-- Política: cualquiera puede subir y leer (MVP sin auth).
-- TODO: restringir cuando se agregue autenticación de usuarios.
create policy "Cualquiera puede subir archivos"
  on storage.objects for insert
  with check (bucket_id = 'conversions');

create policy "Cualquiera puede leer archivos"
  on storage.objects for select
  using (bucket_id = 'conversions');
