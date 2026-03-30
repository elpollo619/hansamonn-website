import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import { getBlogPosts } from '@/data/blogStore';
import { useTranslation } from '@/i18n';

const CATEGORY_COLORS = {
  Immobilien: 'bg-gray-100 text-gray-600',
  Architektur: 'bg-gray-100 text-gray-600',
  Unternehmen: 'bg-gray-100 text-gray-600',
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

// ── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-6 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-1/3 mt-4" />
      </div>
    </div>
  );
}

// ── Single blog card ─────────────────────────────────────────────────────────
function BlogCard({ post, index, lang }) {
  const displayTitle   = (lang === 'it' && post.title_it)   || post.title;
  const displayExcerpt = (lang === 'it' && post.excerpt_it) || post.excerpt;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="bg-white overflow-hidden border border-gray-100 hover:border-gray-300 transition-colors group"
    >
      {/* Cover image */}
      <Link to={`/neuigkeiten/${post.slug}`} className="block overflow-hidden h-48 bg-gray-100">
        {post.cover_image ? (
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <Tag size={32} className="text-gray-300" />
          </div>
        )}
      </Link>

      <div className="p-6">
        {/* Category + date */}
        <div className="flex items-center gap-3 mb-3">
          <span className={`inline-block text-xs font-semibold px-2.5 py-1 ${categoryColor(post.category)}`}>
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar size={12} />
            {formatDate(post.published_at)}
          </span>
        </div>

        {/* Title */}
        <Link to={`/neuigkeiten/${post.slug}`}>
          <h2 className="text-gray-900 font-bold text-lg leading-snug mb-2 group-hover:text-[#1D3D78] transition-colors line-clamp-2">
            {displayTitle}
          </h2>
        </Link>

        {/* Excerpt */}
        {displayExcerpt && (
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4">
            {displayExcerpt}
          </p>
        )}

        {/* Weiterlesen */}
        <Link
          to={`/neuigkeiten/${post.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors" style={{ color: 'var(--brand-color, #1D3D78)' }}
        >
          Weiterlesen <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function NeuigkeitenPage() {
  const { lang } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getBlogPosts()
      .then(setPosts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>Neuigkeiten – Hans Amonn AG</title>
        <meta name="description" content="Aktuelle Neuigkeiten, Projekte und Einblicke von Hans Amonn AG – Immobilien und Architektur in Bern." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Neuigkeiten – Hans Amonn AG" />
        <meta property="og:description" content="Aktuelle Neuigkeiten, Projekte und Einblicke von Hans Amonn AG – Immobilien und Architektur in Bern." />
        <meta property="og:url" content="https://www.hansamonn.ch/neuigkeiten" />
        <meta property="og:site_name" content="Hans Amonn AG" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6 py-14">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs font-black tracking-widest text-gray-400 uppercase mb-3">
                Hans Amonn AG
              </p>
              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-4">
                Neuigkeiten
              </h1>
              <p className="text-lg text-gray-500 max-w-xl">
                Aktuelle Beiträge, Projekte und Einblicke aus unserem Unternehmen.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-sm">Beiträge konnten nicht geladen werden.</p>
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="text-center py-20">
              <Tag size={40} className="text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-medium">Noch keine Beiträge vorhanden.</p>
              <p className="text-gray-300 text-sm mt-1">Schauen Sie bald wieder vorbei.</p>
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <BlogCard key={post.id} post={post} index={i} lang={lang} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
