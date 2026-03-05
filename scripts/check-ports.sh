#!/usr/bin/env bash
# 检查 art_backend 各服务端口是否在监听
# 用法: ./scripts/check-ports.sh [--http]  加 --http 时会对 HTTP 端口做 curl 探测

set -e

HTTP_PORT=41000
WS_PORT=41001
INSPECT_PORT=41002
MINIAPP_PORT=41003

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_port() {
  local port=$1
  local name=$2
  if lsof -i :"$port" -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${GREEN}[OK]${NC} port $port ($name) is listening"
    return 0
  else
    echo -e "${RED}[FAIL]${NC} port $port ($name) is not listening"
    return 1
  fi
}

do_http_check=false
for arg in "$@"; do
  case "$arg" in
    --http) do_http_check=true ;;
  esac
done

echo "=== Checking art_backend ports ==="
failed=0

check_port $HTTP_PORT "TSRPC HTTP"    || failed=1
check_port $WS_PORT "Game WebSocket"  || failed=1
check_port $MINIAPP_PORT "Miniapp REST+WS" || failed=1
check_port $INSPECT_PORT "Node inspect" || true

if [ "$do_http_check" = true ]; then
  echo ""
  echo "=== HTTP probe ==="
  if curl -sf -o /dev/null --connect-timeout 2 "http://127.0.0.1:$HTTP_PORT/" 2>/dev/null; then
    echo -e "${GREEN}[OK]${NC} TSRPC HTTP $HTTP_PORT responds"
  else
    echo -e "${YELLOW}[?]${NC} TSRPC HTTP $HTTP_PORT no response or non-2xx (may be normal)"
  fi
  if code=$(curl -sf -o /dev/null -w "%{http_code}" --connect-timeout 2 "http://127.0.0.1:$MINIAPP_PORT/home/cards" 2>/dev/null); then
    if [ "$code" = "200" ]; then
      echo -e "${GREEN}[OK]${NC} Miniapp $MINIAPP_PORT /home/cards returns 200"
    else
      echo -e "${YELLOW}[?]${NC} Miniapp $MINIAPP_PORT /home/cards returns $code"
    fi
  else
    echo -e "${RED}[FAIL]${NC} Miniapp $MINIAPP_PORT not reachable"
    failed=1
  fi
fi

echo ""
if [ $failed -eq 0 ]; then
  echo -e "${GREEN}All required ports are up.${NC}"
  exit 0
else
  echo -e "${RED}Some required ports are down. Run: pm2 list && pm2 logs front_1${NC}"
  exit 1
fi
