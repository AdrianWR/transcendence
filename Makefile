.PHONY: all build buildno up down clean fclean ps back log

YML= -f ./srcs/docker-compose.yml
ENV= --env-file ./srcs/.env


VOLUMES_PATH = /home/pcunha/data
VOLUMES_DIR = db_data site_data
VOLUMES = $(addprefix $(VOLUMES_PATH)/, $(VOLUMES_DIR))

all: down build

build:
	#echo "Creating Volumes ..."
	#docker volume create --name=backend_volume
	#docker volume create --name=frontend_volume
	echo "Building ..."
	docker-compose build
	#docker-compose up --build back postgres
	#docker build -t node_img .
	#docker-compose $(YML) $(ENV) build

down:
	docker-compose down
	#docker container stop node_c
	#docker-compose $(YML) $(ENV) down

clean: down
	#echo "Deleting container ..."
	#docker container rm node_c

fclean: down
	echo "Docker pruning ..."
	docker system prune -f -a --volumes
	docker volume rm backend frontend

re: fclean up

up:
	#docker volume create --name backend --opt type=none --opt device=/home/user42/transcendence/backend --opt o=bind
	#docker volume create --name frontend --opt type=none --opt device=/home/user42/transcendence/frontend --opt o=bind
	docker-compose up
	#docker run -it -v ~/transcendence:/app/ -p 3000:3000 --name node_c node_img
	#docker-compose $(YML) $(ENV) up -d 
	#docker-compose $(YML) $(ENV) ps -a

#ps:
#	docker-compose $(YML) $(ENV) ps -a

back:
	docker exec -u root -it backend bash
	#docker container rm lixo
	#docker run -it --name lixo -v ~/transcendence/back:/back back /bin/bash

log:
	rm -f logfile
	echo -n "BACKEND:\n" > logfile
	docker logs backend >> logfile
	echo -n "FRONTEND:\n" >> logfile
	docker logs frontend >> logfile
	echo -n "POSTGRES:\n" >> logfile
	docker logs db >> logfile
	cat logfile
