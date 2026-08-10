<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductSync;

final class CatalogProduct
{
    /** @var string */
    private $offerId;

    /** @var string */
    private $title;

    /** @var string */
    private $description;

    /** @var string */
    private $link;

    /** @var string */
    private $imageLink;

    /** @var bool */
    private $inStock;

    /** @var string */
    private $price;

    /** @var string */
    private $currency;

    /** @var string|null */
    private $brand;

    /** @var string|null */
    private $gtin;

    /** @var string|null */
    private $mpn;

    public function __construct(
        string $offerId,
        string $title,
        string $description,
        string $link,
        string $imageLink,
        bool $inStock,
        string $price,
        string $currency,
        ?string $brand,
        ?string $gtin,
        ?string $mpn
    ) {
        $this->offerId = $offerId;
        $this->title = $title;
        $this->description = $description;
        $this->link = $link;
        $this->imageLink = $imageLink;
        $this->inStock = $inStock;
        $this->price = $price;
        $this->currency = $currency;
        $this->brand = $brand;
        $this->gtin = $gtin;
        $this->mpn = $mpn;
    }

    public function offerId(): string
    {
        return $this->offerId;
    }

    public function title(): string
    {
        return $this->title;
    }

    public function description(): string
    {
        return $this->description;
    }

    public function link(): string
    {
        return $this->link;
    }

    public function imageLink(): string
    {
        return $this->imageLink;
    }

    public function inStock(): bool
    {
        return $this->inStock;
    }

    public function price(): string
    {
        return $this->price;
    }

    public function currency(): string
    {
        return $this->currency;
    }

    public function brand(): ?string
    {
        return $this->brand;
    }

    public function gtin(): ?string
    {
        return $this->gtin;
    }

    public function mpn(): ?string
    {
        return $this->mpn;
    }
}
