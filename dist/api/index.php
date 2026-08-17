<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/db.php';

applyCors();

$path = requestPath();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    if ($method === 'GET' && ($path === '/posts' || $path === '/')) {
        require __DIR__ . '/controllers/PostsController.php';
        listPosts();
    }

    if ($method === 'GET' && preg_match('#^/posts/([a-z0-9-]+)$#', $path, $m)) {
        require __DIR__ . '/controllers/PostsController.php';
        getPost($m[1]);
    }

    if ($method === 'GET' && preg_match('#^/posts/([a-z0-9-]+)/content$#', $path, $m)) {
        require __DIR__ . '/controllers/PostsController.php';
        getPostContent($m[1]);
    }

    if ($method === 'GET' && preg_match('#^/posts/([a-z0-9-]+)/related$#', $path, $m)) {
        require __DIR__ . '/controllers/PostsController.php';
        getRelatedPosts($m[1]);
    }
} catch (Throwable $e) {
    jsonError('Service unavailable', 503);
}

jsonError('Not found', 404);
