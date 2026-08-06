'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bell, Check, Trash2, MessageCircle, Calendar, Users, Sparkles, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '@/lib/notifications/store';
import type { AppNotification, NotificationType } from '@/lib/notifications/store';
import { cn, formatRelativeTime } from '@/lib/utils';
import { subscribeToStorage } from '@/lib/storage-sync';

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case 'chat': return <MessageCircle className="w-4 h-4 text-blue-500" />;
    case 'event_update': return <Calendar className="w-4 h-4 text-amber-500" />;
    case 'event_reminder': return <Calendar className="w-4 h-4 text-red-500" />;
    case 'pod_invite': return <Users className="w-4 h-4 text-green-500" />;
    case 'match': return <Sparkles className="w-4 h-4 text-purple-500" />;
    case 'system': return <Info className="w-4 h-4 text-gray-500" />;
    default: return <Bell className="w-4 h-4" />;
  }
}

function getNotificationBg(type: NotificationType, read: boolean) {
  if (read) return 'bg-background';
  switch (type) {
    case 'chat': return 'bg-blue-50/50 dark:bg-blue-950/10';
    case 'event_update': return 'bg-amber-50/50 dark:bg-amber-950/10';
    case 'event_reminder': return 'bg-red-50/50 dark:bg-red-950/10';
    case 'pod_invite': return 'bg-green-50/50 dark:bg-green-950/10';
    case 'match': return 'bg-purple-50/50 dark:bg-purple-950/10';
    default: return 'bg-muted/30';
  }
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [animate, setAnimate] = useState(false);

  const refresh = useCallback(() => {
    setNotifications(getNotifications());
    setUnreadCount(getUnreadCount());
  }, []);

  // Subscribe to storage changes and custom events
  useEffect(() => {
    refresh();
    const unsubscribe = subscribeToStorage(refresh);

    const handleNewNotif = () => {
      refresh();
      setAnimate(true);
      setTimeout(() => setAnimate(false), 1000);
    };

    window.addEventListener('notification-added', handleNewNotif);
    return () => {
      unsubscribe();
      window.removeEventListener('notification-added', handleNewNotif);
    };
  }, [refresh]);

  const handleMarkRead = (id: string) => {
    markAsRead(id);
    refresh();
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
    refresh();
  };

  const handleDelete = (id: string) => {
    deleteNotification(id);
    refresh();
  };

  const handleNotificationClick = (notif: AppNotification) => {
    if (!notif.read) {
      markAsRead(notif.id);
      refresh();
    }
    if (notif.actionUrl) {
      window.location.href = notif.actionUrl;
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative p-2 rounded-lg hover:bg-muted transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          animate && 'animate-bounce'
        )}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell className="w-5 h-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1 animate-in zoom-in duration-200">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-h-[70vh] bg-popover border rounded-xl shadow-xl z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 text-[10px] font-bold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleMarkAllRead}>
                    <Check className="w-3 h-3 mr-1" />
                    Read all
                  </Button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded hover:bg-muted"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Notifications list */}
            <div className="overflow-y-auto max-h-[calc(70vh-60px)]">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium">All caught up!</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You&apos;ll get notified about new messages, event updates, and matches here.
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={cn(
                        'flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer hover:bg-muted/50',
                        getNotificationBg(notif.type, notif.read)
                      )}
                      onClick={() => handleNotificationClick(notif)}
                    >
                      <div className="mt-0.5 shrink-0">
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn(
                            'text-xs line-clamp-1',
                            !notif.read ? 'font-semibold' : 'font-medium text-muted-foreground'
                          )}>
                            {notif.title}
                          </p>
                          {!notif.read && (
                            <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                          {notif.message}
                        </p>
                        <p className="text-[10px] text-muted-foreground/70 mt-1">
                          {formatRelativeTime(notif.createdAt)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notif.id);
                        }}
                        className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all shrink-0 mt-0.5"
                        title="Dismiss"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
