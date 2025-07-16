import { useState } from 'react'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { 
  Plus, 
  MessageSquare, 
  Edit3, 
  Trash2,
  Menu,
  X
} from 'lucide-react'

interface Chat {
  id: string
  title: string
  timestamp: Date
}

interface ChatSidebarProps {
  isOpen: boolean
  onToggle: () => void
  chats: Chat[]
  activeChat: string | null
  onChatSelect: (chatId: string) => void
  onNewChat: () => void
  onDeleteChat: (chatId: string) => void
  onRenameChat: (chatId: string, newTitle: string) => void
}

export function ChatSidebar({
  isOpen,
  onToggle,
  chats,
  activeChat,
  onChatSelect,
  onNewChat,
  onDeleteChat,
  onRenameChat
}: ChatSidebarProps) {
  const [editingChat, setEditingChat] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  const handleRename = (chatId: string, currentTitle: string) => {
    setEditingChat(chatId)
    setEditTitle(currentTitle)
  }

  const handleSaveRename = (chatId: string) => {
    if (editTitle.trim()) {
      onRenameChat(chatId, editTitle.trim())
    }
    setEditingChat(null)
    setEditTitle('')
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString()
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-[#171717] border-r border-white/10 z-50
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-white/10">
          <Button
            onClick={onNewChat}
            className="flex-1 bg-transparent border border-white/20 text-white hover:bg-white/10 h-11"
          >
            <Plus className="w-4 h-4 mr-2" />
            New chat
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="lg:hidden ml-2 text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Chat History */}
        <ScrollArea className="flex-1 h-[calc(100vh-80px)]">
          <div className="p-2 space-y-1">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`
                  group relative flex items-center p-3 rounded-lg cursor-pointer
                  hover:bg-white/10 transition-colors
                  ${activeChat === chat.id ? 'bg-white/10' : ''}
                `}
                onClick={() => onChatSelect(chat.id)}
              >
                <MessageSquare className="w-4 h-4 mr-3 text-white/70 flex-shrink-0" />
                
                {editingChat === chat.id ? (
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => handleSaveRename(chat.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveRename(chat.id)
                      if (e.key === 'Escape') {
                        setEditingChat(null)
                        setEditTitle('')
                      }
                    }}
                    className="flex-1 bg-transparent text-white text-sm outline-none border-b border-white/30"
                    autoFocus
                  />
                ) : (
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm truncate">
                      {chat.title}
                    </div>
                    <div className="text-white/50 text-xs">
                      {formatTime(chat.timestamp)}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRename(chat.id, chat.title)
                    }}
                    className="w-6 h-6 p-0 text-white/70 hover:text-white hover:bg-white/20"
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteChat(chat.id)
                    }}
                    className="w-6 h-6 p-0 text-white/70 hover:text-red-400 hover:bg-white/20"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* User section */}
        <div className="border-t border-white/10 p-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#10a37f] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">U</span>
            </div>
            <div className="flex-1">
              <div className="text-white text-sm">User</div>
              <div className="text-white/50 text-xs">Free plan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile toggle button */}
      <Button
        onClick={onToggle}
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-30 lg:hidden bg-white/10 text-white hover:bg-white/20"
      >
        <Menu className="w-5 h-5" />
      </Button>
    </>
  )
}