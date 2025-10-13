env:
	cp .env.example .env

up:
	docker compose -f docker-compose.dev.yml up -d

down:
	docker compose -f docker-compose.dev.yml down

down-v:
	docker compose -f docker-compose.dev.yml down -v

workspace:
	docker compose -f docker-compose.dev.yml exec workspace bash

migrate:
	docker compose -f docker-compose.dev.yml exec workspace php artisan migrate

ide-generate:
	docker compose -f docker-compose.dev.yml exec workspace php artisan ide-helper:generate \
	&& docker compose -f docker-compose.dev.yml exec workspace php artisan ide-helper:models --nowrite \
	&& docker compose -f docker-compose.dev.yml exec workspace php artisan ide-helper:meta
