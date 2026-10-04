import { useState } from 'react';
import { useApp } from '../store';
import { Card } from '../components/Card';
import { Avatar, avatarVariantForName } from '../components/Avatar';
import { ScreenHeader } from '../components/ScreenHeader';
import { Button } from '../components/Button';
import { Send, ChevronLeft, Phone, Video } from 'lucide-react';

export function MessagesScreen() {
  const { conversations, helperConversations, role, navigate } = useApp();
  const [openConvId, setOpenConvId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [localConvs, setLocalConvs] = useState(conversations);

  const convs = role === 'helper' ? helperConversations : localConvs;
  const openConv = convs.find((c) => c.id === openConvId);

  const handleSend = () => {
    if (!messageText.trim() || !openConv) return;
    const newMsg = {
      id: `m${Date.now()}`,
      senderId: 'me',
      senderName: 'Я',
      text: messageText,
      timestamp: 'Зараз',
      isOwn: true,
    };
    setLocalConvs((prev) =>
      prev.map((c) =>
        c.id === openConv.id
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: messageText, lastTimestamp: 'Зараз' }
          : c
      )
    );
    setMessageText('');
  };

  if (openConv) {
    return (
      <div className="min-h-screen bg-cream-100 flex flex-col">
        <header className="sticky top-0 z-30 bg-white border-b border-ink-100 px-4 py-3">
          <div className="flex items-center gap-3 max-w-md mx-auto">
            <button
              onClick={() => setOpenConvId(null)}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-cream-100 active:scale-90 transition-all"
            >
              <ChevronLeft className="w-6 h-6 text-ink-700" />
            </button>
            <Avatar name={openConv.personName} size={40} variant={avatarVariantForName(openConv.personName)} />
            <div className="flex-1">
              <h2 className="font-extrabold text-ink-900">{openConv.personName}</h2>
              <p className="text-xs text-sage-600 font-semibold">Онлайн</p>
            </div>
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-cream-100">
              <Phone className="w-5 h-5 text-ink-600" />
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-cream-100">
              <Video className="w-5 h-5 text-ink-600" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4 max-w-md mx-auto w-full space-y-3">
          {openConv.messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                  msg.isOwn
                    ? 'bg-coral-500 text-white rounded-br-md'
                    : 'bg-white text-ink-800 rounded-bl-md shadow-card'
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.isOwn ? 'text-coral-100' : 'text-ink-400'}`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-ink-100 p-3 safe-bottom">
          <div className="flex items-center gap-2 max-w-md mx-auto">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Напишіть повідомлення..."
              className="flex-1 px-4 py-3 bg-cream-100 rounded-2xl outline-none text-base placeholder:text-ink-400"
            />
            <button
              onClick={handleSend}
              className="w-12 h-12 rounded-full bg-coral-500 text-white flex items-center justify-center active:scale-90 transition-transform shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 pb-24">
      <ScreenHeader title="Повідомлення" showBack={false} />
      <div className="px-5 max-w-md mx-auto pt-4 space-y-3">
        {convs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-ink-500 font-semibold">Повідомлень поки немає</p>
          </div>
        ) : (
          convs.map((conv) => (
            <Card key={conv.id} className="p-4" hover onClick={() => setOpenConvId(conv.id)}>
              <div className="flex items-center gap-3">
                <Avatar name={conv.personName} size={52} variant={avatarVariantForName(conv.personName)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-extrabold text-ink-900 truncate">{conv.personName}</h3>
                    <span className="text-xs text-ink-400 font-semibold shrink-0">{conv.lastTimestamp}</span>
                  </div>
                  <p className="text-sm text-ink-500 truncate mt-0.5">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="w-6 h-6 rounded-full bg-coral-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {conv.unread}
                  </span>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
