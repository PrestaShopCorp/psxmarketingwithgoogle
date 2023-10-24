<?php

namespace Conversion;

use PHPUnit\Framework\TestCase;
use PrestaShop\Module\PsxMarketingWithGoogle\Conversion\SnippetUpdater;

class SnippetUpdaterTest extends TestCase
{
    public function testEnhancedConversionIsAdded()
    {
        $input = <<<EOF
            <!-- Google tag (gtag.js) -->
            <script async src="https://www.googletagmanager.com/gtag/js?id=AW-000000000"></script>
            <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-000000000');
            </script>
            EOF;

        $expectedOutput = <<<EOF
            <!-- Google tag (gtag.js) -->
            <script async src="https://www.googletagmanager.com/gtag/js?id=AW-000000000"></script>
            <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-000000000', {'allow_enhanced_conversions': true});
            </script>
            EOF;

        $this->assertSame(
            $expectedOutput,
            (new SnippetUpdater($input))->addEnhancedConversion()->getSnippet()
        );
    }

    public function testEnhancedConversionIsRemoved()
    {
        $input = <<<EOF
            <!-- Google tag (gtag.js) -->
            <script async src="https://www.googletagmanager.com/gtag/js?id=AW-000000000"></script>
            <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-000000000', {'allow_enhanced_conversions': true});
            </script>
EOF;

        $expectedOutput = <<<EOF
            <!-- Google tag (gtag.js) -->
            <script async src="https://www.googletagmanager.com/gtag/js?id=AW-000000000"></script>
            <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-000000000');
            </script>
EOF;

        $this->assertSame(
            $expectedOutput,
            (new SnippetUpdater($input))->removeEnhancedConversion()->getSnippet()
        );
    }
}
