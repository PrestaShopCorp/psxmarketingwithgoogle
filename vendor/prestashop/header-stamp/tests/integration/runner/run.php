#!/usr/bin/env php
<?php

require_once __DIR__ . '/../../../vendor/autoload.php';
require_once __DIR__ . '/util.php';
require_once __DIR__ . '/FolderComparator.php';

use PrestaShop\HeaderStamp\Command\UpdateLicensesCommand;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\BufferedOutput;
use Symfony\Component\Filesystem\Filesystem;

$modulesToTest = [
    'gsitemap',
    'dashproducts',
    'fakemodule',
    'existing-headers-discrimination',
];
$workspaceID = 100;
$filesystem = new Filesystem();
$folderComparator = new FolderComparator();

$application = buildTestApplication();

foreach ($modulesToTest as $moduleName) {
    ++$workspaceID;
    $moduleFolderpath = __DIR__ . '/../module-samples/' . $moduleName;
    $expectedModuleFolderpath = __DIR__ . '/../expected/' . $moduleName;
    $workspaceFolderpath = __DIR__ . '/../workspace/' . $workspaceID;

    // copy module into workspace
    $filesystem->mirror($moduleFolderpath, $workspaceFolderpath);

    // run UpdateLicensesCommand on workspace
    $commandParameters = ['command' => 'prestashop:licenses:update',
                          '--license' => __DIR__ . '/../../../assets/afl.txt',
                          '--target' => $workspaceFolderpath,
    ];

    if ('existing-headers-discrimination' === $moduleName) {
        $commandParameters['--header-discrimination-string'] = 'friendsofpresta';
    }

    $input = new ArrayInput(
        $commandParameters
    );

    $output = new BufferedOutput();
    $application->run($input, $output);

    // compare workspace with expected
    $check = $folderComparator->compareFolders($expectedModuleFolderpath, $workspaceFolderpath, '');
    $check2 = $folderComparator->compareFolders($workspaceFolderpath, $expectedModuleFolderpath, '');

    // empty workspace
    $filesystem->remove($workspaceFolderpath);

    if (!empty($check)) {
        printErrorsList($moduleName, $check);

        exit(1);
    }
    if (!empty($check2)) {
        printErrorsList($moduleName, $check2);

        exit(1);
    }

    printSuccessMessage(' - module ' . $moduleName . ' processed successfully' . PHP_EOL);
}

printSuccessMessage('Integration tests run successfully' . PHP_EOL);

exit(0);
