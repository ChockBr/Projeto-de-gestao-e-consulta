import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../store/auth';

function Navbar() {
  const { token, email, logout, isAdmin, isAgent } = useAuth();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">Engeman Imóveis</Link>
        <div className="navbar-menu">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              Imóveis
          </Link>

          <Link to="/favorites" className={`nav-link ${location.pathname === '/favorites' ? 'active' : ''}`}>
              Favoritos
          </Link>

          {token && (isAdmin || isAgent) && (
            <>
              <Link to="/manage" className={`nav-link ${location.pathname === '/manage' ? 'active' : ''}`}>
                 Gestão
              </Link>
            </>
          )}

          {token && isAdmin && (
            <Link to="/admin/users" className={`nav-link ${location.pathname === '/admin/users' ? 'active' : ''}`}>
                 Usuários
            </Link>
          )}

          {token ? (
            <div className="user-info">
              <span>{email}</span>
              <button className="button-secondary" onClick={() => { logout(); window.location.href = '/'; }}>
                Sair
              </button>
            </div>
          ) : (
            <Link to="/login" className="button">Entrar</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
