<?php
/**
 * 2007-2020 PrestaShop and Contributors.
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License 3.0 (AFL-3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/AFL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * @author    PrestaShop SA <contact@prestashop.com>
 * @copyright 2007-2020 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/AFL-3.0 Academic Free License 3.0 (AFL-3.0)
 * International Registered Trademark & Property of PrestaShop SA
 */

namespace PrestaShop\AccountsAuth\Tests\Unit\Service;

use PHPUnit\Framework\TestCase;
use PrestaShop\AccountsAuth\Service\SshKey;

class SshKeyTest extends TestCase
{
    public function testGenerate()
    {
        $sshKey = new SshKey();
        $key = $sshKey->generate();
        $this->assertArrayHasKey('privatekey', $key, "Key 'privatekey' don't exist in Array");
        $this->assertArrayHasKey('publickey', $key, "Key 'publickey' don't exist in Array");
        $this->assertEquals('string', gettype($key['privatekey']), "'privatekey' isn't string");
        $this->assertEquals('string', gettype($key['publickey']), "'privatekey' isn't string");
    }

    public function testVerifyDecryptRsaKey()
    {
        $sshKey = new SshKey();
        $key = $sshKey->generate();
        $privateKey = '-----BEGIN RSA PRIVATE KEY-----
         MIICWwIBAAKBgQCeksA2G79u1InvLc8tKcerLCLa66be0h/CD9RhDnQh5CXQxe5H
         URMyTWy6DpyFyddg6cnOh1RavMWUvdvjwtcgxVmmwtBA7kS8sKuxRUBFHjxB7i9N
         cLlbhBTQl15zjpHcI7ggBulqTS1b5jwEuZSv8d+NW0pCTZk/4Xm4d2i+9QIDAQAB
         AoGAGkMnvk5eKBbfOVOW6l3vCbRnmWZJ3sFiLRu+Cs0AAtTsRmVhj0IoMb6M8UuW
         NLo3B3/wwlm7aMO23WmMT25nfm0ozMD5JBhsHhMjNf936+eul+brSL0yw3OBWHrn
         rhRAibzy3Oe7lHqhJseGPddb7k3rrYHiCL3XjD4aUnSqxokCQQDQ4jOaP75srmWw
         drR4NbJy18+BOQOKLew0mDdMwfeCskWEiFDftRTSlOFtcG4p8MhsT5XKeFGKzrEe
         fYPqnuZbAkEAwldsIp+UWOudQb6/sqCLyrPYtH5K1SZs2eqaauuFVz0tTMONznaa
         3QESWSqPNjVXmtZQNh64lR9SrGBugB4Q7wJACol+pOdWSdE6W/6A+BdtWxG76/7e
         SNgsNDMBhyO5wqQPkbH2snJGDKFqBcVIKWF2GtCg88fCBUiL8sfOIcXGRQJAFpBB
         3M88UQqiCnUUGrArKtCws1wKYi8A6lgjr5BCvfs7XDNELpl0p34tXC7ly7xrvG1v
         iKkOczncxmi3y6Yx/wJABjuZp1et+/uNQ33vv/NlHRNqfR4B/ZVbn+GvdAiuDEdU
         3+trKNmdcTb/7oQ/5RygDWjjXVvaZhheA3LCHFwiSg==
         -----END RSA PRIVATE KEY-----';

        $publicKey = 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAAAgQCeksA2G79u1InvLc8tKcerLCLa66be0h/CD9RhDnQh5CXQxe5HURMyTWy6DpyFyddg6cnOh1RavMWUvdvjwtcgxVmmwtBA7kS8sKuxRUBFHjxB7i9NcLlbhBTQl15zjpHcI7ggBulqTS1b5jwEuZSv8d+NW0pCTZk/4Xm4d2i+9Q== phpseclib-generated-key';
        $data = 'hmac';
        $signature = $sshKey->signData($privateKey, $data);

        $this->assertEquals(1, $sshKey->verifySignature($publicKey, $signature, $data), "Data doesn't signed");
    }
}
