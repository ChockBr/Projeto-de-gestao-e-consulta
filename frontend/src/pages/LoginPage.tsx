import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../store/auth';
import { ApiError, apiRequest } from '../utils/api';
import Icon from '../components/Icon';
import SiteFooter from '../components/SiteFooter';

function LoginPage() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const reason = searchParams.get('reason');
  const sessionExpired = reason === 'session-expired';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail.endsWith('@example,com')) {
      setError('E-mail inválido: use @example.com (com "."), não @example,com.');
      setLoading(false);
      return;
    }

    try {
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: normalizedEmail, password }),
      });
      login(response.token, normalizedEmail);
      navigate('/');
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setError('Login falhou. Verifique e-mail/senha e confirme se o e-mail está correto.');
      } else {
        setError('Login falhou. Verifique suas credenciais.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h1> Acesso à Plataforma</h1>

        {sessionExpired && (
          <div className="info">
            Sua sessão expirou ou ficou inválida. Faça login novamente como administrador.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input 
              id="email"
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              autoComplete="username"
              required 
              placeholder="seu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input 
              id="password"
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              autoComplete="current-password"
              required 
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          {error && <p className="error">{error}</p>}
        </form>

        <div className="permission-section" style={{ marginTop: '32px' }}>
          <h3><Icon name="clipboard" /> Contas de Teste Disponíveis:</h3>
          <table className="table" style={{ marginTop: '16px' }}>
            <thead>
              <tr>
                <th>E-mail</th>
                <th>Senha</th>
                <th>Perfil</th>
                <th>Acesso</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>admin@example.com</td>
                <td>password123</td>
                <td><span className="badge-admin">Admin</span></td>
                <td>Criar usuários, imóveis, tudo</td>
              </tr>
              <tr>
                <td>agent@example.com</td>
                <td>password123</td>
                <td><span className="badge-agent">Corretor</span></td>
                <td>Criar/editar seus imóveis</td>
              </tr>
            </tbody>
          </table>
        </div>

        <SiteFooter />
      </div>
    </div>
  );
}

export default LoginPage;
