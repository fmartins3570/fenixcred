<?php

declare(strict_types=1);

/**
 * Path + config loader.
 *
 * Persist root is two levels above this file:
 *   local:  <repo>/public/api  -> <repo>
 *   prod:   public_html/dist/api -> public_html
 *
 * SQLite, uploads and the live config live OUTSIDE /dist so FTP deploys
 * do not wipe published articles.
 */

function persistRoot(): string
{
    return dirname(__DIR__, 2);
}

function dataDir(): string
{
    $dir = persistRoot() . '/data';
    if (!is_dir($dir)) {
        mkdir($dir, 0750, true);
    }
    $deny = $dir . '/.htaccess';
    if (!is_file($deny)) {
        file_put_contents($deny, "Require all denied\n");
    }
    return $dir;
}

function uploadsDir(): string
{
    $dir = persistRoot() . '/uploads/artigos';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    $deny = persistRoot() . '/uploads/.htaccess';
    if (!is_file($deny)) {
        $parent = dirname($deny);
        if (!is_dir($parent)) {
            mkdir($parent, 0755, true);
        }
        file_put_contents($deny, "Options -Indexes\n<FilesMatch \"\\.(php|phtml|phar)$\">\n  Require all denied\n</FilesMatch>\n");
    }
    return $dir;
}

function loadConfig(): array
{
    static $cfg = null;
    if ($cfg !== null) {
        return $cfg;
    }

    $live = dataDir() . '/config.php';
    $example = __DIR__ . '/config.example.php';

    if (is_file($live)) {
        $cfg = require $live;
    } else {
        $cfg = require $example;
    }

    $cfg['db_path'] = $cfg['db_path'] ?? (dataDir() . '/artigos.sqlite');
    $cfg['upload_dir'] = $cfg['upload_dir'] ?? uploadsDir();
    $cfg['upload_url'] = $cfg['upload_url'] ?? '/uploads/artigos';
    $cfg['site_url'] = rtrim($cfg['site_url'] ?? 'https://fenixcredbr.com.br', '/');

    return $cfg;
}
