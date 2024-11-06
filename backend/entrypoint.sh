#!/bin/sh

echo "#- entrypoint.sh -------#"

DB_NAME="${APP_NAME}"

echo " - sqlx migrate run"
sqlx migrate run

echo "#----------------- end -#"

exec "$@"
