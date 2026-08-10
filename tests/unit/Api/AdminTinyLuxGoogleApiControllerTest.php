<?php

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tests\Unit\Api;

use PHPUnit\Framework\TestCase;
use PrestaShop\Module\PsxMarketingWithGoogle\Http\Response;

require_once __DIR__ . '/../../../controllers/admin/AdminTinyLuxGoogleApiController.php';

class AdminTinyLuxGoogleApiControllerTest extends TestCase
{
    public function testUnauthenticatedEmployeeIsTerminatedBeforeTokenBodyOrDispatch(): void
    {
        $controller = new TestableTinyLuxGoogleApiController(false, true, true);
        $controller->rawBody = '{"method":"POST","path":"settings/credentials","body":{"secret":"raw-secret-value"}}';

        $response = $this->runAndCaptureResponse($controller);

        self::assertSame(401, $response->getStatusCode());
        self::assertSame(['code' => 'unauthorized'], $this->json($response));
        self::assertSame(0, $controller->tokenChecks);
        self::assertSame(0, $controller->viewChecks);
        self::assertSame(0, $controller->bodyReads);
        self::assertSame(0, $controller->dispatches);
        self::assertStringNotContainsString('raw-secret-value', $response->getBody());
    }

    public function testInvalidAdminTokenIsTerminatedBeforeBodyParsingOrDispatch(): void
    {
        $controller = new TestableTinyLuxGoogleApiController(true, false, true);
        $controller->rawBody = '{malformed-secret-payload';

        $response = $this->runAndCaptureResponse($controller);

        self::assertSame(403, $response->getStatusCode());
        self::assertSame(['code' => 'forbidden'], $this->json($response));
        self::assertSame(1, $controller->tokenChecks);
        self::assertSame(0, $controller->viewChecks);
        self::assertSame(0, $controller->bodyReads);
        self::assertSame(0, $controller->dispatches);
        self::assertStringNotContainsString('malformed-secret-payload', $response->getBody());
    }

    public function testProfileWithoutModuleViewPermissionIsTerminatedBeforeBodyParsingOrDispatch(): void
    {
        $controller = new TestableTinyLuxGoogleApiController(true, true, false);
        $controller->rawBody = '{malformed-secret-payload';

        $response = $this->runAndCaptureResponse($controller);

        self::assertSame(403, $response->getStatusCode());
        self::assertSame(['code' => 'forbidden'], $this->json($response));
        self::assertSame(1, $controller->tokenChecks);
        self::assertSame(1, $controller->viewChecks);
        self::assertSame(0, $controller->bodyReads);
        self::assertSame(0, $controller->dispatches);
    }

    public function testDirectDisplayInvocationCannotBypassTheLifecycleAuthorizationGate(): void
    {
        $controller = new TestableTinyLuxGoogleApiController(true, true, true);
        $controller->rawBody = '{"method":"GET","path":"oauth","body":null}';

        $response = $this->displayAndCaptureResponse($controller);

        self::assertSame(401, $response->getStatusCode());
        self::assertSame(['code' => 'unauthorized'], $this->json($response));
        self::assertSame(0, $controller->tokenChecks);
        self::assertSame(0, $controller->viewChecks);
        self::assertSame(0, $controller->bodyReads);
        self::assertSame(0, $controller->dispatches);
    }

    public function testPostProcessIsOwnedByTheJsonControllerAndNeverDispatchesAnActionMethod(): void
    {
        $controller = new TestableTinyLuxGoogleApiController(true, true, true);
        $method = new \ReflectionMethod(\AdminTinyLuxGoogleApiController::class, 'postProcess');

        $controller->postProcess();

        self::assertSame(\AdminTinyLuxGoogleApiController::class, $method->getDeclaringClass()->getName());
        self::assertSame(0, $controller->dynamicActionCalls);
    }

    public function testAuthorizedOversizedEntryPointReadsAtMostLimitPlusOneAndDoesNotDispatch(): void
    {
        $controller = new TestableTinyLuxGoogleApiController(true, true, true);
        $controller->rawBody = str_repeat('x', 65537);

        $response = $this->runAndCaptureResponse($controller);

        self::assertSame(413, $response->getStatusCode());
        self::assertSame(['code' => 'request_too_large'], $this->json($response));
        self::assertSame(1, $controller->bodyReads);
        self::assertSame(65537, $controller->requestedBodyLimit);
        self::assertSame(0, $controller->dispatches);
    }

    /**
     * @dataProvider invalidRequestProvider
     */
    public function testMalformedNonObjectWrongTypeAndOversizedEnvelopesAreRejected(
        string $httpMethod,
        string $rawBody,
        int $expectedStatus,
        string $expectedCode
    ): void {
        $controller = new TestableTinyLuxGoogleApiController(true, true, true);

        $response = $controller->handleJsonRequest($httpMethod, $rawBody);

        self::assertSame($expectedStatus, $response->getStatusCode());
        self::assertSame(['code' => $expectedCode], $this->json($response));
        self::assertSame(0, $controller->dispatches);
    }

    /** @return array<string, array{0: string, 1: string, 2: int, 3: string}> */
    public function invalidRequestProvider(): array
    {
        return [
            'non-POST transport' => ['GET', '{}', 405, 'method_not_allowed'],
            'empty request' => ['POST', '', 400, 'invalid_request'],
            'malformed JSON' => ['POST', '{oops', 400, 'invalid_request'],
            'scalar JSON' => ['POST', '"GET"', 400, 'invalid_request'],
            'list JSON' => ['POST', '["GET","oauth"]', 400, 'invalid_request'],
            'missing method' => ['POST', '{"path":"oauth","body":null}', 400, 'invalid_request'],
            'non-string method' => ['POST', '{"method":1,"path":"oauth","body":null}', 400, 'invalid_request'],
            'non-string path' => ['POST', '{"method":"GET","path":[],"body":null}', 400, 'invalid_request'],
            'list body' => ['POST', '{"method":"POST","path":"settings/credentials","body":[1]}', 400, 'invalid_request'],
            'scalar body' => ['POST', '{"method":"POST","path":"settings/credentials","body":"secret"}', 400, 'invalid_request'],
            'extra envelope key' => ['POST', '{"method":"GET","path":"oauth","body":null,"token":"secret"}', 400, 'invalid_request'],
            'oversized body' => ['POST', str_repeat('x', 65537), 413, 'request_too_large'],
        ];
    }

    public function testValidEnvelopeDispatchesOnlyLogicalMethodPathAndObjectBody(): void
    {
        $controller = new TestableTinyLuxGoogleApiController(true, true, true);
        $rawBody = '{"method":"POST","path":"settings/credentials","body":{"web":{"client_id":"id"}}}';

        $response = $controller->handleJsonRequest('POST', $rawBody);

        self::assertSame(200, $response->getStatusCode());
        self::assertSame(['ok' => true], $this->json($response));
        self::assertSame(1, $controller->dispatches);
        self::assertSame('POST', $controller->dispatchedMethod);
        self::assertSame('settings/credentials', $controller->dispatchedPath);
        self::assertSame(['web' => ['client_id' => 'id']], $controller->dispatchedBody);
    }

    public function testAuthorizedLifecycleDispatchesAfterAllGatesAndOneBoundedBodyRead(): void
    {
        $controller = new TestableTinyLuxGoogleApiController(true, true, true);
        $controller->rawBody = '{"method":"GET","path":"oauth","body":null}';

        $response = $this->runAndCaptureResponse($controller);

        self::assertSame(200, $response->getStatusCode());
        self::assertSame(1, $controller->tokenChecks);
        self::assertSame(1, $controller->viewChecks);
        self::assertSame(1, $controller->bodyReads);
        self::assertSame(65537, $controller->requestedBodyLimit);
        self::assertSame(1, $controller->dispatches);
    }

    private function runAndCaptureResponse(TestableTinyLuxGoogleApiController $controller): Response
    {
        try {
            $controller->runJsonLifecycle();
            self::fail('The JSON entry point must terminate after emitting its response.');
        } catch (JsonResponseTerminated $exception) {
            unset($exception);
        }

        self::assertInstanceOf(Response::class, $controller->terminatedResponse);

        return $controller->terminatedResponse;
    }

    private function displayAndCaptureResponse(TestableTinyLuxGoogleApiController $controller): Response
    {
        try {
            $controller->displayAjax();
            self::fail('The JSON entry point must terminate after emitting its response.');
        } catch (JsonResponseTerminated $exception) {
            unset($exception);
        }

        self::assertInstanceOf(Response::class, $controller->terminatedResponse);

        return $controller->terminatedResponse;
    }

    /** @return array<string, mixed> */
    private function json(Response $response): array
    {
        $decoded = json_decode($response->getBody(), true);
        self::assertIsArray($decoded);

        return $decoded;
    }
}

class TestableTinyLuxGoogleApiController extends \AdminTinyLuxGoogleApiController
{
    /** @var bool */
    private $employeeAuthenticated;

    /** @var bool */
    private $validToken;

    /** @var bool */
    private $viewAllowed;

    /** @var int */
    public $tokenChecks = 0;

    /** @var int */
    public $viewChecks = 0;

    /** @var int */
    public $dispatches = 0;

    /** @var int */
    public $bodyReads = 0;

    /** @var int */
    public $requestedBodyLimit = 0;

    /** @var int */
    public $dynamicActionCalls = 0;

    /** @var string */
    public $rawBody = '';

    /** @var Response|null */
    public $terminatedResponse;

    /** @var string */
    public $dispatchedMethod = '';

    /** @var string */
    public $dispatchedPath = '';

    /** @var array<string, mixed> */
    public $dispatchedBody = [];

    public function __construct(bool $employeeAuthenticated, bool $validToken, bool $viewAllowed)
    {
        $this->employeeAuthenticated = $employeeAuthenticated;
        $this->validToken = $validToken;
        $this->viewAllowed = $viewAllowed;
        $_SERVER['REQUEST_METHOD'] = 'POST';
    }

    protected function hasAuthenticatedEmployee(): bool
    {
        return $this->employeeAuthenticated;
    }

    public function checkToken()
    {
        ++$this->tokenChecks;

        return $this->validToken;
    }

    public function viewAccess($disable = false)
    {
        unset($disable);
        ++$this->viewChecks;

        return $this->viewAllowed;
    }

    public function runJsonLifecycle(): void
    {
        if (!$this->checkAccess()) {
            return;
        }

        $this->postProcess();
        $this->displayAjax();
    }

    public function ajaxProcessCredentials(): void
    {
        ++$this->dynamicActionCalls;
    }

    protected function readRequestBody(int $maximumBytes): string
    {
        ++$this->bodyReads;
        $this->requestedBodyLimit = $maximumBytes;

        return substr($this->rawBody, 0, $maximumBytes);
    }

    protected function emitJsonAndTerminate(Response $response): void
    {
        $this->terminatedResponse = $response;

        throw new JsonResponseTerminated();
    }

    protected function dispatchApi(string $method, string $path, array $body): Response
    {
        ++$this->dispatches;
        $this->dispatchedMethod = $method;
        $this->dispatchedPath = $path;
        $this->dispatchedBody = $body;

        return new Response(200, '{"ok":true}', ['Content-Type' => 'application/json']);
    }
}

final class JsonResponseTerminated extends \RuntimeException
{
}
