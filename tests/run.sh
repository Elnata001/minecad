#!/bin/bash
# Roda todas as suítes Playwright contra o index.html deste repositório.
#
# As suítes foram escritas contra caminhos absolutos da máquina onde o MineCAD
# é desenvolvido. Em vez de reescrever as 120 suítes, o preparo abaixo recria
# esses caminhos — assim o que roda aqui é byte a byte o que roda lá.
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP=/mnt/user-data/outputs/minecad.html

prepare(){
  sudo mkdir -p /mnt/user-data/outputs 2>/dev/null || mkdir -p /mnt/user-data/outputs
  sudo chown -R "$(id -u)":"$(id -g)" /mnt/user-data 2>/dev/null || true
  cp "$ROOT/index.html" "$APP"
  cp "$ROOT/tests/three-shim.js" /tmp/three-shim.js
  cp "$ROOT"/tests/fixtures/* /tmp/
  mkdir -p /tmp/w && node "$ROOT/tools/mkworld.js" >/dev/null
}
prepare

# MINECAD_ONLY="pwTrap pwVis" roda só as suítes citadas
fail=0; ran=0
for f in "$ROOT"/tests/pw*.js; do
  n=$(basename "$f")
  if [ -n "${MINECAD_ONLY:-}" ]; then
    case " $MINECAD_ONLY " in *" ${n%.js} "*) ;; *) continue;; esac
  fi
  grep -qx "$n" "$ROOT/tests/skip.txt" && { echo "— $n (ignorada: suíte antiga, API mudou)"; continue; }
  out=$(timeout 180 node "$f" 2>&1); rc=$?
  ran=$((ran+1))
  if [ $rc -ne 0 ] || echo "$out" | grep -qE "^ERRO |pageerror|FALHOU"; then
    fail=$((fail+1)); echo "✗ $n"
    echo "$out" | grep -iE "ERRO |Error:|FALHOU|Cannot " | head -5 | sed 's/^/    /'
  else
    echo "✓ $n"
  fi
done
echo "—— $ran suíte(s), $fail com falha ——"
exit $(( fail > 0 ))
