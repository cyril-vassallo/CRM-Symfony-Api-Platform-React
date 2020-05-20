dependency:
	composer install

database:
	php bin/console doctrine:database:create --no-interaction
	php bin/console doctrine:migrations:migrate --no-interaction
	php bin/console doctrine:fixtures:load --no-interaction

stop:

	php bin/console server:stop
	
start:
	php bin/console server:start
	npm run dev-server


create-token:
	mkdir -p config/jwt
	openssl genpkey -out config/jwt/private.pem -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096
	openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem -pubout

test-token:
	curl -X POST -H "Content-Type: application/json" http://localhost/api/login_check -d '{"username":"cyrilvssll34@gmail.com","password":"password"}'
	
route:
	php bin/console debug:route

firststart: 
	$(MAKE) create-token
	$(MAKE) test-token
	$(MAKE) start

restart:
	$(MAKE) stop
	$(MAKE) start

install:
	$(MAKE) dependency
	$(MAKE) database

