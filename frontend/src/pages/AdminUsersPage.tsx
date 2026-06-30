import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError, authRequest } from '../utils/api';
import { useAuth } from '../store/auth';
import Icon from '../components/Icon';

function AdminUsersPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('ROLE_CLIENT');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!selectedRole) {
      setError('Selecione um perfil para o usuário.');
      return;
    }

    setLoading(true);
    try {
      await authRequest(token, '/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({ email, password, roles: [selectedRole] }),
      });
      setMessage('Usuário criado com sucesso.');
      setEmail('');
      setPassword('');
      setSelectedRole('ROLE_CLIENT');
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        logout();
        navigate('/login?reason=session-expired', { replace: true });
        return;
      }

      const message = err instanceof Error ? err.message : '';
      setError(message || 'Não foi possível criar o usuário. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1> Administração de Usuários</h1>

      <div className="permission-section">
        <div className="permission-label allowed"><Icon name="checkCircle" size={14} /> Somente ADMIN</div>
        <p>Administradores podem cadastrar novos usuários e corretores.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="new-user-email">E-mail</label>
          <input
            id="new-user-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="novo.usuario@empresa.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="new-user-password">Senha</label>
          <input
            id="new-user-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="mínimo 6 caracteres"
          />
        </div>

        <div className="form-group">
          <label>Perfil</label>
          <div className="role-selector">
            <button
              type="button"
              className={`role-badge-option ${selectedRole === 'ROLE_ADMIN' ? 'selected' : ''}`}
              onClick={() => setSelectedRole('ROLE_ADMIN')}
            >
              ADMIN
            </button>
            <button
              type="button"
              className={`role-badge-option ${selectedRole === 'ROLE_AGENT' ? 'selected' : ''}`}
              onClick={() => setSelectedRole('ROLE_AGENT')}
            >
              CORRETOR
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Criando...' : 'Criar usuário'}
        </button>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default AdminUsersPage;
