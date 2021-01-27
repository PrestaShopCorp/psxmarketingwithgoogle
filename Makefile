help:
	@egrep "^#" Makefile

# target: docker-up|du                 	- Start docker containers
du: docker-up
docker-up:
	docker-compose up -d --build

# target: docker-down|dd               	- Stop docker containers
dd: docker-down
docker-down:
	docker-compose down

# target: docker-build|db              	- Setup PHP & (node)JS dependencies
db: docker-build
docker-build: build-front build-composer

# target: bash-app                     	- Connect into app container
ba: bash-app
bash-app:
	docker-compose run --rm php bash

# target: build-front                  	- Build front for prod
build-front:
	docker-compose run --rm node sh -c "cd _dev/ && npm install"
	docker-compose run --rm node sh -c "cd _dev/ && npm run build"

# target: watch-front                   - Watch VueJS files and compile when saved
watch-front:
	docker-compose run --rm node sh -c "cd _dev/ && npm run dev"

# target: build-composer               	- Watch VueJS files and compile when saved
build-composer:
	docker-compose run --rm php sh -c "composer install"

# target: tests				- Launch the tests/lints suite front and back
tests: test-back test-front

# target: test-back                    	- Launch the tests back
test-back:
	docker-compose run --rm php sh -c "vendor/bin/php-cs-fixer fix --dry-run --diff --using-cache=no --diff-format udiff";
	docker run -tid --rm -v ps-volume:/var/www/html --name temp-ps prestashop/prestashop; docker run --rm --volumes-from temp-ps -v $PWD:/web/module -e _PS_ROOT_DIR_=/var/www/html --workdir=/web/module phpstan/phpstan analyse --configuration=/web/module/tests/phpstan/phpstan.neon;

# target: test-front                   	- Launch the tests front (does not work linter is not configured)
test-front:
	docker-compose run --rm node sh -c "cd _dev/ && npm run lint"

# target: fix-lint			- Launch php cs fixer and npm run lint
fix-lint:
	docker-compose run --rm php sh -c "vendor/bin/php-cs-fixer fix --using-cache=no"
	docker-compose run --rm node sh -c "cd _dev/ && npm run lint --fix"
