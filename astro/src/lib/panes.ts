import { getCollection } from "astro:content";

export type PaneLink = { id: string; href: string; title: string; order: string };
export type SessionGroup = {
  slug: string;
  title: string;
  date?: string;
  panes: PaneLink[];
};

const DATE_RE = /^(\d{4}-\d{2}-\d{2})-?/;

function prettify(slug: string) {
  return (
    slug
      .replace(DATE_RE, "")
      .replace(/[-_]/g, " ")
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase()) || slug
  );
}

/**
 * Build the session tree from the panes collection.
 * Session = first path segment (folder); response = the file within.
 * Sessions are newest-first; responses sort by filename prefix.
 */
export async function getSessions(): Promise<SessionGroup[]> {
  const entries = await getCollection("panes");
  const groups = new Map<string, SessionGroup>();

  for (const e of entries) {
    const parts = e.id.split("/");
    const sessionSlug = parts.length > 1 ? parts[0] : "ungrouped";
    const order = parts.length > 1 ? parts.slice(1).join("/") : e.id;
    const data = e.data as Record<string, unknown>;

    if (!groups.has(sessionSlug)) {
      const m = sessionSlug.match(DATE_RE);
      groups.set(sessionSlug, {
        slug: sessionSlug,
        title: sessionSlug === "ungrouped" ? "Ungrouped" : prettify(sessionSlug),
        date: m?.[1],
        panes: [],
      });
    }
    groups.get(sessionSlug)!.panes.push({
      id: e.id,
      href: `/${e.id}`,
      title: (data?.title as string) ?? order,
      order: order.replace(/\.mdx?$/, ""),
    });
  }

  return [...groups.values()]
    .map((g) => ({ ...g, panes: g.panes.sort((a, b) => a.order.localeCompare(b.order)) }))
    .sort((a, b) => b.slug.localeCompare(a.slug));
}
