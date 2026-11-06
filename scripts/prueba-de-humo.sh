#!/usr/bin/env bash
# Prueba de humo del despliegue: espera a que /salud informe el commit esperado.
# Variables: URL_PRODUCCION (dirección pública, sin barra final), COMMIT_ESPERADO (SHA completo),
#            INTENTOS (opcional, por defecto 36) y PAUSA (segundos, opcional, por defecto 10).
set -uo pipefail

: "${URL_PRODUCCION:?Falta URL_PRODUCCION}"
: "${COMMIT_ESPERADO:?Falta COMMIT_ESPERADO}"
intentos="${INTENTOS:-36}"
pausa="${PAUSA:-10}"

for intento in $(seq 1 "$intentos"); do
  respuesta=$(curl --silent --max-time 20 "$URL_PRODUCCION/salud" || true)
  commit=$(printf '%s' "$respuesta" | jq -r '.commit // empty' 2>/dev/null || true)
  echo "Intento $intento de $intentos: commit en producción = ${commit:-sin respuesta}"
  if [ "$commit" = "$COMMIT_ESPERADO" ]; then
    echo "Despliegue verificado: producción sirve el commit $COMMIT_ESPERADO"
    exit 0
  fi
  sleep "$pausa"
done

echo "El despliegue no se pudo verificar: producción no sirve el commit esperado." >&2
exit 1
