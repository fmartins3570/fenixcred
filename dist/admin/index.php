<?php

declare(strict_types=1);

require_once __DIR__ . '/includes/auth.php';

if (!empty($_SESSION['admin_user_id'])) {
    header('Location: dashboard.php');
    exit;
}

$error = '';

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    verifyCsrf();
    $email = strtolower(trim((string) ($_POST['email'] ?? '')));
    $password = (string) ($_POST['password'] ?? '');

    if ($email !== '' && $password !== '') {
        try {
            $pdo = getDB();
            $stmt = $pdo->prepare('SELECT id, email, password_hash, nome FROM admin_users WHERE lower(email) = :email');
            $stmt->execute(['email' => $email]);
            $user = $stmt->fetch();
            if ($user && is_string($user['password_hash']) && password_verify($password, $user['password_hash'])) {
                $_SESSION['admin_user_id'] = $user['id'];
                $_SESSION['admin_user_nome'] = $user['nome'];
                $_SESSION['admin_user_email'] = $user['email'];
                header('Location: /admin/dashboard.php');
                exit;
            }
            $count = (int) $pdo->query('SELECT COUNT(*) FROM admin_users')->fetchColumn();
            $error = $count === 0
                ? 'Nenhum usuário no banco deste painel. Rode a migração de novo.'
                : 'Email ou senha incorretos.';
        } catch (Throwable $e) {
            $error = 'Não foi possível ler o banco do painel.';
        }
    } else {
        $error = 'Email ou senha incorretos.';
    }
}

$pageTitle = 'Entrar';
require __DIR__ . '/includes/header.php';
?>

<section class="admin-card admin-card--narrow">
  <h1>Entrar no painel</h1>
  <p class="admin-help">Publique artigos sem novo deploy. O site lê a lista na hora.</p>
  <?php if ($error): ?>
    <p class="admin-error"><?= htmlspecialchars($error) ?></p>
  <?php endif; ?>
  <form method="post" action="/admin/index.php" class="admin-form" autocomplete="on">
    <?= csrfField() ?>
    <label>Email
      <input type="email" name="email" required autofocus autocomplete="username" value="<?= htmlspecialchars($_POST['email'] ?? 'contato@fenixcredbr.com.br') ?>">
    </label>
    <label>Senha
      <input type="password" name="password" required autocomplete="current-password">
    </label>
    <button type="submit" class="admin-btn">Entrar</button>
  </form>
</section>

<?php require __DIR__ . '/includes/footer.php'; ?>
