'use client';

import { getPublicSocialLinks } from '@/lib/data/social-links';
import { getPlatformConfig } from '@/types/social-links';
import type { SocialLink, SocialPlatform } from '@/types/social-links';
import {
  Globe, Link as LinkIcon, ExternalLink,
  Phone, Mail, MessageSquare, Send, Music, Hash, Tv, Video,
  Smartphone, Users, Heart, AtSign,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, React.ElementType> = {
  Instagram: Heart,
  Facebook: Users,
  Github: AtSign,
  Twitter: AtSign,
  Linkedin: Users,
  Youtube: Video,
  Phone, Mail, MessageSquare, Send, Music, Hash, Tv, Video,
  Smartphone, Globe, Link: LinkIcon,
  Ghost: MessageSquare,
};

function PlatformIcon({ platform, className }: { platform: SocialPlatform; className?: string }) {
  const config = getPlatformConfig(platform);
  const Icon = ICON_MAP[config.icon] || LinkIcon;
  return <Icon className={className} />;
}

function getLinkUrl(link: SocialLink): string | null {
  const config = getPlatformConfig(link.platform);
  if (link.platform === 'email') return `mailto:${link.value}`;
  if (link.platform === 'phone' || link.platform === 'whatsapp') return `tel:${link.value}`;
  if (link.value.startsWith('http')) return link.value;
  if (config.urlPrefix) return `${config.urlPrefix}${link.value.replace(/^@/, '')}`;
  return null;
}

interface SocialLinksDisplayProps {
  userId: string;
  compact?: boolean;
  className?: string;
}

export function SocialLinksDisplay({ userId, compact = false, className }: SocialLinksDisplayProps) {
  const links = getPublicSocialLinks(userId);

  if (links.length === 0) return null;

  if (compact) {
    return (
      <div className={cn('flex items-center gap-1 flex-wrap', className)}>
        {links.slice(0, 5).map((link) => {
          const config = getPlatformConfig(link.platform);
          const url = getLinkUrl(link);
          return (
            <a
              key={link.id}
              href={url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ backgroundColor: config.color + '15', color: config.color }}
              title={`${config.name}: ${link.value}`}
            >
              <PlatformIcon platform={link.platform} className="w-3.5 h-3.5" />
            </a>
          );
        })}
        {links.length > 5 && (
          <span className="text-xs text-muted-foreground ml-1">
            +{links.length - 5}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-1.5', className)}>
      {links.map((link) => {
        const config = getPlatformConfig(link.platform);
        const url = getLinkUrl(link);
        return (
          <a
            key={link.id}
            href={url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-all hover:shadow-sm group',
              config.bgColor
            )}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: config.color + '20' }}
            >
              <PlatformIcon platform={link.platform} className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{link.label || config.name}</p>
              <p className="text-[11px] text-muted-foreground truncate">{link.value}</p>
            </div>
            {url && (
              <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            )}
          </a>
        );
      })}
    </div>
  );
}
