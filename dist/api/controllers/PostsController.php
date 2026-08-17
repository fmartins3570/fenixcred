<?php

declare(strict_types=1);

function listPosts(): never
{
    $pdo = getDB();
    $rows = $pdo->query(
        "SELECT p.id, p.slug, p.titulo, p.descricao, p.excerpt, p.autor, p.data,
                p.imagem, p.alt, p.seo_title, p.meta_description
         FROM posts p
         WHERE p.status = 'published'
         ORDER BY p.data DESC"
    )->fetchAll();

    jsonResponse(array_map(fn($r) => formatPost($r, $pdo), $rows));
}

function getPost(string $slug): never
{
    $pdo = getDB();
    $stmt = $pdo->prepare(
        "SELECT p.id, p.slug, p.titulo, p.descricao, p.excerpt, p.autor, p.data,
                p.imagem, p.alt, p.content, p.seo_title, p.meta_description
         FROM posts p
         WHERE p.slug = :slug AND p.status = 'published'"
    );
    $stmt->execute(['slug' => $slug]);
    $row = $stmt->fetch();
    if (!$row) {
        jsonError('Post not found', 404);
    }
    jsonResponse(formatPost($row, $pdo));
}

function getPostContent(string $slug): never
{
    $pdo = getDB();
    $stmt = $pdo->prepare(
        "SELECT content FROM posts WHERE slug = :slug AND status = 'published'"
    );
    $stmt->execute(['slug' => $slug]);
    $post = $stmt->fetch();
    if (!$post) {
        jsonError('Post not found', 404);
    }
    jsonResponse([
        'content'  => $post['content'] ?: null,
        'sections' => [],
    ]);
}

function getRelatedPosts(string $slug): never
{
    $pdo = getDB();
    $stmt = $pdo->prepare(
        "SELECT p.id FROM posts p WHERE p.slug = :slug AND p.status = 'published'"
    );
    $stmt->execute(['slug' => $slug]);
    $current = $stmt->fetch();
    if (!$current) {
        jsonError('Post not found', 404);
    }

    $tags = getTagsForPost($pdo, (int) $current['id']);
    if (!$tags) {
        jsonResponse([]);
    }

    $placeholders = implode(',', array_fill(0, count($tags), '?'));
    $sql = "SELECT p.id, p.slug, p.titulo, p.descricao, p.excerpt, p.autor, p.data,
                   p.imagem, p.alt, p.seo_title, p.meta_description,
                   COUNT(pt.tag_id) AS tag_matches
            FROM posts p
            JOIN post_tags pt ON pt.post_id = p.id
            JOIN tags t ON t.id = pt.tag_id
            WHERE t.nome IN ($placeholders)
              AND p.slug != ?
              AND p.status = 'published'
            GROUP BY p.id
            ORDER BY tag_matches DESC, p.data DESC
            LIMIT 3";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([...$tags, $slug]);
    jsonResponse(array_map(fn($r) => formatPost($r, $pdo), $stmt->fetchAll()));
}

function formatPost(array $row, PDO $pdo): array
{
    $id = isset($row['id']) ? (int) $row['id'] : null;
    if (!$id) {
        $lookup = $pdo->prepare('SELECT id FROM posts WHERE slug = :slug');
        $lookup->execute(['slug' => $row['slug']]);
        $found = $lookup->fetch();
        $id = $found ? (int) $found['id'] : 0;
    }

    return [
        'slug'             => $row['slug'],
        'titulo'           => $row['titulo'],
        'descricao'        => $row['descricao'],
        'excerpt'          => $row['excerpt'] ?? null,
        'autor'            => $row['autor'],
        'data'             => $row['data'],
        'tags'             => $id ? getTagsForPost($pdo, $id) : [],
        'imagem'           => $row['imagem'],
        'alt'              => $row['alt'],
        'content'          => $row['content'] ?? null,
        'seo_title'        => $row['seo_title'] ?? null,
        'meta_description' => $row['meta_description'] ?? null,
    ];
}

function getTagsForPost(PDO $pdo, int $postId): array
{
    $stmt = $pdo->prepare(
        'SELECT t.nome FROM tags t
         JOIN post_tags pt ON pt.tag_id = t.id
         WHERE pt.post_id = :pid
         ORDER BY t.nome'
    );
    $stmt->execute(['pid' => $postId]);
    return $stmt->fetchAll(PDO::FETCH_COLUMN);
}

function syncTags(PDO $pdo, int $postId, array $names): void
{
    $pdo->prepare('DELETE FROM post_tags WHERE post_id = :pid')->execute(['pid' => $postId]);
    $find = $pdo->prepare('SELECT id FROM tags WHERE nome = :nome');
    $insertTag = $pdo->prepare('INSERT INTO tags (nome) VALUES (:nome)');
    $link = $pdo->prepare('INSERT INTO post_tags (post_id, tag_id) VALUES (:pid, :tid)');

    foreach ($names as $name) {
        $name = trim((string) $name);
        if ($name === '') {
            continue;
        }
        $find->execute(['nome' => $name]);
        $tag = $find->fetch();
        if (!$tag) {
            $insertTag->execute(['nome' => $name]);
            $tagId = (int) $pdo->lastInsertId();
        } else {
            $tagId = (int) $tag['id'];
        }
        $link->execute(['pid' => $postId, 'tid' => $tagId]);
    }
}
