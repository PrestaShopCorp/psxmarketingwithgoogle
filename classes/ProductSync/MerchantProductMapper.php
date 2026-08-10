<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductSync;

final class MerchantProductMapper
{
    private const DESCRIPTION_MAX_CHARACTERS = 5000;
    private const OPTIONAL_TEXT_MAX_CHARACTERS = 70;
    private const URL_MAX_BYTES = 2048;

    /** @return array<string, mixed> */
    public function map(CatalogProduct $product, string $contentLanguage, string $feedLabel): array
    {
        $normalized = $this->validate($product);
        $errors = [];
        if (35 < strlen($contentLanguage)
            || 1 !== preg_match('/^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8}){0,3}$/D', $contentLanguage)
        ) {
            $errors[] = ['field' => 'contentLanguage', 'code' => 'invalid_format'];
        }
        if (1 !== preg_match('/^[A-Z0-9-]{1,20}$/D', $feedLabel)) {
            $errors[] = ['field' => 'feedLabel', 'code' => 'invalid_format'];
        }
        if ([] !== $errors) {
            throw new ProductValidationException($errors);
        }

        $attributes = [
            'title' => $normalized['title'],
            'description' => $normalized['description'],
            'link' => $product->link(),
            'imageLink' => $product->imageLink(),
            'availability' => $product->inStock() ? 'IN_STOCK' : 'OUT_OF_STOCK',
            'condition' => 'NEW',
            'price' => [
                'amountMicros' => $normalized['amountMicros'],
                'currencyCode' => $product->currency(),
            ],
        ];
        if ('' !== $normalized['brand']) {
            $attributes['brand'] = $normalized['brand'];
        }
        if ('' !== $normalized['gtin']) {
            $attributes['gtins'] = [$normalized['gtin']];
        }
        if ('' !== $normalized['mpn']) {
            $attributes['mpn'] = $normalized['mpn'];
        }

        return [
            'offerId' => $product->offerId(),
            'contentLanguage' => $contentLanguage,
            'feedLabel' => $feedLabel,
            'productAttributes' => $attributes,
        ];
    }

    /**
     * Validate a catalog product before it leaves the catalog boundary.
     *
     * @return array{title: string, description: string, amountMicros: string, brand: string, gtin: string, mpn: string}
     */
    public function validate(CatalogProduct $product): array
    {
        $errors = [];
        $title = $this->normalizeText($product->title());
        $description = $this->truncate(
            $this->normalizeText($product->description()),
            self::DESCRIPTION_MAX_CHARACTERS
        );
        $brand = $this->normalizeOptionalText($product->brand());
        $gtin = $this->normalizeOptionalText($product->gtin());
        $mpn = $this->normalizeOptionalText($product->mpn());

        if (1 !== preg_match('/^[A-Za-z0-9._-]{1,50}$/D', $product->offerId())) {
            $errors[] = ['field' => 'offerId', 'code' => 'invalid_format'];
        }
        if ('' === $title) {
            $errors[] = ['field' => 'title', 'code' => 'required'];
        }
        if ('' === $description) {
            $errors[] = ['field' => 'description', 'code' => 'required'];
        }
        $this->validateRequiredUrl('link', $product->link(), $errors);
        $this->validateRequiredUrl('imageLink', $product->imageLink(), $errors);

        $amountMicros = null;
        if (1 !== preg_match('/^(\d+)(?:\.(\d{1,6}))?$/D', $product->price(), $matches)) {
            $errors[] = ['field' => 'price', 'code' => 'invalid_decimal'];
        } else {
            $fraction = str_pad($matches[2] ?? '', 6, '0');
            $amountMicros = ltrim($matches[1] . $fraction, '0') ?: '0';
        }
        if (1 !== preg_match('/^[A-Z]{3}$/D', $product->currency())) {
            $errors[] = ['field' => 'currencyCode', 'code' => 'invalid_format'];
        }

        if (null !== $product->brand()
            && '' !== $brand
            && ($this->containsControl($product->brand()) || self::OPTIONAL_TEXT_MAX_CHARACTERS < $this->length($brand))
        ) {
            $errors[] = ['field' => 'brand', 'code' => 'invalid_format'];
        }
        if ('' !== $gtin && 1 !== preg_match('/^(?:\d{8}|\d{12}|\d{13}|\d{14})$/D', $gtin)) {
            $errors[] = ['field' => 'gtin', 'code' => 'invalid_format'];
        }
        if (null !== $product->mpn()
            && '' !== $mpn
            && ($this->containsControl($product->mpn())
                || self::OPTIONAL_TEXT_MAX_CHARACTERS < $this->length($mpn)
                || 1 !== preg_match('/^[\pL\pN][\pL\pN ._\/-]*$/u', $mpn))
        ) {
            $errors[] = ['field' => 'mpn', 'code' => 'invalid_format'];
        }
        if ([] !== $errors) {
            throw new ProductValidationException($errors);
        }

        return [
            'title' => $title,
            'description' => $description,
            'amountMicros' => (string) $amountMicros,
            'brand' => $brand,
            'gtin' => $gtin,
            'mpn' => $mpn,
        ];
    }

    /**
     * @param array<int, array{field: string, code: string}> $errors
     */
    private function validateRequiredUrl(string $field, string $url, array &$errors): void
    {
        if ('' === trim($url)) {
            $errors[] = ['field' => $field, 'code' => 'required'];

            return;
        }
        if (self::URL_MAX_BYTES < strlen($url)
            || $this->containsControl($url)
            || false === filter_var($url, FILTER_VALIDATE_URL)
        ) {
            $errors[] = ['field' => $field, 'code' => 'invalid_url'];

            return;
        }
        $parts = parse_url($url);
        if (!is_array($parts)
            || !isset($parts['scheme'], $parts['host'])
            || !in_array(strtolower($parts['scheme']), ['http', 'https'], true)
            || isset($parts['user'])
            || isset($parts['pass'])
        ) {
            $errors[] = ['field' => $field, 'code' => 'invalid_url'];
        }
    }

    private function normalizeOptionalText(?string $text): string
    {
        return null === $text ? '' : $this->normalizeText($text);
    }

    private function normalizeText(string $text): string
    {
        $text = html_entity_decode(strip_tags($text), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $normalized = preg_replace('/\s+/u', ' ', $text);

        return is_string($normalized) ? trim($normalized) : '';
    }

    private function truncate(string $text, int $maxCharacters): string
    {
        if ($this->length($text) <= $maxCharacters) {
            return $text;
        }

        return mb_substr($text, 0, $maxCharacters, 'UTF-8');
    }

    private function length(string $text): int
    {
        return mb_strlen($text, 'UTF-8');
    }

    private function containsControl(string $value): bool
    {
        return 1 === preg_match('/[\x00-\x1F\x7F]/', $value);
    }
}
