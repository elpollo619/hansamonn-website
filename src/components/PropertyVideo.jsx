import React from 'react';
import { Play } from 'lucide-react';

/**
 * PropertyVideo — renders an embedded YouTube or Vimeo video.
 * Returns null when no URL is provided.
 */
function getEmbedUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // YouTube: https://www.youtube.com/watch?v=ID or https://youtube.com/watch?v=ID
  const ytWatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*v=([A-Za-z0-9_-]{11})/);
  if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}`;

  // YouTube short: https://youtu.be/ID
  const ytShort = trimmed.match(/(?:https?:\/\/)?youtu\.be\/([A-Za-z0-9_-]{11})/);
  if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}`;

  // YouTube embed already: https://www.youtube.com/embed/ID
  const ytEmbed = trimmed.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([A-Za-z0-9_-]{11})/);
  if (ytEmbed) return `https://www.youtube.com/embed/${ytEmbed[1]}`;

  // Vimeo: https://vimeo.com/ID
  const vimeo = trimmed.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;

  return null;
}

export default function PropertyVideo({ videoUrl }) {
  const embedUrl = getEmbedUrl(videoUrl);
  if (!embedUrl) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Play size={18} className="text-gray-500" />
        Video
      </h2>
      <div className="relative w-full overflow-hidden" style={{ paddingTop: '56.25%' }}>
        <iframe
          src={embedUrl}
          title="Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          loading="lazy"
        />
      </div>
    </div>
  );
}
