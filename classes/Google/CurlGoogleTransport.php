<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\Google;

use PrestaShop\Module\PsxMarketingWithGoogle\Http\Response;

final class CurlGoogleTransport implements GoogleTransportInterface
{
    private const CONNECT_TIMEOUT_SECONDS = 5;
    private const TOTAL_TIMEOUT_SECONDS = 20;

    public function request(string $method, string $url, array $headers, ?string $body): Response
    {
        $handle = curl_init();
        if (false === $handle) {
            return new Response(0, '', [], 'Google transport unavailable.');
        }

        /** @var array<string, string> $responseHeaders */
        $responseHeaders = [];
        curl_setopt_array($handle, [
            CURLOPT_URL => $url,
            CURLOPT_CUSTOMREQUEST => strtoupper($method),
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => false,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
            CURLOPT_CONNECTTIMEOUT => self::CONNECT_TIMEOUT_SECONDS,
            CURLOPT_TIMEOUT => self::TOTAL_TIMEOUT_SECONDS,
            CURLOPT_PROTOCOLS => CURLPROTO_HTTPS,
            CURLOPT_HEADERFUNCTION => static function ($curl, string $headerLine) use (&$responseHeaders): int {
                unset($curl);
                $length = strlen($headerLine);
                $parts = explode(':', $headerLine, 2);
                if (2 === count($parts)) {
                    $responseHeaders[strtolower(trim($parts[0]))] = trim($parts[1]);
                }

                return $length;
            },
        ]);
        if (null !== $body) {
            curl_setopt($handle, CURLOPT_POSTFIELDS, $body);
        }

        $responseBody = curl_exec($handle);
        $statusCode = (int) curl_getinfo($handle, CURLINFO_RESPONSE_CODE);
        $error = false === $responseBody ? curl_error($handle) : null;
        curl_close($handle);

        return new Response(
            $statusCode,
            false === $responseBody ? '' : (string) $responseBody,
            $responseHeaders,
            $error
        );
    }
}
