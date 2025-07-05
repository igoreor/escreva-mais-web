# Nome da imagem Docker
IMAGE_NAME = escreva-mais-web
CONTAINER_NAME = escreva-mais-web-container
PORT = 3000

# Comando principal para desenvolvimento
dev: build run

# Build da imagem Docker
build:
	@echo " Buildando imagem Docker..."
	docker build -t $(IMAGE_NAME):latest .

# Rodar container
run:
	@echo "Rodando container..."
	docker run -d \
		--name $(CONTAINER_NAME) \
		-p $(PORT):$(PORT) \
		--rm \
		$(IMAGE_NAME):latest

# Parar container
stop:
	@echo "Parando container..."
	docker stop $(CONTAINER_NAME) || true

# Limpar container e imagem
clean: stop
	@echo "Limpando container e imagem..."
	docker rmi $(IMAGE_NAME):latest || true

# Rebuild (limpar e buildar novamente)
rebuild: clean build

# Logs do container
logs:
	@echo "Mostrando logs do container..."
	docker logs -f $(CONTAINER_NAME)

# Entrar no container
shell:
	@echo "Entrando no container..."
	docker exec -it $(CONTAINER_NAME) /bin/sh

# Status do container
status:
	@echo "Status do container:"
	docker ps -a --filter name=$(CONTAINER_NAME)

# Modo desenvolvimento com hot reload (usando volume mount)
dev-hot:
	@echo "Rodando em modo desenvolvimento com hot reload..."
	docker run -d \
		--name $(CONTAINER_NAME)-dev \
		-p $(PORT):$(PORT) \
		-v $(PWD)/src:/app/src \
		-v $(PWD)/public:/app/public \
		--rm \
		$(IMAGE_NAME):latest

# Parar dev-hot
stop-dev:
	@echo "Parando container de desenvolvimento..."
	docker stop $(CONTAINER_NAME)-dev || true

# Ajuda
help:
	@echo "Comandos disponíveis:"
	@echo "  make dev         - Build e run da aplicação"
	@echo "  make build       - Build da imagem Docker"
	@echo "  make run         - Rodar container"
	@echo "  make stop        - Parar container"
	@echo "  make clean       - Limpar container e imagem"
	@echo "  make rebuild     - Rebuild completo"
	@echo "  make logs        - Ver logs do container"
	@echo "  make shell       - Entrar no container"
	@echo "  make status      - Status do container"
	@echo "  make dev-hot     - Desenvolvimento com hot reload"
	@echo "  make stop-dev    - Parar container de desenvolvimento"
	@echo "  make help        - Mostrar esta ajuda"

.PHONY: dev build run stop clean rebuild logs shell status dev-hot stop-dev help 