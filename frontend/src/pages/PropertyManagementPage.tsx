import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { PropertyResponse } from '../types';
import { ApiError, authRequest } from '../utils/api';
import { useAuth } from '../store/auth';
import Icon from '../components/Icon';
import SiteFooter from '../components/SiteFooter';

interface PropertyFormState {
  title: string;
  type: string;
  enterpriseCondition: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  suites: string;
  parkingSpaces: string;
  totalArea: string;
  privateArea: string;
  address: string;
  brokerName: string;
  description: string;
  imageUrls: string;
}

const EMPTY_FORM: PropertyFormState = {
  title: '',
  type: 'apartamento',
  enterpriseCondition: 'PRONTO',
  price: '',
  bedrooms: '0',
  bathrooms: '0',
  suites: '0',
  parkingSpaces: '0',
  totalArea: '',
  privateArea: '',
  address: '',
  brokerName: '',
  description: '',
  imageUrls: '',
};

function PropertyManagementPage() {
  const { token } = useAuth();
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingProperty, setEditingProperty] = useState<PropertyResponse | null>(null);
  const [formState, setFormState] = useState<PropertyFormState>(EMPTY_FORM);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const loadProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authRequest(token, '/api/properties/manage');
      setProperties(response.content || []);
    } catch (err) {
      setError('Erro ao carregar seus imóveis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [token]);

  const updateField = (field: keyof PropertyFormState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const openCreateForm = () => {
    setEditingProperty(null);
    setFormState(EMPTY_FORM);
    setUploadedImages([]);
    setMessage(null);
    setError(null);
    setFormOpen(true);
  };

  const openEditForm = (property: PropertyResponse) => {
    setEditingProperty(property);
    setFormState({
      title: property.title,
      type: property.type,
      enterpriseCondition: property.enterpriseCondition || 'PRONTO',
      price: String(property.price),
      bedrooms: String(property.bedrooms),
      bathrooms: String(property.bathrooms),
      suites: String(property.suites),
      parkingSpaces: String(property.parkingSpaces),
      totalArea: String(property.totalArea),
      privateArea: String(property.privateArea),
      address: property.address,
      brokerName: property.brokerName || '',
      description: property.description,
      imageUrls: property.imageUrls.filter((item) => !item.startsWith('data:')).join('\n'),
    });
    setUploadedImages(property.imageUrls.filter((item) => item.startsWith('data:')));
    setMessage(null);
    setError(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingProperty(null);
    setFormState(EMPTY_FORM);
    setUploadedImages([]);
  };

  const buildPayload = () => ({
    title: formState.title.trim(),
    type: formState.type,
    enterpriseCondition: formState.enterpriseCondition,
    price: Number(formState.price),
    bedrooms: Number(formState.bedrooms),
    bathrooms: Number(formState.bathrooms),
    suites: Number(formState.suites),
    parkingSpaces: Number(formState.parkingSpaces),
    totalArea: Number(formState.totalArea),
    privateArea: Number(formState.privateArea),
    address: formState.address.trim(),
    brokerName: formState.brokerName.trim(),
    description: formState.description.trim(),
    imageUrls: [
      ...formState.imageUrls.split('\n').map((item) => item.trim()).filter(Boolean),
      ...uploadedImages,
    ],
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) {
      return;
    }

    const dataUrls = await Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.onerror = () => reject(new Error(`Não foi possível carregar a imagem ${file.name}.`));
            reader.readAsDataURL(file);
          })
      )
    );

    setUploadedImages((current) => [...current, ...dataUrls.filter(Boolean)]);
    event.target.value = '';
  };

  const removeUploadedImage = (index: number) => {
    setUploadedImages((current) => current.filter((_, currentIndex) => currentIndex !== index));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const payload = buildPayload();
      if (!payload.title || !payload.address || !payload.description || !payload.brokerName) {
        setError('Preencha título, endereço, nome do corretor e descrição do imóvel.');
        return;
      }

      await authRequest(token, editingProperty ? `/api/properties/${editingProperty.id}` : '/api/properties', {
        method: editingProperty ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      });

      setMessage(editingProperty ? 'Imóvel atualizado com sucesso.' : 'Imóvel criado com sucesso.');
      closeForm();
      await loadProperties();
    } catch (err) {
      const apiError = err instanceof ApiError ? err : null;
      setError(apiError?.message || 'Não foi possível salvar o imóvel.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (property: PropertyResponse) => {
    setError(null);
    setMessage(null);
    try {
      await authRequest(token, `/api/properties/${property.id}/active?active=${String(!property.active)}`, {
        method: 'PATCH',
      });
      setMessage(property.active ? 'Imóvel desativado com sucesso.' : 'Imóvel ativado com sucesso.');
      await loadProperties();
    } catch (err) {
      const apiError = err instanceof ApiError ? err : null;
      setError(apiError?.message || 'Não foi possível alterar o status do imóvel.');
    }
  };

  const handleDelete = async (property: PropertyResponse) => {
    const confirmed = window.confirm(`Deseja excluir o imóvel "${property.title}"? Esta ação não pode ser desfeita.`);
    if (!confirmed) {
      return;
    }

    setError(null);
    setMessage(null);
    try {
      await authRequest(token, `/api/properties/${property.id}`, {
        method: 'DELETE',
      });
      setMessage('Imóvel excluído com sucesso.');
      await loadProperties();
    } catch (err) {
      const apiError = err instanceof ApiError ? err : null;
      setError(apiError?.message || 'Não foi possível excluir o imóvel.');
    }
  };

  const renderImage = (property: PropertyResponse) => {
    const imageUrl = property.imageUrls[0];
    if (!imageUrl) {
      return <div className="property-image" style={{ width: '80px', height: '60px' }}>[SEM FOTO]</div>;
    }

    return <img src={imageUrl} alt={property.title} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />;
  };

  return (
    <div className="page-container">
      <h1><Icon name="settings" size={20} /> Gestão de Imóveis</h1>

      <div className="permission-section">
        <div className="permission-label allowed"><Icon name="checkCircle" size={14} /> Acesso Autorizado</div>
        <p>Você pode gerenciar seus imóveis aqui. Apenas Administradores e Corretores têm acesso a esta área.</p>
      </div>

      {message && <div className="success">{message}</div>}

      {loading && <div className="loading"><div className="spinner"></div><p>Carregando seus imóveis...</p></div>}
      {error && <div className="error">{error}</div>}

      <div className="management-panel">
        <div className="panel-header">
          <div className="panel-title">Meus Imóveis</div>
          <button className="button-success" onClick={openCreateForm}>+ Novo Imóvel</button>
        </div>

        {formOpen && (
          <form onSubmit={handleSubmit} style={{ marginBottom: '24px', display: 'grid', gap: '16px' }}>
            <div className="panel-title">{editingProperty ? 'Editar imóvel' : 'Novo imóvel'}</div>

            <div className="form-group">
              <label htmlFor="property-title">Título do anúncio</label>
              <input id="property-title" value={formState.title} onChange={(e) => updateField('title', e.target.value)} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label htmlFor="property-type">Tipo</label>
                <select id="property-type" value={formState.type} onChange={(e) => updateField('type', e.target.value)}>
                  <option value="casa">Casa</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="terreno">Terreno</option>
                  <option value="comercial">Comercial</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="property-condition">Condição do empreendimento</label>
                <select id="property-condition" value={formState.enterpriseCondition} onChange={(e) => updateField('enterpriseCondition', e.target.value)}>
                  <option value="LANCAMENTO">Lançamento</option>
                  <option value="CONSTRUCAO">Construção</option>
                  <option value="PRONTO">Pronto</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="property-price">Preço</label>
                <input id="property-price" type="number" min="0" step="0.01" value={formState.price} onChange={(e) => updateField('price', e.target.value)} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label htmlFor="property-bedrooms">Quartos</label>
                <input id="property-bedrooms" type="number" min="0" value={formState.bedrooms} onChange={(e) => updateField('bedrooms', e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="property-bathrooms">Banheiros</label>
                <input id="property-bathrooms" type="number" min="0" value={formState.bathrooms} onChange={(e) => updateField('bathrooms', e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="property-suites">Suítes</label>
                <input id="property-suites" type="number" min="0" value={formState.suites} onChange={(e) => updateField('suites', e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="property-garage">Vagas</label>
                <input id="property-garage" type="number" min="0" value={formState.parkingSpaces} onChange={(e) => updateField('parkingSpaces', e.target.value)} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label htmlFor="property-total-area">Área total (m²)</label>
                <input id="property-total-area" type="number" min="0" step="0.01" value={formState.totalArea} onChange={(e) => updateField('totalArea', e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="property-private-area">Área privativa (m²)</label>
                <input id="property-private-area" type="number" min="0" step="0.01" value={formState.privateArea} onChange={(e) => updateField('privateArea', e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="property-address">Endereço</label>
              <input id="property-address" value={formState.address} onChange={(e) => updateField('address', e.target.value)} required />
            </div>

            <div className="form-group">
              <label htmlFor="property-broker-name">Nome do corretor</label>
              <input id="property-broker-name" value={formState.brokerName} onChange={(e) => updateField('brokerName', e.target.value)} placeholder="Nome exibido no anúncio" required />
            </div>

            <div className="form-group">
              <label htmlFor="property-images">Fotos do imóvel por link</label>
              <textarea id="property-images" rows={4} value={formState.imageUrls} onChange={(e) => updateField('imageUrls', e.target.value)} placeholder="Cole uma URL por linha" />
            </div>

            <div className="form-group">
              <label htmlFor="property-image-upload">Fotos do próprio computador</label>
              <input id="property-image-upload" type="file" accept="image/*" multiple onChange={handleFileChange} />
              {uploadedImages.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginTop: '12px' }}>
                  {uploadedImages.map((imageUrl, index) => (
                    <div key={`${index}-${imageUrl.substring(0, 20)}`} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '8px' }}>
                      <img src={imageUrl} alt={`Upload ${index + 1}`} style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '6px' }} />
                      <button type="button" className="button-danger" style={{ marginTop: '8px', width: '100%', fontSize: '12px', padding: '6px 10px' }} onClick={() => removeUploadedImage(index)}>
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="property-description">Descrição detalhada</label>
              <textarea id="property-description" rows={6} value={formState.description} onChange={(e) => updateField('description', e.target.value)} required />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="button-success" disabled={saving}>
                {saving ? 'Salvando...' : editingProperty ? 'Salvar alterações' : 'Criar imóvel'}
              </button>
              <button type="button" className="button-secondary" onClick={closeForm} disabled={saving}>
                Cancelar
              </button>
            </div>
          </form>
        )}

        {!loading && !error && properties.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon"><Icon name="clipboard" size={42} /></div>
            <div className="empty-state-title">Nenhum imóvel cadastrado</div>
            <div className="empty-state-text">Crie seu primeiro imóvel para começar a vender</div>
            <button className="button-success" style={{ marginTop: '16px' }} onClick={openCreateForm}>+ Criar Imóvel</button>
          </div>
        )}

        {!loading && !error && properties.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th>Imóvel</th>
                <th>Tipo</th>
                <th>Dados</th>
                <th>Preço</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property: PropertyResponse) => (
                <tr key={property.id}>
                  <td>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      {renderImage(property)}
                      <div>
                    <strong>{property.title}</strong>
                    <br />
                        <small style={{ color: '#666' }}>{property.address}</small>
                        <br />
                        <small style={{ color: '#666' }}>{property.description.substring(0, 60)}...</small>
                      </div>
                    </div>
                  </td>
                  <td>{property.type}</td>
                  <td>{property.bedrooms}q | {property.bathrooms}b | {property.suites}s | {property.parkingSpaces}v</td>
                  <td>R$ {property.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td>
                    <span style={{
                      padding: '6px 10px',
                      borderRadius: '4px',
                      background: property.active ? '#dcfce7' : '#fee2e2',
                      color: property.active ? '#166534' : '#991b1b'
                    }}>
                      {property.active
                        ? <><Icon name="checkCircle" size={14} /> Ativo</>
                        : <><Icon name="xCircle" size={14} /> Inativo</>}
                    </span>
                  </td>
                  <td>
                    <Link to={`/properties/${property.id}`} className="button" style={{ padding: '6px 12px', fontSize: '12px', marginRight: '4px' }}>
                      Visualizar
                    </Link>
                    <button className="button" style={{ padding: '6px 12px', fontSize: '12px', marginRight: '4px' }} onClick={() => openEditForm(property)}>
                      Editar
                    </button>
                    <button className="button-danger" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleToggleActive(property)}>
                      {property.active ? 'Desativar' : 'Ativar'}
                    </button>
                    <button className="button-danger" style={{ padding: '6px 12px', fontSize: '12px', marginLeft: '4px' }} onClick={() => handleDelete(property)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}

export default PropertyManagementPage;
