help:
	@egrep "^#" Makefile

# target: build-composer               	 - Watch VueJS files and compile when saved
build-composer: composer.phar
	./composer.phar install --no-dev

# target: docker-build-composer          - Watch VueJS files and compile when saved
docker-build-composer:
	docker-compose run --rm php sh -c "composer install"

# target: tests				             - Launch the tests/lints suite front and back
tests: test-back test-front

# target: test-back                    	 - Launch the tests back
test-back:
	docker-compose run --rm php sh -c "vendor/bin/php-cs-fixer fix --dry-run --diff --using-cache=no --diff-format udiff";
	docker run -tid --rm -v ps-volume:/var/www/html --name temp-ps prestashop/prestashop; docker run --rm --volumes-from temp-ps -v $PWD:/web/module -e _PS_ROOT_DIR_=/var/www/html --workdir=/web/module phpstan/phpstan analyse --configuration=/web/module/tests/phpstan/phpstan.neon;

# target: test-front                   	 - Launch the tests front (does not work linter is not configured)
test-front:
	docker-compose run --rm node sh -c "npm --prefix=./_dev run lint"

# target: fix-lint			             - Launch php cs fixer and npm run lint
fix-lint:
	docker-compose run --rm php sh -c "vendor/bin/php-cs-fixer fix --using-cache=no"
	docker-compose run --rm node sh -c "npm --prefix=./_dev run lint --fix"

# target: docker-build|db              	 - Setup PHP & Node.js with docker
db: docker-build
docker-build: docker-build-front docker-build-composer

# target: docker-build-front             - Build front for prod with docker
docker-build-front:
	docker-compose run --rm node sh -c "npm --prefix=./_dev ci"
	docker-compose run --rm node sh -c "npm --prefix=./_dev run build"

# target: docker-watch-front             - Watch VueJS files and compile when saved
docker-watch-front:
	docker-compose run --rm node sh -c "npm --prefix=./_dev run dev"

# target: docker-up|du                 	 - Start docker containers
du: docker-up
docker-up:
	docker-compose up -d --build

# target: docker-down|dd               	 - Stop docker containers
dd: docker-down
docker-down:
	docker-compose down

build-microcks:
	git clone https://github.com/microcks/microcks.git

run-microcks:
	cd microcks/install/docker-compose
	docker-compose up -d
