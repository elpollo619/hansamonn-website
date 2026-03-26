import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import { getBlogPostBySlug, getBlogPosts } from '@/data/blogStore';

const CATEGORY_COLORS = {
  Immobilien: 'bg-blue-100 text-blue-700',
  Architektur: 'bg-emerald-100 text-emerald-700',
  Unternehmen: 'bg-amber-100 text-amber-700',
  Allgemein:   'bg-gray-100 text-gray-600',
};

function categoryColor(cat) {
  return CATEGORY_COLORS[cat] ?? 'bg-gray-100 text-gray-600';
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
  const [post, setPost] = useState(undefined); // undefined = loading, null = not found
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    getBlogPostBySlug(slug).then((p) => setPost(p ?? null));
    getBlogPosts().then((all) => setRecentPosts(all.slice(0, 5)));
  }, [slug]);

  // Still loading
  if (post === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  // Not found
  if (post === null) {
    return <Navigate to="/neuigkeiten" replace />;
  }

  return (
    <>
      <Helmet>
        <title>{post.title} – Hans Amonn AG</title>
        <meta name="description" content={post.excerpt ?? ''} />
        {post.cover_image && <meta property="og:image" content={post.cover_image} />}
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Cover image hero */}
        {post.cover_image && (
          <div className="w-full h-64 sm:h-80 lg:h-96 bg-gray-200 overflow-hidden">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* ── Main content ── */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex-1 min-w-0"
            >
              {/* Category badge */}
              <div className="flex items-center gap-3 mb-4">
                <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColor(post.category)}`}>
                  {post.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-5">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-8 pb-8 border-b border-gray-200">
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

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-lg text-gray-600 leading-relaxed mb-6 font-medium">
                  {post.excerpt}
                </p>
              )}

              {/* Content (HTML) */}
              {post.content ? (
                <div
                  className="prose prose-gray max-w-none text-gray-700 leading-relaxed
                    [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-4
                    [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mt-6 [&_h3]:mb-3
                    [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4
                    [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4
                    [&_li]:mb-1 [&_a]:text-blue-600 [&_a]:underline
                    [&_strong]:font-bold [&_em]:italic
                    [&_blockquote]:border-l-4 [&_blockquote]:border-gray-200 [&_blockquote]:pl-4 [&_blockquote]:text-gray-500 [&_blockquote]:italic"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : (
                <p className="text-gray-400 italic">Kein Inhalt vorhanden.</p>
              )}
            </motion.article>

            {/* ── Sidebar ── */}
            <aside className="lg:w-64 flex-shrink-0 space-y-6">
              {/* Back link */}
              <Link
                to="/neuigkeiten"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={15} />
                Zurück zu Neuigkeiten
              </Link>

              {/* Recent posts */}
              {recentPosts.length > 1 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="text-xs font-black tracking-widest text-gray-400 uppercase mb-4">
                    Weitere Beiträge
                  </h3>
                  <ul className="space-y-4">
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
                              <div className="w-full h-24 rounded-xl overflow-hidden bg-gray-100 mb-2">
                                <img
                                  src={p.cover_image}
                                  alt={p.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            )}
                            <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                              {p.title}
                            </p>
                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
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
