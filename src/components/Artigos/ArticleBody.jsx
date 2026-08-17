import { Fragment } from "react";
import { sanitizeHtml } from "../../utils/sanitizeHtml";

function clean(text) {
  return text.replace(/\s{2,}/g, " ").trim();
}

// Internal links keep the reader inside the cluster; external ones must be https.
const isSafeHref = (href) => /^\/(?!\/)/.test(href) || /^https:\/\//i.test(href);

function renderInline(text) {
  return clean(text)
    .split(/(\[[^\]]+\]\([^)\s]+\)|\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*)/g)
    .map((part, i) => {
      const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
      if (link) {
        const href = link[2].trim();
        if (!isSafeHref(href)) return <Fragment key={i}>{link[1]}</Fragment>;
        const external = href.startsWith("https://");
        return (
          <a
            key={i}
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {link[1].trim()}
          </a>
        );
      }
      const bold = /^\*\*\*?([^*]+)\*\*\*?$/.exec(part);
      if (bold) return <strong key={i}>{bold[1].trim()}</strong>;
      const italic = /^\*([^*]+)\*$/.exec(part);
      if (italic) return <em key={i}>{italic[1].trim()}</em>;
      return <Fragment key={i}>{part}</Fragment>;
    });
}

const isListItem = (p) => /^[-•]\s+/.test(p);
const stripBullet = (p) => p.replace(/^[-•]\s+/, "");
const isOrderedItem = (p) => /^\d+\.\s+/.test(p);
const stripOrdered = (p) => p.replace(/^\d+\.\s+/, "");
const isTable = (p) => /^<table[\s>]/i.test(p);
const HEADING_TAG = /^<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>$/i;
const stripTags = (s) => s.replace(/<[^>]+>/g, "");

function headingInfo(p) {
  const match = HEADING_TAG.exec(p);
  if (!match) return null;
  const text = clean(stripTags(match[2])).replace(/^[*_]+|[*_]+$/g, "").trim();
  if (!text) return null;
  const tagLevel = Number(match[1]);
  return { level: tagLevel <= 4 ? 2 : 3, text };
}

function ProseTable({ html }) {
  const rows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map((row) =>
    [...row[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((cell) => cell[1].trim()),
  );
  if (rows.length === 0) return null;
  const hasHead = /<thead/i.test(html);
  const head = hasHead ? rows[0] : null;
  const body = hasHead ? rows.slice(1) : rows;

  return (
    <div className="artigos-table-wrap">
      <table className="artigos-table">
        {head && (
          <thead>
            <tr>
              {head.map((cell, i) => (
                <th key={i}>{renderInline(stripTags(cell))}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {body.map((cells, ri) => (
            <tr key={ri}>
              {cells.map((cell, ci) => (
                <td key={ci}>{renderInline(stripTags(cell))}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ArticleBody({ sections, content }) {
  if (content && content.trim() !== "") {
    return (
      <div
        className="artigos-prose"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
      />
    );
  }
  if (!sections || sections.length === 0) return null;

  return (
    <div className="artigos-prose">
      {sections.map((section, si) => {
        const nodes = [];
        let bullets = [];
        let ordered = [];

        const flushBullets = () => {
          if (bullets.length === 0) return;
          nodes.push(
            <ul key={`ul-${si}-${nodes.length}`}>
              {bullets.map((item, k) => (
                <li key={k}>{renderInline(item)}</li>
              ))}
            </ul>,
          );
          bullets = [];
        };

        const flushOrdered = () => {
          if (ordered.length === 0) return;
          nodes.push(
            <ol key={`ol-${si}-${nodes.length}`}>
              {ordered.map((item, k) => (
                <li key={k}>{renderInline(item)}</li>
              ))}
            </ol>,
          );
          ordered = [];
        };

        const flushLists = () => {
          flushBullets();
          flushOrdered();
        };

        section.paragraphs.forEach((raw, pi) => {
          const p = raw.trim();
          if (!p) return;

          if (isTable(p)) {
            flushLists();
            nodes.push(<ProseTable key={`t-${si}-${pi}`} html={p} />);
            return;
          }

          const heading = headingInfo(p);
          if (heading) {
            flushLists();
            const Tag = heading.level === 2 ? "h2" : "h3";
            nodes.push(
              <Tag key={`h-${si}-${pi}`}>{heading.text}</Tag>,
            );
            return;
          }

          if (isListItem(p)) {
            flushOrdered();
            bullets.push(stripBullet(p));
            return;
          }

          if (isOrderedItem(p)) {
            flushBullets();
            ordered.push(stripOrdered(p));
            return;
          }

          flushLists();
          nodes.push(
            <p key={`p-${si}-${pi}`}>{renderInline(p)}</p>,
          );
        });

        flushLists();

        return (
          <section key={si}>
            {section.heading && <h2>{section.heading}</h2>}
            {nodes}
          </section>
        );
      })}
    </div>
  );
}

export default ArticleBody;
