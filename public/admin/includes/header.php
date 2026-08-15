<?php
$pageTitle = $pageTitle ?? 'Painel';
$adminName = $_SESSION['admin_user_nome'] ?? '';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title><?= htmlspecialchars($pageTitle) ?> · Artigos Fênix Cred</title>
  <link rel="stylesheet" href="assets/admin.css" />
</head>
<body>
  <header class="admin-top">
    <a class="admin-brand" href="dashboard.php">Fênix Cred · Artigos</a>
    <?php if (!empty($_SESSION['admin_user_id'])): ?>
      <nav class="admin-nav">
        <a href="dashboard.php">Lista</a>
        <a href="post-form.php">Novo artigo</a>
        <a href="../artigos" target="_blank" rel="noopener">Ver site</a>
        <span class="admin-user"><?= htmlspecialchars($adminName) ?></span>
        <a href="logout.php">Sair</a>
      </nav>
    <?php endif; ?>
  </header>
  <main class="admin-main">
