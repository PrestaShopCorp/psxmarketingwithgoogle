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

namespace PrestaShop\Module\PsxMarketingWithGoogle\Buffer;

use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockFileSessionStorage;

class TemplateBuffer
{
    /**
     * @var Session
     */
    private $session;

    const DEBUG = true;

    public function init($userId)
    {
        $this->session = new Session(
            new MockFileSessionStorage(
                \_PS_CACHE_DIR_ . '/psxmarketingwithgoogle_sessions',
                'conversionaction'
            )
        );
        $this->session->setId($userId);
        $this->session->start();
        register_shutdown_function([$this, 'save']);
    }

    /**
     * add data to the buffer
     *
     * @param string $data
     *
     * @return void
     */
    public function add($data)
    {
        $this->debug('Adding to the buffer: ' . $data);
        $this->session->getFlashBag()->add('gtag_events', $data);
    }

    /**
     * return buffer content and reset it
     *
     * @return string
     */
    public function flush(): string
    {
        $events = $this->session->getFlashBag()->get('gtag_events', []);
        $this->debug('Flushing ' . count($events) .' events');

        /* @phpstan-ignore-next-line */
        $data = self::DEBUG ? '<!-- ID: ' . $this->session->getId() . ' -->': '';
        foreach ($events as $message) {
            $this->debug('- Event flushed: ' . $message);
            $data .= $message;
        }

        return $data;
    }

    public function save(): void
    {
        $this->debug('Buffer saved');
        $this->session->save();
    }

    private function debug(string $data): void
    {
        /* @phpstan-ignore-next-line */
        if (!self::DEBUG) {
            return;
        }

        $id = $this->session->getId();

        (new Filesystem)->appendToFile(
            \_PS_CACHE_DIR_ . "/psxmarketingwithgoogle_debug/$id.txt",
            date(DATE_ATOM) .' - ' . $data . "\n"
        );
    }
}
