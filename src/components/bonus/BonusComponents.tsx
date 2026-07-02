import React from 'react';
import { Video } from 'lucide-react';

export const BonusBadge = ({ className = '' }: { className?: string }) => (
  <span className={`inline-flex items-center rounded-full bg-brand-gold text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 shadow-sm ${className}`}>
    Bônus Hoje!
  </span>
);

/**
 * Player de vídeo do YouTube. Enquanto youtubeId for null,
 * mostra um placeholder de "Vídeo em breve".
 */
export const VideoEmbed = ({ youtubeId, title }: { youtubeId: string | null; title: string }) => {
  if (!youtubeId) {
    return (
      <div className="aspect-video w-full rounded-xl bg-brand-dark-green flex flex-col items-center justify-center text-brand-beige gap-3 border border-brand-deep-green">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
          <Video className="h-7 w-7" />
        </span>
        <p className="font-semibold">Vídeo em breve</p>
        <p className="text-xs text-brand-beige/70 max-w-xs text-center px-4">{title}</p>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-md">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
};
