.PHONY: help clean build zip vuejs tests test-back test-front fix-lint db docker-build docker-build-front docker-watch-front du docker-up dd docker-down 
VERSION ?= $(shell git describe --tags 2> /dev/null || echo "0.0.0")
PHP ?= $(shell which php 2> /dev/null)
SEM_VERSION ?= $(shell echo ${VERSION} | sed 's/^v//')
MODULE ?= "psxmarketingwithgoogle"
PACKAGE ?= "${MODULE}-${VERSION}"

# target: default                                - Calling build by default
default: build

# target: help                                   - Get help on this file
help:
	@egrep "^#" Makefile

# target: build                                  - Clean up the repository
clean:
	git -c core.excludesfile=/dev/null clean -X -d -f

# target: build                                  - Setup PHP & Node.js locally
build: ./vendor vuejs

./vendor: composer.phar
	./composer.phar install --no-dev -o

# target: vuejs                                  - Install node deps and build vuejs
vuejs: 
	npm --prefix=./_dev/apps/ui install
	npm --prefix=./_dev/apps/ui run build

composer.phar:
ifndef PHP
	$(error "PHP is unavailable on your system")
endif
	php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
	php -r "if (hash_file('sha384', 'composer-setup.php') === '756890a4488ce9024fc62c56153228907f1545c228516cbf63f885e036d37e9a59d27d63f46af1d4d07ee0f76181c7d3') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
	php composer-setup.php
	php -r "unlink('composer-setup.php');"

# target: zip                                    - Make a zip bundle
zip: ./vendor
	mkdir -p ./dist
	cd .. && zip -r ${PACKAGE}.zip ${MODULE} -x '*.git*' -x '*/_dev/apps/ui/*' \
	  ${MODULE}/dist/\* \
	  ${MODULE}/composer.phar \
	  ${MODULE}/Makefile
	mv ../${PACKAGE}.zip ./dist

# target: docker-build-composer          - Watch VueJS files and compile when saved
docker-build-composer:
	docker-compose run --rm php sh -c "composer install"

# target: tests				             - Launch the tests/lints suite front and back
tests: test-back test-front

# target: test-back                    	 - Launch the tests back
test-back:
	docker-compose run --rm php sh -c "vendor/bin/php-cs-fixer fix --dry-run --diff --using-cache=no --diff-format udiff";
	docker-compose run --rm php sh -c "vendor/bin/phpunit tests/";"
	docker run -tid --rm -v ps-volume:/var/www/html --name temp-ps prestashop/prestashop; docker run --rm --volumes-from temp-ps -v $PWD:/web/module -e _PS_ROOT_DIR_=/var/www/html --workdir=/web/module phpstan/phpstan analyse --configuration=/web/module/tests/phpstan/phpstan.neon;

# target: test-front                   	 - Launch the tests front (does not work linter is not configured)
test-front:
	docker-compose run --rm node sh -c "npm --prefix=./_dev/apps/ui run lint"
	docker-compose run --rm node sh -c "npm --prefix=./_dev/apps/ui run test"

# target: fix-lint			             - Launch php cs fixer and npm run lint
fix-lint:
	docker-compose run --rm php sh -c "vendor/bin/php-cs-fixer fix --using-cache=no"
	docker-compose run --rm node sh -c "npm --prefix=./_dev/apps/ui run lint-fix"

# target: docker-build|db              	 - Setup PHP & Node.js with docker
db: docker-build
docker-build: docker-build-front docker-build-composer

# target: docker-build-front             - Build front for prod with docker
docker-build-front:
	docker-compose run --rm node sh -c "npm --prefix=./_dev/apps/ui ci"
	docker-compose run --rm node sh -c "npm --prefix=./_dev/apps/ui run build"

# target: docker-watch-front             - Watch VueJS files and compile when saved
docker-watch-front:
	docker-compose run --rm node sh -c "npm --prefix=./_dev/apps/ui run dev"

# target: docker-up|du                 	 - Start docker containers
du: docker-up
docker-up:
	docker-compose up -d --build

# target: docker-down|dd               	 - Stop docker containers
dd: docker-down
docker-down:
	docker-compose down
