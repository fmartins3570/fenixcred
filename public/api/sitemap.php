<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/db.php';

$cfg = loadConfig();
$base = $cfg['site_url'];

header('Content-Type: application/xml; charset=utf-8');
header('Cache-Control: public, max-age=300');

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
echo "  <url>\n    <loc>{$base}/artigos</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.85</priority>\n  </url>\n";

try {
    $pdo = getDB();
    $rows = $pdo->query(
        "SELECT slug, data, updated_at FROM posts WHERE status = 'published' ORDER BY data DESC"
    )->fetchAll();
    foreach ($rows as $row) {
        $lastmod = substr((string) ($row['updated_at'] ?: $row['data']), 0, 10);
        $loc = htmlspecialchars($base . '/artigos/' . $row['slug'], ENT_XML1);
        echo "  <url>\n    <loc>{$loc}</loc>\n    <lastmod>{$lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.75</priority>\n  </url>\n";
    }
} catch (Throwable $e) {
    // empty extra urls if db is not ready
}

echo "</urlset>\n";
