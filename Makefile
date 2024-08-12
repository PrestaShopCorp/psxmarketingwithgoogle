VERSION ?= $(shell git describe --tags --match="module-*" --always | cut -d '-' -f2- || echo "v1.0.0")
PHP ?= $(shell which php 2> /dev/null)
SEM_VERSION ?= $(shell echo ${VERSION} | sed 's/^v//')
MODULE ?= "psxmarketingwithgoogle"
PACKAGE ?= "${MODULE}-${VERSION}"
PHP_VERSION ?= 8.1
PS_VERSION ?= 8.1.3
TESTING_IMAGE ?= prestashop/prestashop-flashlight:${PS_VERSION}-${PHP_VERSION}

# target: default                                - Calling build by default
default: build

# target: help                                   - Get help on this file
help:
	@egrep "^#" Makefile

# target: build                                  - Clean up the repository
clean:
	git -c core.excludesfile=/dev/null clean -X -d -f

.PHONY: build
# target: build                                  - Setup PHP & Node.js locally
build: ./vendor vuejs

./vendor: composer.phar
	./composer.phar install --no-dev -o

.PHONY: vuejs
# target: vuejs                                  - Install node deps and build vuejs
vuejs:
	pnpm --prefix=./_dev install
	pnpm --prefix=./_dev -r build

.PHONY: composer.phar
composer.phar:
ifndef PHP
	$(error "PHP is unavailable on your system")
endif
	@php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');";
	@php composer-setup.php;
	@php -r "unlink('composer-setup.php');";

# target: zip                                    - Make a zip bundle
.PHONY: zip
zip: ./vendor
	mkdir -p ./dist
	cd .. && zip -r ${PACKAGE}.zip ${MODULE} -x '*.git*' -x '*/_dev/apps/ui/*' \
	  ${MODULE}/dist/\* \
	  ${MODULE}/composer.phar \
	  ${MODULE}/Makefile
	mv ../${PACKAGE}.zip ./dist

# target: dump-autoload                          - Dump composer autoload
.PHONY: dump-autoload docker-dump-autoload
dump-autoload: composer.phar
	@printf "Dumping composer autoload...\n"
	./composer.phar dump-autoload

# target: fix (or php-fix)                       - Run php code sniffer fixer
.PHONY: fix php-fix docker-php-fix
fix: php-fix
php-fix: vendor/bin/php-cs-fixer
	@printf "Running phpcs fixer...\n"
	PHP_CS_FIXER_IGNORE_ENV=1 ./vendor/bin/php-cs-fixer fix
docker-php-fix:
	@$(call in_docker,make,php-fix)

# target: php-lint                               - Lint the code with the php linter
.PHONY: php-lint docker-php-lint
php-lint:
	@git ls-files | grep -E '.*\.(php)' | xargs -n1 php -l -n | (! grep -v "No syntax errors" );
	@echo "php $(shell php -r 'echo PHP_VERSION;') lint passed";
docker-php-lint:
	@$(call in_docker,make,php-lint)

# target: php-cs-fixer                           - Run php code sniffer linter without fixing
.PHONY: php-cs-fixer docker-php-cs-fixer
php-cs-fixer: vendor/bin/php-cs-fixer
	@printf "Running php cs linter...\n"
	PHP_CS_FIXER_IGNORE_ENV=1 ./vendor/bin/php-cs-fixer fix --dry-run --diff --using-cache=no

docker-php-cs-fixer:
	@$(call in_docker,make,php-cs-fixer)

# target: phpunit                                - Run php unit tests
.PHONY: phpunit docker-phpunit
phpunit: vendor/bin/phpunit
	@printf "Running unit tests...\n"
	./vendor/bin/phpunit tests

docker-phpunit:
	@$(call in_docker,make,phpunit)

# target: docker-up                              - Create all containers to run the project
.PHONY: docker-up
docker-up:
	@printf "Starting docker containers...\n"
	docker compose --project-directory ./e2e-env up --remove-orphans --force-recreate --renew-anon-volumes --detach

# target: docker-down                            - Shutdown all containers and remove oprhans
.PHONY: docker-down
docker-down:
	@printf "Stoping docker containers...\n"
	docker compose --project-directory ./e2e-env down -v --remove-orphans

# target: phpstan                                - Run phpstan lint
.PHONY: phpstan
phpstan: vendor/prestashop
	docker run --rm -e _PS_ROOT_DIR_=/var/www/html \
          --entrypoint phpstan \
                --workdir=/module \
          -v $(shell echo $(PWD)):/module:ro ${TESTING_IMAGE}\
          analyse --memory-limit=-1 --configuration=/module/tests/phpstan/phpstan.neon;

.PHONY: composer-install docker-composer-install
composer-install: composer.phar
	@printf "Install composer dependencies with dev deps...\n"
	./composer.phar install -o;
docker-composer-install:
	@$(call in_docker,make,composer-install)
