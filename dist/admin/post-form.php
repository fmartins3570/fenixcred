<?php

declare(strict_types=1);

require_once __DIR__ . '/includes/auth.php';
require_once dirname(__DIR__) . '/api/lib/HtmlSanitizer.php';
require_once dirname(__DIR__) . '/api/helpers.php';
require_once dirname(__DIR__) . '/api/controllers/PostsController.php';
requireLogin();

$pdo = getDB();
$cfg = loadConfig();
$sanitizer = new HtmlSanitizer();
$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
$error = '';
$saved = false;

$post = [
    'slug' => '',
    'titulo' => '',
    'descricao' => '',
    'autor' => 'Fênix Cred',
    'data' => date('Y-m-d'),
    'imagem' => '',
    'alt' => '',
    'status' => 'draft',
    'content' => '',
    'excerpt' => '',
    'seo_title' => '',
    'meta_description' => '',
    'tags' => [],
];

if ($id > 0) {
    $stmt = $pdo->prepare('SELECT * FROM posts WHERE id = :id');
    $stmt->execute(['id' => $id]);
    $row = $stmt->fetch();
    if (!$row) {
        http_response_code(404);
        echo 'Artigo não encontrado.';
        exit;
    }
    $post = $row;
    $post['tags'] = getTagsForPost($pdo, $id);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    verifyCsrf();
    $titulo = trim((string) ($_POST['titulo'] ?? ''));
    $slug = slugify((string) ($_POST['slug'] ?? $titulo));
    $descricao = trim((string) ($_POST['descricao'] ?? ''));
    $autor = trim((string) ($_POST['autor'] ?? 'Fênix Cred')) ?: 'Fênix Cred';
    $data = trim((string) ($_POST['data'] ?? date('Y-m-d')));
    $alt = trim((string) ($_POST['alt'] ?? ''));
    $status = ($_POST['status'] ?? 'draft') === 'published' ? 'published' : 'draft';
    $content = $sanitizer->sanitize((string) ($_POST['content'] ?? ''));
    $excerpt = trim((string) ($_POST['excerpt'] ?? ''));
    $seoTitle = trim((string) ($_POST['seo_title'] ?? ''));
    $seoDesc = trim((string) ($_POST['meta_description'] ?? ''));
    $imagem = trim((string) ($_POST['imagem_atual'] ?? $post['imagem'] ?? ''));
    $tagsRaw = trim((string) ($_POST['tags'] ?? ''));
    $tags = array_values(array_filter(array_map('trim', explode(',', $tagsRaw))));

    if ($titulo === '' || $slug === '' || $descricao === '') {
        $error = 'Título, slug e descrição são obrigatórios.';
    } else {
        $dup = $pdo->prepare('SELECT id FROM posts WHERE slug = :slug AND id != :id');
        $dup->execute(['slug' => $slug, 'id' => $id]);
        if ($dup->fetch()) {
            $error = 'Esse slug já está em uso.';
        }
    }

    if ($error === '' && !empty($_FILES['imagem']['tmp_name']) && is_uploaded_file($_FILES['imagem']['tmp_name'])) {
        $max = (int) ($cfg['upload_max'] ?? 2 * 1024 * 1024);
        if ($_FILES['imagem']['size'] > $max) {
            $error = 'A imagem deve ter no máximo 2 MB.';
        } else {
            $info = getimagesize($_FILES['imagem']['tmp_name']);
            $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
            $mime = $info['mime'] ?? '';
            if (!$info || !isset($allowed[$mime])) {
                $error = 'Envie JPG, PNG ou WebP.';
            } else {
                $filename = $slug . '-' . time() . '.' . $allowed[$mime];
                $dest = rtrim($cfg['upload_dir'], '/') . '/' . $filename;
                if (!move_uploaded_file($_FILES['imagem']['tmp_name'], $dest)) {
                    $error = 'Falha ao salvar a imagem.';
                } else {
                    $imagem = rtrim($cfg['upload_url'], '/') . '/' . $filename;
                }
            }
        }
    }

    if ($error === '') {
        $fields = [
            'slug' => $slug,
            'titulo' => $titulo,
            'descricao' => $descricao,
            'autor' => $autor,
            'data' => $data,
            'imagem' => $imagem,
            'alt' => $alt,
            'status' => $status,
            'content' => $content,
            'excerpt' => $excerpt !== '' ? $excerpt : null,
            'seo_title' => $seoTitle !== '' ? $seoTitle : null,
            'meta_description' => $seoDesc !== '' ? $seoDesc : null,
        ];

        if ($id > 0) {
            $pdo->prepare(
                'UPDATE posts SET slug=:slug, titulo=:titulo, descricao=:descricao, autor=:autor, data=:data,
                 imagem=:imagem, alt=:alt, status=:status, content=:content, excerpt=:excerpt,
                 seo_title=:seo_title, meta_description=:meta_description, updated_at=CURRENT_TIMESTAMP
                 WHERE id=:id'
            )->execute($fields + ['id' => $id]);
        } else {
            $pdo->prepare(
                'INSERT INTO posts (slug, titulo, descricao, autor, data, imagem, alt, status, content, excerpt, seo_title, meta_description)
                 VALUES (:slug, :titulo, :descricao, :autor, :data, :imagem, :alt, :status, :content, :excerpt, :seo_title, :meta_description)'
            )->execute($fields);
            $id = (int) $pdo->lastInsertId();
        }

        syncTags($pdo, $id, $tags);
        header('Location: post-form.php?id=' . $id . '&saved=1');
        exit;
    }

    $post = array_merge($post, [
        'slug' => $slug,
        'titulo' => $titulo,
        'descricao' => $descricao,
        'autor' => $autor,
        'data' => $data,
        'imagem' => $imagem,
        'alt' => $alt,
        'status' => $status,
        'content' => $content,
        'excerpt' => $excerpt,
        'seo_title' => $seoTitle,
        'meta_description' => $seoDesc,
        'tags' => $tags,
    ]);
}

$saved = isset($_GET['saved']);
$pageTitle = $id ? 'Editar artigo' : 'Novo artigo';
require __DIR__ . '/includes/header.php';
$tagValue = implode(', ', $post['tags'] ?? []);
?>

<div class="admin-toolbar">
  <h1><?= $id ? 'Editar artigo' : 'Novo artigo' ?></h1>
  <a href="dashboard.php">Voltar à lista</a>
</div>

<?php if ($saved): ?>
  <p class="admin-ok">Artigo salvo. Publicado no site sem deploy.</p>
<?php endif; ?>
<?php if ($error): ?>
  <p class="admin-error"><?= htmlspecialchars($error) ?></p>
<?php endif; ?>

<form method="post" enctype="multipart/form-data" class="admin-form admin-form--editor">
  <?= csrfField() ?>
  <input type="hidden" name="imagem_atual" value="<?= htmlspecialchars((string) $post['imagem']) ?>">

  <div class="admin-grid">
    <div class="admin-col">
      <label>Título
        <input type="text" name="titulo" id="titulo" required value="<?= htmlspecialchars((string) $post['titulo']) ?>">
      </label>
      <label>Slug
        <input type="text" name="slug" id="slug" required value="<?= htmlspecialchars((string) $post['slug']) ?>">
      </label>
      <label>Descrição (card + subtítulo)
        <textarea name="descricao" rows="3" required><?= htmlspecialchars((string) $post['descricao']) ?></textarea>
      </label>
      <label>Corpo do artigo
        <textarea name="content" id="content" rows="22"><?= htmlspecialchars((string) ($post['content'] ?? '')) ?></textarea>
      </label>
    </div>

    <aside class="admin-col admin-col--side">
      <label>Status
        <select name="status">
          <option value="draft" <?= ($post['status'] ?? '') === 'draft' ? 'selected' : '' ?>>Rascunho</option>
          <option value="published" <?= ($post['status'] ?? '') === 'published' ? 'selected' : '' ?>>Publicado</option>
        </select>
      </label>
      <label>Data
        <input type="date" name="data" required value="<?= htmlspecialchars((string) $post['data']) ?>">
      </label>
      <label>Autor
        <input type="text" name="autor" value="<?= htmlspecialchars((string) $post['autor']) ?>">
      </label>
      <label>Tags (vírgula)
        <input type="text" name="tags" value="<?= htmlspecialchars($tagValue) ?>" placeholder="Crédito CLT, FGTS">
      </label>
      <label>Capa
        <input type="file" name="imagem" accept="image/jpeg,image/png,image/webp">
      </label>
      <?php if (!empty($post['imagem'])): ?>
        <img class="admin-cover" src="<?= htmlspecialchars((string) $post['imagem']) ?>" alt="">
      <?php endif; ?>
      <label>Texto alternativo da capa
        <input type="text" name="alt" value="<?= htmlspecialchars((string) $post['alt']) ?>">
      </label>
      <label>SEO title
        <input type="text" name="seo_title" value="<?= htmlspecialchars((string) ($post['seo_title'] ?? '')) ?>">
      </label>
      <label>Meta description
        <textarea name="meta_description" rows="3"><?= htmlspecialchars((string) ($post['meta_description'] ?? '')) ?></textarea>
      </label>
      <label>Excerpt (opcional)
        <textarea name="excerpt" rows="2"><?= htmlspecialchars((string) ($post['excerpt'] ?? '')) ?></textarea>
      </label>
      <button type="submit" class="admin-btn">Salvar</button>
    </aside>
  </div>
</form>

<script src="https://cdn.jsdelivr.net/npm/tinymce@6/tinymce.min.js" referrerpolicy="origin"></script>
<script>
  const titulo = document.getElementById('titulo');
  const slug = document.getElementById('slug');
  const slugTouched = <?= $id ? 'true' : 'false' ?>;
  function toSlug(value) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  if (titulo && slug && !slugTouched) {
    titulo.addEventListener('input', () => { slug.value = toSlug(titulo.value); });
  }
  if (window.tinymce) {
    tinymce.init({
      selector: '#content',
      menubar: false,
      plugins: 'lists link table',
      toolbar: 'undo redo | blocks | bold italic | bullist numlist | table link | removeformat',
      block_formats: 'Parágrafo=p; Título=h2; Subtítulo=h3',
      height: 520,
      branding: false,
      convert_urls: false,
    });
  }
</script>

<?php require __DIR__ . '/includes/footer.php'; ?>
