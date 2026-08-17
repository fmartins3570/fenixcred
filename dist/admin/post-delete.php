<?php

declare(strict_types=1);

require_once __DIR__ . '/includes/auth.php';
requireLogin();

$pdo = getDB();
$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
$stmt = $pdo->prepare('SELECT id, titulo FROM posts WHERE id = :id');
$stmt->execute(['id' => $id]);
$post = $stmt->fetch();
if (!$post) {
    header('Location: dashboard.php');
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    verifyCsrf();
    $pdo->prepare('DELETE FROM posts WHERE id = :id')->execute(['id' => $id]);
    header('Location: dashboard.php');
    exit;
}

$pageTitle = 'Apagar artigo';
require __DIR__ . '/includes/header.php';
?>

<section class="admin-card admin-card--narrow">
  <h1>Apagar artigo</h1>
  <p>Isso remove <strong><?= htmlspecialchars($post['titulo']) ?></strong> do site na hora.</p>
  <form method="post" class="admin-form">
    <?= csrfField() ?>
    <div class="admin-toolbar">
      <button type="submit" class="admin-btn admin-btn--danger">Apagar</button>
      <a href="dashboard.php">Cancelar</a>
    </div>
  </form>
</section>

<?php require __DIR__ . '/includes/footer.php'; ?>
