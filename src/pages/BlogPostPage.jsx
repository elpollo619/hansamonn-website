import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import { getBlogPostBySlug, getBlogPosts } from '@/data/blogStore';
import { useTranslation } from '@/i18n';
import PageHero from '@/components/PageHero';

const CATEGORY_COLORS = {
  Immobilien: 'text-gray-500',
  Architektur: 'text-gray-500',
  Unternehmen: 'text-gray-500',
  Allgemein:   'text-gray-500',
};

function categoryColor(cat) {
  return CATEGORY_COLORS[cat] ?? 'text-gray-500';
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('de-CH', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const { lang } = useTranslation();
  const [post, setPost] = useState(undefined); // undefined = loading, null = not found
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    getBlogPostBySlug(slug).then((p) => setPost(p ?? null));
    getBlogPosts().then((all) => setRecentPosts(all.slice(0, 5)));
  }, [slug]);

  // Still loading
  if (post === undefined) {
    return (
      <div className="min-h-screen surface-warm flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-[#1D3D78] rounded-full animate-spin" />
      </div>
    );
  }

  // Not found
  if (post === null) {
    return <Navigate to="/neuigkeiten" replace />;
  }

  const displayTitle   = (lang === 'it' && post.title_it)   || post.title;
  const displayExcerpt = (lang === 'it' && post.excerpt_it) || post.excerpt;
  const displayContent = (lang === 'it' && post.content_it) || post.content;

  return (
    <>
      <Helmet>
        <title>{displayTitle} – Hans Amonn AG</title>
        <meta name="description" content={displayExcerpt ?? ''} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${displayTitle} – Hans Amonn AG`} />
        <meta property="og:description" content={displayExcerpt ?? ''} />
        {post.cover_image && <meta property="og:image" content={post.cover_image} />}
        <meta property="og:url" content={`https://www.hansamonn.ch/neuigkeiten/${post.slug}`} />
        <meta property="og:site_name" content="Hans Amonn AG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${displayTitle} – Hans Amonn AG`} />
        <meta name="twitter:description" content={displayExcerpt ?? ''} />
        {post.cover_image && <meta name="twitter:image" content={post.cover_image} />}
      </Helmet>

      {/* Hero (cover image → dark photo hero; otherwise light) */}
      <PageHero
        eyebrow={post.category}
        title={displayTitle}
        image={post.cover_image || undefined}
        size="sm"
      >
        {/* Meta */}
        <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-sm ${post.cover_image ? 'text-white/70' : 'text-gray-500'}`}>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {formatDate(post.published_at)}
          </span>
          {post.author && (
            <span className="flex items-center gap-1.5">
              <User size={14} />
              {post.author}
            </span>
          )}
        </div>
      </PageHero>

      <div className="bg-white">
        <div className="container mx-auto px-6 py-16 md:py-20">
          <div className="flex flex-col lg:flex-row lg:justify-between gap-12 lg:gap-16">
            {/* ── Main content ── */}
            <motion.article
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 min-w-0 max-w-3xl"
            >
              {/* Excerpt */}
              {displayExcerpt && (
                <p className="text-xl text-[#0F1B2D] leading-relaxed mb-8 pb-8 border-b border-gray-100">
                  {displayExcerpt}
                </p>
              )}

              {/* Content (HTML) */}
              {displayContent ? (
                <div
                  className="prose prose-gray max-w-none text-gray-600 text-[17px] leading-relaxed
                    [&_h2]:font-display [&_h2]:uppercase [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:text-[#0F1B2D] [&_h2]:mt-10 [&_h2]:mb-4
                    [&_h3]:font-display [&_h3]:uppercase [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#0F1B2D] [&_h3]:mt-8 [&_h3]:mb-3
                    [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4
                    [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4
                    [&_li]:mb-1 [&_a]:text-[#1D3D78] [&_a]:underline
                    [&_strong]:font-bold [&_em]:italic
                    [&_blockquote]:border-l-2 [&_blockquote]:border-[#1D3D78] [&_blockquote]:pl-5 [&_blockquote]:text-gray-500 [&_blockquote]:italic [&_img]:my-8"
                  dangerouslySetInnerHTML={{ __html: displayContent }}
                />
              ) : (
                <p className="text-gray-400 italic">Kein Inhalt vorhanden.</p>
              )}
            </motion.article>

            {/* ── Sidebar ── */}
            <aside className="lg:w-72 flex-shrink-0 space-y-8">
              {/* Back link */}
              <Link
                to="/neuigkeiten"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={15} />
                Zurück zu Neuigkeiten
              </Link>

              {/* Recent posts */}
              {recentPosts.length > 1 && (
                <div className="surface-warm border border-gray-100 p-6">
                  <h3 className="eyebrow mb-5">
                    Weitere Beiträge
                  </h3>
                  <ul className="space-y-5">
                    {recentPosts
                      .filter((p) => p.slug !== slug)
                      .slice(0, 4)
                      .map((p) => (
                        <li key={p.id}>
                          <Link
                            to={`/neuigkeiten/${p.slug}`}
                            className="block group"
                          >
                            {p.cover_image && (
                              <div className="w-full aspect-[16/9] overflow-hidden bg-gray-100 mb-3">
                                <img
                                  src={p.cover_image}
                                  alt={p.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                  loading="lazy"
                                  decoding="async"
                                />
                              </div>
                            )}
                            <p className="font-display uppercase text-lg font-semibold text-[#0F1B2D] group-hover:text-[#1D3D78] transition-colors line-clamp-2 leading-tight">
                              {(lang === 'it' && p.title_it) || p.title}
                            </p>
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mt-1.5 flex items-center gap-1">
                              <Tag size={11} />
                              {p.category}
                            </p>
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
