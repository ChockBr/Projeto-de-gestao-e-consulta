import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { PropertyResponse } from '../types';
import { apiRequest } from '../utils/api';
import { isGuestFavorite, toggleGuestFavorite } from '../utils/favorites';
import Icon from '../components/Icon';
import SiteFooter from '../components/SiteFooter';

function PropertyListPage() {
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [minBedrooms, setMinBedrooms] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const conditionLabel: Record<string, string> = {
    LANCAMENTO: 'Lançamento',
    CONSTRUCAO: 'Construção',
    PRONTO: 'Pronto',
  };

  useEffect(() => {
    setFavoriteIds(properties.filter((item) => isGuestFavorite(item.id)).map((item) => item.id));
  }, [properties]);

  const handleToggleFavorite = (propertyId: number) => {
    const nowFavorite = toggleGuestFavorite(propertyId);
    setFavoriteIds((current) => {
      if (nowFavorite) {
        return current.includes(propertyId) ? current : [...current, propertyId];
      }
      return current.filter((id) => id !== propertyId);
    });
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (query) params.append('query', query);
        if (type) params.append('type', type);
        if (minBedrooms) params.append('minBedrooms', minBedrooms);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        
        const response = await apiRequest(`/api/properties?${params.toString()}`);
        setProperties(response.content || []);
      } catch (err) {
        setError('Erro ao carregar imóveis.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [query, type, minBedrooms, minPrice, maxPrice]);

  return (
    <div className="page-container home-page">
      <h1>Explorar Imóveis</h1>

      <div className="controls">
        <div className="search-box">
          <input 
            className="search-input"
            value={query} 
            onChange={e => setQuery(e.target.value)} 
            placeholder="Buscar por nome ou código do imóvel..." 
          />
        </div>
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="">Tipo - Todos</option>
          <option value="casa">Casa</option>
          <option value="apartamento">Apartamento</option>
          <option value="terreno">Terreno</option>
          <option value="comercial">Comercial</option>
        </select>
        <input
          type="number"
          min="0"
          placeholder="Quartos mín"
          value={minBedrooms}
          onChange={e => setMinBedrooms(e.target.value)}
        />
        <input 
          type="number"
          placeholder="Preço mín" 
          value={minPrice} 
          onChange={e => setMinPrice(e.target.value)}
        />
        <input 
          type="number"
          placeholder="Preço máx" 
          value={maxPrice} 
          onChange={e => setMaxPrice(e.target.value)}
        />
      </div>

      {loading && <div className="loading"><div className="spinner"></div><p>Carregando imóveis...</p></div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && properties.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon"><Icon name="xCircle" size={42} /></div>
          <div className="empty-state-title">Nenhum imóvel encontrado</div>
          <div className="empty-state-text">Tente ajustar os filtros ou faça uma nova busca</div>
        </div>
      )}

      <ul className="property-list">
        {properties.map((property) => (
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
                <span className="meta-tag"><Icon name="bath" /> {property.bathrooms} banheiros</span>
                <span className="meta-tag"><Icon name="fileText" /> {conditionLabel[property.enterpriseCondition] || 'Pronto'}</span>
              </div>
              <div className="property-price">R$ {property.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <p style={{ fontSize: '13px', color: '#666', margin: '8px 0' }}>
                {property.address}
              </p>
              <p style={{ fontSize: '13px', color: '#666', margin: '8px 0' }}>
                {property.description.substring(0, 80)}...
              </p>
              <div className="property-actions">
                <Link to={`/properties/${property.id}`} className="button">
                  Ver Detalhes
                </Link>
                <button
                  type="button"
                  className={favoriteIds.includes(property.id) ? 'button-danger' : 'button-secondary'}
                  onClick={() => handleToggleFavorite(property.id)}
                >
                  {favoriteIds.includes(property.id)
                    ? <><Icon name="heartBroken" /> Desfavoritar</>
                    : <><Icon name="heart" /> Favoritar</>}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <SiteFooter />
    </div>
  );
}

export default PropertyListPage;
