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

export async function listArtigos() {
  try {
    const remote = await apiFetch("/posts");
    if (Array.isArray(remote)) return remote;
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
      return { post: undefined, content: null, sections: undefined, related: [] };
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
