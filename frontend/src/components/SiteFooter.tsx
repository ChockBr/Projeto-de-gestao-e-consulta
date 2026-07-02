import Icon from './Icon';

function SiteFooter() {
  return (
    <footer className="home-footer">
      <div className="home-footer-grid">
        <div>
          <span className="home-footer-eyebrow">Atendimento digital</span>
          <h2 className="home-footer-title">Encontre oportunidades com suporte em cada etapa.</h2>
          <p className="home-footer-text">
            Plataforma ficticia com consultoria imobiliaria, acompanhamento remoto e acesso rapido ao app.
          </p>
        </div>

        <div>
          <h3 className="home-footer-heading"><Icon name="instagram" /> Redes sociais</h3>
          <div className="home-footer-links">
            <a href="https://instagram.com/casavista.global" target="_blank" rel="noreferrer">@casavista.global</a>
            <a href="https://linkedin.com/company/casavista" target="_blank" rel="noreferrer"><Icon name="linkedin" /> CasaVista no LinkedIn</a>
          </div>
        </div>

        <div>
          <h3 className="home-footer-heading"><Icon name="download" /> App</h3>
          <div className="home-footer-links">
            <a href="https://app.casavista.example" target="_blank" rel="noreferrer">Baixar app CasaVista</a>
            <a href="https://app.casavista.example/invest" target="_blank" rel="noreferrer">Area do investidor</a>
          </div>
        </div>

        <div>
          <h3 className="home-footer-heading"><Icon name="globe" /> Paises onde atua</h3>
          <p className="home-footer-text">Brasil, Portugal, Espanha e Emirados Arabes Unidos.</p>
          <h3 className="home-footer-heading"><Icon name="phone" /> Contato</h3>
          <p className="home-footer-text">+55 (11) 4004-9090</p>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;