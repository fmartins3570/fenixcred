const ALLOWED = new Set([
  "P", "BR", "HR", "H2", "H3", "H4",
  "STRONG", "B", "EM", "I", "U",
  "UL", "OL", "LI", "BLOCKQUOTE",
  "A", "IMG", "FIGURE", "FIGCAPTION",
  "TABLE", "THEAD", "TBODY", "TR", "TH", "TD",
]);

const ATTRS = {
  A: ["href", "title", "target", "rel"],
  IMG: ["src", "alt", "title", "width", "height", "loading"],
  TH: ["scope", "colspan", "rowspan"],
  TD: ["colspan", "rowspan"],
};

export function sanitizeHtml(html) {
  if (!html || typeof html !== "string") return "";
  const template = document.createElement("template");
  template.innerHTML = html;
  clean(template.content);
  return template.innerHTML;
}

function clean(node) {
  [...node.childNodes].forEach((child) => {
    if (child.nodeType === Node.COMMENT_NODE) {
      child.remove();
      return;
    }
    if (child.nodeType !== Node.ELEMENT_NODE) return;
    if (!ALLOWED.has(child.tagName)) {
      child.replaceWith(...child.childNodes);
      return;
    }
    [...child.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      const allowed = ATTRS[child.tagName] || [];
      if (name.startsWith("on") || name === "style" || !allowed.includes(name)) {
        child.removeAttribute(attr.name);
        return;
      }
      if ((name === "href" || name === "src") && /^\s*javascript:/i.test(attr.value)) {
        child.removeAttribute(attr.name);
      }
    });
    if (child.tagName === "A") child.setAttribute("rel", "noopener noreferrer");
    clean(child);
  });
}
