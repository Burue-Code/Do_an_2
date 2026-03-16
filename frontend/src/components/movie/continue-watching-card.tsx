import Link from 'next/link';
import Image from 'next/image';
import { getPosterUrl } from '@/lib/image';
import type { ContinueWatchingItem } from '@/features/continue-watching/types';

interface ContinueWatchingCardProps {
  item: ContinueWatchingItem;
}

export function ContinueWatchingCard({ item }: ContinueWatchingCardProps) {
  const href = `/movies/${item.id}`;
  const posterUrl = getPosterUrl(item.poster);
  const progress = item.progressPercent ?? 0;

  return (
    <Link href={href} className="continue-card">
      <div className="continue-card-poster">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="continue-card-poster-img"
            unoptimized
          />
        ) : (
          <div className="continue-card-poster-placeholder">
            <span>No poster</span>
          </div>
        )}
      </div>
      <div className="continue-card-info">
        <h3 className="continue-card-title">{item.title}</h3>
        {item.episodeNumber != null && (
          <p className="continue-card-episode">Tập {item.episodeNumber}</p>
        )}
        <div className="continue-card-progress-bar" aria-label={`Tiến độ ${progress}%`}>
          <div
            className="continue-card-progress-bar-inner"
            style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
          />
        </div>
        <p className="continue-card-progress-text">{progress.toFixed(0)}% đã xem</p>
      </div>
    </Link>
  );
}

