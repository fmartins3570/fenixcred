import { ARTIGOS, getArtigoBySlug, getRelatedArtigos } from "../data/artigos";
import { ARTIGOS_CONTENT } from "../data/artigos-content";

const API = "/api/index.php";

async function apiFetch(route) {
  const res = await fetch(`${API}?r=${encodeURIComponent(route)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API ${res.status}`);
  const json = await res.json();
  if (!json || typeof json !== "object") throw new Error("API inválida");
  return json.data;
}

/** Remote wins per slug; static-only posts stay in the catalog. */
function mergeCatalog(remote) {
  const bySlug = new Map(ARTIGOS.map((artigo) => [artigo.slug, artigo]));
  remote.forEach((post) => {
    if (post?.slug) bySlug.set(post.slug, post);
  });
  return [...bySlug.values()].sort((a, b) => String(b.data).localeCompare(String(a.data)));
}

export async function listArtigos() {
  try {
    const remote = await apiFetch("/posts");
    if (Array.isArray(remote) && remote.length) return mergeCatalog(remote);
  } catch {
    // Vite local / API offline — keep static catalog
  }
  return ARTIGOS;
}

export async function loadArtigo(slug) {
  const fallback = {
    post: getArtigoBySlug(slug),
    content: null,
    sections: ARTIGOS_CONTENT[slug],
    related: getRelatedArtigos(slug),
  };

  try {
    const post = await apiFetch(`/posts/${slug}`);
    if (post === null) {
      // Artigo do catálogo estático não existe no banco do /admin. Sem este
      // fallback o React apaga o conteúdo pré-renderizado e mostra "não
      // encontrado" — o Googlebot renderiza isso e marca soft 404.
      return fallback.post ? fallback : { post: undefined, content: null, sections: undefined, related: [] };
    }
    const [body, related] = await Promise.all([
      apiFetch(`/posts/${slug}/content`).catch(() => ({ content: null, sections: [] })),
      apiFetch(`/posts/${slug}/related`).catch(() => []),
    ]);
    return {
      post,
      content: body?.content || post?.content || null,
      sections: body?.sections?.length ? body.sections : ARTIGOS_CONTENT[slug],
      related: Array.isArray(related) && related.length ? related : getRelatedArtigos(slug),
    };
  } catch {
    return fallback;
  }
}
