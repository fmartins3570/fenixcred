<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/db.php';

$cfg = loadConfig();
$key = $_GET['key'] ?? '';
if ($key === '' || !hash_equals((string) $cfg['seed_key'], $key)) {
    jsonError('Forbidden', 403);
}

$pdo = getDB();
$pdo->exec(<<<'SQL'
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  autor TEXT NOT NULL DEFAULT 'Fênix Cred',
  data TEXT NOT NULL,
  imagem TEXT NOT NULL DEFAULT '',
  alt TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft',
  content TEXT,
  excerpt TEXT,
  seo_title TEXT,
  meta_description TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_posts_status_data ON posts (status, data DESC);

CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS post_tags (
  post_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  nome TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
SQL
);

require_once __DIR__ . '/controllers/PostsController.php';

$results = ['tables' => 'ok'];

$email = strtolower(trim((string) ($cfg['admin_email'] ?? 'contato@fenixcredbr.com.br')));
$name = $cfg['admin_name'] ?? 'Fênix Cred';
$reset = isset($_GET['reset']) && $_GET['reset'] === '1';
$stmt = $pdo->prepare('SELECT id FROM admin_users WHERE lower(email) = :email');
$stmt->execute(['email' => $email]);
$existingAdmin = $stmt->fetch();

$generatedPassword = null;
$requested = (string) ($_GET['password'] ?? '');
$plain = $requested !== '' ? $requested : ($cfg['admin_password'] ?: bin2hex(random_bytes(8)));
$hash = password_hash($plain, PASSWORD_DEFAULT);
if ($hash === false) {
    jsonError('password_hash failed', 500);
}

if (!$existingAdmin) {
    if (empty($cfg['admin_password'])) {
        $generatedPassword = $plain;
    }
    $ins = $pdo->prepare(
        'INSERT INTO admin_users (email, password_hash, nome) VALUES (:email, :hash, :nome)'
    );
    $ins->execute([
        'email' => $email,
        'hash'  => $hash,
        'nome'  => $name,
    ]);
    $results['admin'] = 'created';
} elseif ($reset) {
    $upd = $pdo->prepare('UPDATE admin_users SET email = :email, password_hash = :hash, nome = :nome WHERE id = :id');
    $upd->execute([
        'email' => $email,
        'hash'  => $hash,
        'nome'  => $name,
        'id'    => $existingAdmin['id'],
    ]);
    $generatedPassword = $plain;
    $results['admin'] = 'reset';
} else {
    $results['admin'] = 'exists';
}

$liveConfig = dataDir() . '/config.php';
if (!is_file($liveConfig)) {
    $export = var_export([
        'site_url'       => $cfg['site_url'],
        'admin_email'    => $email,
        'admin_name'     => $name,
        'admin_password' => null,
        'seed_key'       => $cfg['seed_key'],
        'cors_origin'    => $cfg['cors_origin'] ?? 'https://fenixcredbr.com.br',
        'upload_max'     => $cfg['upload_max'] ?? 2 * 1024 * 1024,
    ], true);
    file_put_contents($liveConfig, "<?php\nreturn {$export};\n");
    @chmod($liveConfig, 0640);
    $results['config'] = 'written';
}

$seedFile = __DIR__ . '/seed-artigos.json';
$seeded = 0;
if (is_file($seedFile)) {
    $items = json_decode((string) file_get_contents($seedFile), true);
    if (is_array($items)) {
        $insert = $pdo->prepare(
            'INSERT OR IGNORE INTO posts
             (slug, titulo, descricao, autor, data, imagem, alt, status, content, excerpt, seo_title, meta_description)
             VALUES
             (:slug, :titulo, :descricao, :autor, :data, :imagem, :alt, :status, :content, :excerpt, :seo_title, :meta_description)'
        );
        foreach ($items as $item) {
            $insert->execute([
                'slug'             => $item['slug'],
                'titulo'           => $item['titulo'],
                'descricao'        => $item['descricao'],
                'autor'            => $item['autor'] ?? 'Fênix Cred',
                'data'             => $item['data'],
                'imagem'           => $item['imagem'] ?? '',
                'alt'              => $item['alt'] ?? '',
                'status'           => 'published',
                'content'          => $item['content'] ?? null,
                'excerpt'          => $item['excerpt'] ?? null,
                'seo_title'        => $item['seo_title'] ?? null,
                'meta_description' => $item['meta_description'] ?? null,
            ]);
            if ($insert->rowCount() > 0) {
                $idStmt = $pdo->prepare('SELECT id FROM posts WHERE slug = :slug');
                $idStmt->execute(['slug' => $item['slug']]);
                $id = (int) $idStmt->fetchColumn();
                syncTags($pdo, $id, $item['tags'] ?? []);
                $seeded++;
            }
        }
    }
}
$results['seeded'] = $seeded;

if ($generatedPassword) {
    $results['admin_email'] = $email;
    $results['admin_password'] = $generatedPassword;
    $results['notice'] = 'Guarde a senha. Ela não será mostrada de novo.';
}

$results['admin_url'] = ($cfg['site_url'] ?? '') . '/admin/index.php';
$results['db_path'] = loadConfig()['db_path'] ?? null;
$results['admin_count'] = (int) $pdo->query('SELECT COUNT(*) FROM admin_users')->fetchColumn();
jsonResponse($results);
