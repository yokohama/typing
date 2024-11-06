include .env
export $(shell sed 's/=.*//' .env)

create_db:
	docker exec -it $(APP_NAME)-db psql -U postgres -c "CREATE DATABASE $(APP_NAME);"

migration-run:
	sqlx migrate run --database-url postgres://postgres:password@localhost:/$(APP_NAME)

migration-revert:
	sqlx migrate revert --database-url postgres://postgres:password@localhost:/$(APP_NAME)

psql:
	PGPASSWORD=password psql -h localhost -p 5432 -U postgres -d $(APP_NAME)

aws-logs-service:
	aws logs tail $(CLOUDWATCH_LOG_GROUP)/service --follow --profile $(PROFILE)

aws-logs-app:
	aws logs tail $(CLOUDWATCH_LOG_GROUP)/application --follow --profile $(PROFILE)

seed:
	docker compose run --rm backend cargo run --bin seed

test: seed
	cargo test -- --nocapture --test-threads=1

test-production:
	./bin/production_test.sh
