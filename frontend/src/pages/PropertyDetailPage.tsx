import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { PropertyResponse } from '../types';
import { apiRequest } from '../utils/api';
import { isGuestFavorite, toggleGuestFavorite } from '../utils/favorites';
import Icon from '../components/Icon';
import SiteFooter from '../components/SiteFooter';

function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<PropertyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await apiRequest(`/api/properties/${id}`);
        setProperty(response);
        setIsFavorite(isGuestFavorite(response.id));
        setCurrentImageIndex(0);
        setIsLightboxOpen(false);
        setShowContactInfo(false);
      } catch (err) {
        setError('Erro ao carregar detalhes do imóvel.');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  useEffect(() => {
    if (!property || property.imageUrls.length <= 1 || isLightboxOpen) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentImageIndex((current) => (current + 1) % property.imageUrls.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [property, isLightboxOpen]);

  const handlePreviousImage = () => {
    if (!property || property.imageUrls.length <= 1) {
      return;
    }
    setCurrentImageIndex((current) => (current - 1 + property.imageUrls.length) % property.imageUrls.length);
  };

  const handleNextImage = () => {
    if (!property || property.imageUrls.length <= 1) {
      return;
    }
    setCurrentImageIndex((current) => (current + 1) % property.imageUrls.length);
  };

  useEffect(() => {
    if (!isLightboxOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLightboxOpen(false);
      }
      if (event.key === 'ArrowLeft') {
        handlePreviousImage();
      }
      if (event.key === 'ArrowRight') {
        handleNextImage();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isLightboxOpen, property]);

  if (loading) return (
    <div className="page-container">
      <div className="loading"><div className="spinner"></div><p>Carregando...</p></div>
      <SiteFooter />
    </div>
  );

  if (error) return (
    <div className="page-container">
      <div className="error">{error}</div>
      <SiteFooter />
    </div>
  );

  if (!property) return (
    <div className="page-container">
      <div className="empty-state">
        <div className="empty-state-title">Imóvel não encontrado</div>
      </div>
      <SiteFooter />
    </div>
  );

  const handleToggleFavorite = () => {
    const nowFavorite = toggleGuestFavorite(property.id);
    setIsFavorite(nowFavorite);
  };

  const activeImage = property.imageUrls[currentImageIndex] || property.imageUrls[0];
  const conditionLabel: Record<string, string> = {
    LANCAMENTO: 'Lançamento',
    CONSTRUCAO: 'Construção',
    PRONTO: 'Pronto',
  };
  const contactEmail = `contato+imovel${property.id}@exemplo-imobiliaria.com`;
  const contactPhone = '(11) 98888-0000';

  return (
    <div className="page-container">
      <h1>{property.title}</h1>

      <div className="property-detail-layout" style={{ marginBottom: '32px' }}>
        <div>
          <div className="property-image" style={{ height: '400px', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
            {activeImage ? (
              <img
                src={activeImage}
                alt={property.title}
                onClick={() => setIsLightboxOpen(true)}
                style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }}
              />
            ) : (
              '[IMAGEM DO IMÓVEL]'
            )}

            {property.imageUrls.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePreviousImage}
                  style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', borderRadius: '999px', width: '36px', height: '36px', padding: 0, background: 'rgba(0, 0, 0, 0.45)' }}
                  aria-label="Imagem anterior"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', borderRadius: '999px', width: '36px', height: '36px', padding: 0, background: 'rgba(0, 0, 0, 0.45)' }}
                  aria-label="Próxima imagem"
                >
                  ›
                </button>
              </>
            )}

            {property.imageUrls.length > 1 && (
              <div style={{ position: 'absolute', left: '50%', bottom: '12px', transform: 'translateX(-50%)', display: 'flex', gap: '8px', background: 'rgba(0, 0, 0, 0.35)', borderRadius: '999px', padding: '6px 10px' }}>
                {property.imageUrls.map((imageUrl, index) => (
                  <button
                    key={`${imageUrl}-${index}`}
                    type="button"
                    onClick={() => setCurrentImageIndex(index)}
                    style={{ width: '10px', height: '10px', padding: 0, borderRadius: '50%', border: 'none', background: currentImageIndex === index ? '#ffffff' : 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
                    aria-label={`Imagem ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="property-price" style={{ marginBottom: '16px' }}>
            R$ {property.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>

          <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
            <p><strong><Icon name="location" /> Tipo:</strong> {property.type}</p>
            <p><strong><Icon name="fileText" /> Condição:</strong> {conditionLabel[property.enterpriseCondition] || 'Pronto'}</p>
            <p><strong><Icon name="pin" /> Endereço:</strong> {property.address}</p>
            <p><strong><Icon name="bed" /> Quartos:</strong> {property.bedrooms}</p>
            <p><strong><Icon name="bath" /> Banheiros:</strong> {property.bathrooms}</p>
            <p><strong><Icon name="suite" /> Suítes:</strong> {property.suites}</p>
            <p><strong><Icon name="parking" /> Vagas:</strong> {property.parkingSpaces}</p>
            <p><strong><Icon name="area" /> Área total:</strong> {property.totalArea} m²</p>
            <p><strong><Icon name="ruler" /> Área privativa:</strong> {property.privateArea} m²</p>
            <p><strong><Icon name="tag" /> Status:</strong> 
              <span style={{ marginLeft: '8px', padding: '4px 8px', borderRadius: '4px', background: property.active ? '#dcfce7' : '#fee2e2', color: property.active ? '#166534' : '#991b1b' }}>
                {property.active
                  ? <><Icon name="checkCircle" size={14} /> Ativo</>
                  : <><Icon name="xCircle" size={14} /> Inativo</>}
              </span>
            </p>
            <p><strong><Icon name="user" /> Corretor:</strong> {property.brokerName || property.ownerEmail || 'Não informado'}</p>
          </div>

          <button
            className={isFavorite ? 'button-danger' : 'button'}
            style={{ width: '100%' }}
            onClick={handleToggleFavorite}
          >
            {isFavorite
              ? <><Icon name="heartBroken" /> Remover dos Favoritos</>
              : <><Icon name="heart" /> Adicionar aos Favoritos</>}
          </button>

          <button
            className="button-secondary"
            style={{ width: '100%', marginTop: '10px' }}
            onClick={() => setShowContactInfo((current) => !current)}
          >
            {showContactInfo ? 'Ocultar contato do vendedor' : 'Contato com vendedor'}
          </button>

          {showContactInfo && (
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', marginTop: '10px' }}>
              <p><strong>Atendimento (fictício):</strong></p>
              <p>Responsável: {property.brokerName || 'Equipe comercial'}</p>
              <p>Telefone: {contactPhone}</p>
              <p>WhatsApp: {contactPhone}</p>
              <p>E-mail: {contactEmail}</p>
            </div>
          )}
        </div>
      </div>

      <div className="management-panel">
        <h3><Icon name="fileText" /> Descrição</h3>
        <p>{property.description}</p>
      </div>

      {isLightboxOpen && activeImage && (
        <div
          className="lightbox-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Visualização ampliada das imagens"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div className="lightbox-content" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="lightbox-close"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Fechar visualização"
            >
              <Icon name="close" size={18} />
            </button>

            {property.imageUrls.length > 1 && (
              <button
                type="button"
                className="lightbox-nav lightbox-nav-left"
                onClick={handlePreviousImage}
                aria-label="Imagem anterior"
              >
                ‹
              </button>
            )}

            <img src={activeImage} alt={property.title} className="lightbox-image" />

            {property.imageUrls.length > 1 && (
              <button
                type="button"
                className="lightbox-nav lightbox-nav-right"
                onClick={handleNextImage}
                aria-label="Próxima imagem"
              >
                ›
              </button>
            )}

            <div className="lightbox-counter">
              {currentImageIndex + 1} / {property.imageUrls.length}
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}

export default PropertyDetailPage;
