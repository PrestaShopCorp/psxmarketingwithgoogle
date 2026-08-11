<?php

namespace {
    if (!class_exists('Module', false)) {
        class Module
        {
            /** @var string */
            public $name = '';
        }
    }

    if (!class_exists('ModuleFrontController', false)) {
        class ModuleFrontController
        {
            /** @var mixed */
            public $module;

            public function initContent()
            {
            }
        }
    }

    if (!defined('_PS_VERSION_')) {
        define('_PS_VERSION_', '9.1.4');
    }
}

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Unit\ProductSync {
    use PHPUnit\Framework\TestCase;
    use PrestaShop\Module\PsxMarketingWithGoogle\Http\Response;
    use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CronAuthorization;
    use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\CronRequestHandler;

    require_once __DIR__ . '/../../../psxmarketingwithgoogle.php';

    class CronFrontControllerTest extends TestCase
    {
        public function testTinyLuxCronAliasPreservesOauthAliasAndTechnicalModuleAuthority(): void
        {
            $reflection = new \ReflectionClass(\PsxMarketingWithGoogle::class);
            /** @var \PsxMarketingWithGoogle $module */
            $module = $reflection->newInstanceWithoutConstructor();
            $module->name = 'psxmarketingwithgoogle';

            self::assertSame([
                'module' => [
                    'controller' => null,
                    'rule' => 'module/{module}{/:controller}',
                    'keywords' => [
                        'module' => [
                            'regexp' => '(?!tlgoogleshopping(?:/|$))[_a-zA-Z0-9_-]+',
                            'param' => 'module',
                        ],
                        'controller' => [
                            'regexp' => '[_a-zA-Z0-9_-]+',
                            'param' => 'controller',
                        ],
                    ],
                    'params' => ['fc' => 'module'],
                ],
                'module-tlgoogleshopping-oauth' => [
                    'controller' => 'oauth',
                    'rule' => 'module/tlgoogleshopping/oauth',
                    'keywords' => [],
                    'params' => ['fc' => 'module', 'module' => 'psxmarketingwithgoogle'],
                ],
                'module-tlgoogleshopping-cron' => [
                    'controller' => 'cron',
                    'rule' => 'module/tlgoogleshopping/cron',
                    'keywords' => [],
                    'params' => ['fc' => 'module', 'module' => 'psxmarketingwithgoogle'],
                ],
            ], $module->hookModuleRoutes());
        }

        public function testCoreModuleCatchAllLeavesTinyLuxAliasForTheExactCustomRoute(): void
        {
            $reflection = new \ReflectionClass(\PsxMarketingWithGoogle::class);
            /** @var \PsxMarketingWithGoogle $module */
            $module = $reflection->newInstanceWithoutConstructor();
            $module->name = 'psxmarketingwithgoogle';

            $routes = $module->hookModuleRoutes();
            self::assertArrayHasKey('module', $routes);
            $modulePattern = '#^' . $routes['module']['keywords']['module']['regexp'] . '$#D';

            self::assertSame(0, preg_match($modulePattern, 'tlgoogleshopping'));
            self::assertSame(1, preg_match($modulePattern, 'psxmarketingwithgoogle'));
            self::assertSame(1, preg_match($modulePattern, 'ps_emailalerts'));
        }

        public function testControllerConventionAndPublicHandlerReturnResponseBeforeEmission(): void
        {
            $controllerPath = __DIR__ . '/../../../controllers/front/cron.php';
            if (!is_file($controllerPath)) {
                self::fail('Cron front controller is not implemented.');
            }
            require_once $controllerPath;

            self::assertTrue(is_subclass_of(
                'PsxmarketingwithgoogleCronModuleFrontController',
                \ModuleFrontController::class
            ));

            $controller = new class($this->handler()) extends \PsxmarketingwithgoogleCronModuleFrontController {
                /** @var CronRequestHandler */
                private $handler;

                /** @var bool */
                public $emitted = false;

                public function __construct(CronRequestHandler $handler)
                {
                    $this->handler = $handler;
                }

                protected function requestHandler(): CronRequestHandler
                {
                    return $this->handler;
                }

                protected function emit(Response $response): void
                {
                    unset($response);
                    $this->emitted = true;
                }
            };
            $response = $controller->handleRequest('GET', [
                'shop' => '7',
                'token' => 'correct-token',
            ]);

            self::assertInstanceOf(Response::class, $response);
            self::assertSame(200, $response->getStatusCode());
            self::assertSame(
                '{"total":0,"succeeded":0,"failed":0,"skipped":0,"pending":0}',
                $response->getBody()
            );
            self::assertFalse($controller->emitted);
        }

        public function testLifecycleHandlesRequestThenEmitsTheReturnedResponse(): void
        {
            require_once __DIR__ . '/../../../controllers/front/cron.php';

            $controller = new class($this->handler()) extends \PsxmarketingwithgoogleCronModuleFrontController {
                /** @var CronRequestHandler */
                private $handler;

                /** @var Response|null */
                public $emittedResponse;

                public function __construct(CronRequestHandler $handler)
                {
                    $this->handler = $handler;
                }

                protected function requestHandler(): CronRequestHandler
                {
                    return $this->handler;
                }

                protected function requestMethod(): string
                {
                    return 'GET';
                }

                protected function requestQuery(): array
                {
                    return ['shop' => '7', 'token' => 'correct-token'];
                }

                protected function emit(Response $response): void
                {
                    $this->emittedResponse = $response;
                }
            };

            $controller->initContent();

            self::assertInstanceOf(Response::class, $controller->emittedResponse);
            self::assertSame(200, $controller->emittedResponse->getStatusCode());
            self::assertSame(
                '{"total":0,"succeeded":0,"failed":0,"skipped":0,"pending":0}',
                $controller->emittedResponse->getBody()
            );
        }

        private function handler(): CronRequestHandler
        {
            return new CronRequestHandler(
                new CronAuthorization(static function (int $shopId): ?string {
                    return 7 === $shopId ? 'correct-token' : null;
                }),
                static function (): array {
                    return [
                        'total' => 0,
                        'succeeded' => 0,
                        'failed' => 0,
                        'skipped' => 0,
                        'pending' => 0,
                    ];
                }
            );
        }
    }
}
