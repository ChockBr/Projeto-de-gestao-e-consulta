import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { PropertyResponse } from '../types';
import { apiRequest } from '../utils/api';
import { getGuestFavoriteIds, removeGuestFavorite } from '../utils/favorites';
import Icon from '../components/Icon';

function FavoritesPage() {
  const [favorites, setFavorites] = useState<PropertyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const conditionLabel: Record<string, string> = {
    LANCAMENTO: 'Lançamento',
    CONSTRUCAO: 'Construção',
    PRONTO: 'Pronto',
  };

  const loadFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest('/api/properties');
      const allProperties: PropertyResponse[] = response.content || [];
      const favoriteIds = getGuestFavoriteIds();
      setFavorites(allProperties.filter((item) => favoriteIds.includes(item.id)));
    } catch (err) {
      setError('Erro ao carregar favoritos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleRemoveFavorite = (propertyId: number) => {
    removeGuestFavorite(propertyId);
    setFavorites((current) => current.filter((item) => item.id !== propertyId));
  };

  return (
    <div className="page-container">
      <h1><Icon name="heart" size={20} /> Meus Favoritos</h1>

      <div className="permission-section">
        <div className="permission-label allowed"><Icon name="checkCircle" size={14} /> Clientes</div>
        <p>Não precisa de cadastro: visitantes também podem favoritar e consultar seus imóveis salvos neste navegador.</p>
      </div>

      {loading && <div className="loading"><div className="spinner"></div><p>Carregando favoritos...</p></div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && favorites.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon"><Icon name="heartBroken" size={42} /></div>
          <div className="empty-state-title">Nenhum favorito ainda</div>
          <div className="empty-state-text">Explore imóveis e marque seus favoritos para visualizá-los aqui</div>
        </div>
      )}

      <ul className="property-list">
        {favorites.map((property: PropertyResponse) => (
          <li key={property.id} className="property-card">
            <div className="property-image">
              {property.imageUrls[0] ? (
                <img src={property.imageUrls[0]} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                '[IMAGEM DO IMÓVEL]'
              )}
            </div>
            <div className="property-content">
              <h3 className="property-title">{property.title}</h3>
              <div className="property-meta">
                <span className="meta-tag"><Icon name="location" /> {property.type}</span>
                <span className="meta-tag"><Icon name="bed" /> {property.bedrooms} quartos</span>
                <span className="meta-tag"><Icon name="fileText" /> {conditionLabel[property.enterpriseCondition] || 'Pronto'}</span>
              </div>
              <div className="property-price">R$ {property.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <p style={{ fontSize: '13px', color: '#666', margin: '8px 0' }}>
                {property.description.substring(0, 80)}...
              </p>
              <div className="property-actions">
                <Link to={`/properties/${property.id}`} className="button">
                  Ver Detalhes
                </Link>
                <button className="button-danger" onClick={() => handleRemoveFavorite(property.id)}><Icon name="xCircle" /> Remover</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FavoritesPage;
