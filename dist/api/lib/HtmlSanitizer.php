<?php

declare(strict_types=1);

final class HtmlSanitizer
{
    private const TAGS = [
        'p', 'br', 'hr', 'h2', 'h3', 'h4',
        'strong', 'b', 'em', 'i', 'u',
        'ul', 'ol', 'li', 'blockquote',
        'a', 'img', 'figure', 'figcaption',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
    ];

    private const ATTRS = [
        'a'  => ['href', 'title', 'target', 'rel'],
        'img'=> ['src', 'alt', 'title', 'width', 'height', 'loading'],
        'th' => ['scope', 'colspan', 'rowspan'],
        'td' => ['colspan', 'rowspan'],
    ];

    public function sanitize(string $html): string
    {
        $html = trim($html);
        if ($html === '') {
            return '';
        }

        $allowed = array_flip(self::TAGS);
        $dom = new DOMDocument('1.0', 'UTF-8');
        libxml_use_internal_errors(true);
        $dom->loadHTML(
            '<?xml encoding="UTF-8"><div id="__root__">' . $html . '</div>',
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD | LIBXML_NOERROR | LIBXML_NOWARNING
        );
        libxml_clear_errors();

        $root = $dom->getElementById('__root__');
        if (!$root) {
            return '';
        }

        $this->walk($root, $allowed);

        $out = '';
        foreach (iterator_to_array($root->childNodes) as $child) {
            $out .= $dom->saveHTML($child);
        }
        return trim($out);
    }

    private function walk(DOMNode $node, array $allowed): void
    {
        foreach (iterator_to_array($node->childNodes) as $child) {
            if ($child instanceof DOMComment) {
                $node->removeChild($child);
                continue;
            }
            if (!$child instanceof DOMElement) {
                continue;
            }
            $tag = strtolower($child->tagName);
            if (!isset($allowed[$tag])) {
                while ($child->firstChild) {
                    $node->insertBefore($child->firstChild, $child);
                }
                $node->removeChild($child);
                continue;
            }
            $this->cleanAttrs($child, $tag);
            $this->walk($child, $allowed);
        }
    }

    private function cleanAttrs(DOMElement $el, string $tag): void
    {
        $ok = self::ATTRS[$tag] ?? [];
        $remove = [];
        foreach (iterator_to_array($el->attributes) as $attr) {
            $name = strtolower($attr->name);
            if (str_starts_with($name, 'on') || $name === 'style' || !in_array($name, $ok, true)) {
                $remove[] = $attr->name;
                continue;
            }
            if (in_array($name, ['href', 'src'], true)) {
                $value = trim($attr->value);
                if (preg_match('#^\s*javascript:#i', $value)) {
                    $remove[] = $attr->name;
                }
            }
        }
        foreach ($remove as $name) {
            $el->removeAttribute($name);
        }
        if ($tag === 'a') {
            $el->setAttribute('rel', 'noopener noreferrer');
        }
    }
}
