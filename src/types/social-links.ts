// ============================================================
// Social Links Types
// ============================================================

export type SocialPlatform =
  | 'instagram'
  | 'facebook'
  | 'github'
  | 'discord'
  | 'twitter'
  | 'linkedin'
  | 'tiktok'
  | 'snapchat'
  | 'youtube'
  | 'twitch'
  | 'spotify'
  | 'reddit'
  | 'telegram'
  | 'whatsapp'
  | 'phone'
  | 'email'
  | 'website'
  | 'other';

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  value: string; // username, URL, phone number, or email
  label?: string; // custom label for "other" type
  isPublic: boolean;
  createdAt: string;
}

export interface SocialPlatformConfig {
  platform: SocialPlatform;
  name: string;
  icon: string; // lucide icon name
  placeholder: string;
  urlPrefix?: string; // for generating full URLs
  color: string; // brand color
  bgColor: string; // background color for badges
}

export const SOCIAL_PLATFORMS: SocialPlatformConfig[] = [
  { platform: 'instagram', name: 'Instagram', icon: 'Instagram', placeholder: '@username', urlPrefix: 'https://instagram.com/', color: '#E4405F', bgColor: 'bg-pink-50 dark:bg-pink-950/30' },
  { platform: 'facebook', name: 'Facebook', icon: 'Facebook', placeholder: 'Profile URL or username', urlPrefix: 'https://facebook.com/', color: '#1877F2', bgColor: 'bg-blue-50 dark:bg-blue-950/30' },
  { platform: 'github', name: 'GitHub', icon: 'Github', placeholder: 'username', urlPrefix: 'https://github.com/', color: '#181717', bgColor: 'bg-gray-50 dark:bg-gray-950/30' },
  { platform: 'discord', name: 'Discord', icon: 'MessageSquare', placeholder: 'username#0000', color: '#5865F2', bgColor: 'bg-indigo-50 dark:bg-indigo-950/30' },
  { platform: 'twitter', name: 'X / Twitter', icon: 'Twitter', placeholder: '@handle', urlPrefix: 'https://x.com/', color: '#000000', bgColor: 'bg-gray-50 dark:bg-gray-950/30' },
  { platform: 'linkedin', name: 'LinkedIn', icon: 'Linkedin', placeholder: 'Profile URL or username', urlPrefix: 'https://linkedin.com/in/', color: '#0A66C2', bgColor: 'bg-blue-50 dark:bg-blue-950/30' },
  { platform: 'tiktok', name: 'TikTok', icon: 'Video', placeholder: '@username', urlPrefix: 'https://tiktok.com/@', color: '#000000', bgColor: 'bg-gray-50 dark:bg-gray-950/30' },
  { platform: 'snapchat', name: 'Snapchat', icon: 'Ghost', placeholder: 'username', color: '#FFFC00', bgColor: 'bg-yellow-50 dark:bg-yellow-950/30' },
  { platform: 'youtube', name: 'YouTube', icon: 'Youtube', placeholder: 'Channel URL', urlPrefix: 'https://youtube.com/@', color: '#FF0000', bgColor: 'bg-red-50 dark:bg-red-950/30' },
  { platform: 'twitch', name: 'Twitch', icon: 'Tv', placeholder: 'username', urlPrefix: 'https://twitch.tv/', color: '#9146FF', bgColor: 'bg-purple-50 dark:bg-purple-950/30' },
  { platform: 'spotify', name: 'Spotify', icon: 'Music', placeholder: 'Profile URL', color: '#1DB954', bgColor: 'bg-green-50 dark:bg-green-950/30' },
  { platform: 'reddit', name: 'Reddit', icon: 'Hash', placeholder: 'u/username', urlPrefix: 'https://reddit.com/user/', color: '#FF4500', bgColor: 'bg-orange-50 dark:bg-orange-950/30' },
  { platform: 'telegram', name: 'Telegram', icon: 'Send', placeholder: '@username', urlPrefix: 'https://t.me/', color: '#26A5E4', bgColor: 'bg-sky-50 dark:bg-sky-950/30' },
  { platform: 'whatsapp', name: 'WhatsApp', icon: 'Phone', placeholder: '+1 (555) 000-0000', color: '#25D366', bgColor: 'bg-green-50 dark:bg-green-950/30' },
  { platform: 'phone', name: 'Phone', icon: 'Smartphone', placeholder: '+1 (555) 000-0000', color: '#6B7280', bgColor: 'bg-gray-50 dark:bg-gray-950/30' },
  { platform: 'email', name: 'Email', icon: 'Mail', placeholder: 'you@example.com', color: '#6B7280', bgColor: 'bg-gray-50 dark:bg-gray-950/30' },
  { platform: 'website', name: 'Website', icon: 'Globe', placeholder: 'https://yoursite.com', color: '#6B7280', bgColor: 'bg-gray-50 dark:bg-gray-950/30' },
  { platform: 'other', name: 'Other', icon: 'Link', placeholder: 'URL or handle', color: '#6B7280', bgColor: 'bg-gray-50 dark:bg-gray-950/30' },
];

export function getPlatformConfig(platform: SocialPlatform): SocialPlatformConfig {
  return SOCIAL_PLATFORMS.find(p => p.platform === platform) || SOCIAL_PLATFORMS[SOCIAL_PLATFORMS.length - 1];
}
