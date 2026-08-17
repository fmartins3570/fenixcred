<?php

declare(strict_types=1);

require_once __DIR__ . '/includes/auth.php';
requireLogin();

$pdo = getDB();
$posts = $pdo->query(
    "SELECT id, slug, titulo, data, status, updated_at FROM posts ORDER BY data DESC, id DESC"
)->fetchAll();

$pageTitle = 'Artigos';
require __DIR__ . '/includes/header.php';
?>

<div class="admin-toolbar">
  <h1>Artigos</h1>
  <a class="admin-btn" href="post-form.php">Novo artigo</a>
</div>

<?php if (!$posts): ?>
  <p class="admin-help">Nenhum artigo ainda. Crie o primeiro ou rode a migração para importar os 5 iniciais.</p>
<?php else: ?>
  <table class="admin-table">
    <thead>
      <tr>
        <th>Título</th>
        <th>Status</th>
        <th>Data</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <?php foreach ($posts as $post): ?>
        <tr>
          <td>
            <a href="post-form.php?id=<?= (int) $post['id'] ?>"><?= htmlspecialchars($post['titulo']) ?></a>
            <div class="admin-slug">/artigos/<?= htmlspecialchars($post['slug']) ?></div>
          </td>
          <td><span class="admin-status admin-status--<?= htmlspecialchars($post['status']) ?>"><?= htmlspecialchars($post['status']) ?></span></td>
          <td><?= htmlspecialchars($post['data']) ?></td>
          <td class="admin-actions">
            <?php if ($post['status'] === 'published'): ?>
              <a href="../artigos/<?= htmlspecialchars($post['slug']) ?>" target="_blank" rel="noopener">Ver</a>
            <?php endif; ?>
            <a href="post-form.php?id=<?= (int) $post['id'] ?>">Editar</a>
            <a class="admin-danger" href="post-delete.php?id=<?= (int) $post['id'] ?>">Apagar</a>
          </td>
        </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
<?php endif; ?>

<?php require __DIR__ . '/includes/footer.php'; ?>
