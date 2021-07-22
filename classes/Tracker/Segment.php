<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 * PrestaShop is an International Registered Trademark & Property of PrestaShop SA
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License version 3.0
 * that is bundled with this package in the file LICENSE.md.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/AFL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * @author    PrestaShop SA and Contributors <contact@prestashop.com>
 * @copyright Since 2007 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\Tracker;

use Context;
use PrestaShop\Module\PsxMarketingWithGoogle\Config\Config;

class Segment implements TrackerInterface
{
    /**
     * @var string
     */
    private $message = '';

    /**
     * @var array
     */
    private $options = [];

    /**
     * @var Context
     */
    private $context;

    /**
     * Segment constructor.
     */
    public function __construct(Context $context)
    {
        $this->context = $context;
        $this->init();
    }

    /**
     * Init segment client with the api key
     */
    private function init()
    {
        \Segment::init(Config::PSX_MKTG_WITH_GOOGLE_SEGMENT_API_KEY);
    }

    /**
     * Track event on segment
     *
     * @return bool
     *
     * @throws \PrestaShopException
     */
    public function track()
    {
        if (empty($this->message)) {
            throw new \PrestaShopException('Message cannot be empty. Need to set it with setMessage() method.');
        }

        // Dispatch track depending on context shop
        $this->dispatchTrack();

        return true;
    }

    private function segmentTrack($userId)
    {
        $userAgent = array_key_exists('HTTP_USER_AGENT', $_SERVER) === true ? $_SERVER['HTTP_USER_AGENT'] : '';
        $ip = array_key_exists('REMOTE_ADDR', $_SERVER) === true ? $_SERVER['REMOTE_ADDR'] : '';
        $referer = array_key_exists('HTTP_REFERER', $_SERVER) === true ? $_SERVER['HTTP_REFERER'] : '';
        $url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

        \Segment::track([
            'userId' => $userId,
            'event' => $this->message,
            'channel' => 'browser',
            'context' => [
                'ip' => $ip,
                'userAgent' => $userAgent,
                'locale' => $this->context->language->iso_code,
                'page' => [
                    'referrer' => $referer,
                    'url' => $url,
                ],
            ],
            'properties' => array_merge([
                'module' => 'psxmarketingwithgoogle',
            ], $this->options),
        ]);

        \Segment::flush();
    }

    /**
     * Handle tracking differently depending on the shop context
     *
     * @return mixed
     */
    private function dispatchTrack()
    {
        $dictionary = [
            \Shop::CONTEXT_SHOP => function () {
                return $this->trackShop();
            },
            \Shop::CONTEXT_GROUP => function () {
                return $this->trackShopGroup();
            },
            \Shop::CONTEXT_ALL => function () {
                return $this->trackAllShops();
            },
        ];

        return call_user_func($dictionary[$this->context->shop->getContext()]);
    }

    /**
     * Send track segment only for the current shop
     */
    private function trackShop()
    {
        $userId = $this->context->shop->domain;

        $this->segmentTrack($userId);
    }

    /**
     * Send track segment for each shop in the current shop group
     */
    private function trackShopGroup()
    {
        $shops = $this->context->shop->getShops(true, $this->context->shop->getContextShopGroupID());
        foreach ($shops as $shop) {
            $this->segmentTrack($shop['domain']);
        }
    }

    /**
     * Send track segment for all shops
     */
    private function trackAllShops()
    {
        $shops = $this->context->shop->getShops();
        foreach ($shops as $shop) {
            $this->segmentTrack($shop['domain']);
        }
    }

    /**
     * @return string
     */
    public function getMessage()
    {
        return $this->message;
    }

    /**
     * @param string $message
     */
    public function setMessage($message)
    {
        $this->message = $message;
    }

    /**
     * @return array
     */
    public function getOptions()
    {
        return $this->options;
    }

    /**
     * @param array $options
     */
    public function setOptions($options)
    {
        $this->options = $options;
    }
}
