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
    $email = trim((string) ($_POST['email'] ?? ''));
    $password = (string) ($_POST['password'] ?? '');

    if ($email !== '' && $password !== '') {
        $pdo = getDB();
        $stmt = $pdo->prepare('SELECT id, email, password_hash, nome FROM admin_users WHERE email = :email');
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch();
        if ($user && password_verify($password, $user['password_hash'])) {
            session_regenerate_id(true);
            $_SESSION['admin_user_id'] = $user['id'];
            $_SESSION['admin_user_nome'] = $user['nome'];
            $_SESSION['admin_user_email'] = $user['email'];
            header('Location: dashboard.php');
            exit;
        }
    }
    $error = 'Email ou senha incorretos.';
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
  <form method="post" class="admin-form">
    <?= csrfField() ?>
    <label>Email
      <input type="email" name="email" required autofocus value="<?= htmlspecialchars($_POST['email'] ?? '') ?>">
    </label>
    <label>Senha
      <input type="password" name="password" required>
    </label>
    <button type="submit" class="admin-btn">Entrar</button>
  </form>
</section>

<?php require __DIR__ . '/includes/footer.php'; ?>
