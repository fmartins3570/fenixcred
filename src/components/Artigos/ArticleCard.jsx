import { formatDateLong } from "../../data/artigos";

function ArticleCard({ artigo, headingLevel = "h2", compact = false }) {
  const Heading = headingLevel;
  const href = `/artigos/${artigo.slug}`;

  return (
    <article className={`artigos-card${compact ? " artigos-card--compact" : ""}`}>
      <img
        src={artigo.imagem}
        alt={artigo.alt}
        width={1280}
        height={720}
        loading="lazy"
        decoding="async"
        className="artigos-card-image"
      />
      <div className="artigos-card-body">
        <span className="artigos-card-tag">{artigo.tags[0]}</span>
        <Heading className="artigos-card-title">
          <a href={href}>{artigo.titulo}</a>
        </Heading>
        {!compact && <p className="artigos-card-excerpt">{artigo.descricao}</p>}
        <div className="artigos-card-meta">
          <span>{artigo.autor}</span>
          <time dateTime={artigo.data}>{formatDateLong(artigo.data)}</time>
        </div>
        {compact && <span className="artigos-card-cta">Ler artigo</span>}
      </div>
    </article>
  );
}

export default ArticleCard;
