import { useState, useRef, useEffect } from 'react'
import { ChatSidebar } from './components/ChatSidebar'
import { ChatMessage, TypingIndicator } from './components/ChatMessage'
import { ChatInput } from './components/ChatInput'
import { EmptyState } from './components/EmptyState'
import { ScrollArea } from './components/ui/scroll-area'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Chat {
  id: string
  title: string
  messages: Message[]
  timestamp: Date
}

function App() {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      title: 'New chat',
      messages: [],
      timestamp: new Date()
    }
  ])
  const [currentChatId, setCurrentChatId] = useState('1')
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentChat = chats.find(chat => chat.id === currentChatId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentChat?.messages])

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New chat',
      messages: [],
      timestamp: new Date()
    }
    setChats(prev => [newChat, ...prev])
    setCurrentChatId(newChat.id)
  }

  const deleteChat = (chatId: string) => {
    if (chats.length <= 1) return // Don't delete the last chat
    
    setChats(prev => prev.filter(chat => chat.id !== chatId))
    
    // If we deleted the current chat, switch to the first remaining chat
    if (chatId === currentChatId) {
      const remainingChats = chats.filter(chat => chat.id !== chatId)
      if (remainingChats.length > 0) {
        setCurrentChatId(remainingChats[0].id)
      }
    }
  }

  const renameChat = (chatId: string, newTitle: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, title: newTitle } : chat
    ))
  }

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    // Update current chat with user message
    setChats(prev => prev.map(chat => 
      chat.id === currentChatId 
        ? { 
            ...chat, 
            messages: [...chat.messages, userMessage],
            title: chat.messages.length === 0 ? content.trim().slice(0, 30) + (content.trim().length > 30 ? '...' : '') : chat.title,
            timestamp: new Date()
          }
        : chat
    ))

    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'm a ChatGPT clone interface. You said: "${userMessage.content}". This is a frontend-only demo, so I can't actually process your request, but the interface works exactly like the real ChatGPT! The design is pixel-perfect and includes all the key features like chat history, message actions, and responsive design.`,
        timestamp: new Date()
      }

      setChats(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: [...chat.messages, assistantMessage] }
          : chat
      ))
      setIsLoading(false)
    }, 1000 + Math.random() * 2000)
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const regenerateResponse = () => {
    if (!currentChat || currentChat.messages.length === 0) return
    
    const lastUserMessage = [...currentChat.messages].reverse().find(msg => msg.role === 'user')
    if (lastUserMessage) {
      // Remove last assistant message if exists
      const messagesWithoutLastAssistant = currentChat.messages.filter((msg, index) => 
        !(index === currentChat.messages.length - 1 && msg.role === 'assistant')
      )
      
      setChats(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: messagesWithoutLastAssistant }
          : chat
      ))
      
      setIsLoading(true)
      
      // Simulate regenerated response
      setTimeout(() => {
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Here's a regenerated response to: "${lastUserMessage.content}". This is still a demo interface, but now with a different response to show the regenerate functionality! The ChatGPT clone includes all the essential features like sidebar navigation, message history, and interactive elements.`,
          timestamp: new Date()
        }

        setChats(prev => prev.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, messages: [...messagesWithoutLastAssistant, assistantMessage] }
            : chat
        ))
        setIsLoading(false)
      }, 1000 + Math.random() * 2000)
    }
  }

  const handleExampleClick = (example: string) => {
    sendMessage(example)
  }

  return (
    <div className="flex h-screen bg-[#343541]">
      {/* Sidebar */}
      <ChatSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        chats={chats}
        activeChat={currentChatId}
        onChatSelect={setCurrentChatId}
        onNewChat={createNewChat}
        onDeleteChat={deleteChat}
        onRenameChat={renameChat}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#343541]">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors lg:hidden"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            <h1 className="text-white font-semibold text-lg">ChatGPT</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/50">GPT-3.5</span>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          {currentChat?.messages.length === 0 ? (
            <EmptyState onExampleClick={handleExampleClick} />
          ) : (
            <ScrollArea className="h-full">
              <div className="pb-32">
                {currentChat?.messages.map((message, index) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    onCopy={copyMessage}
                    onRegenerate={regenerateResponse}
                    isLast={index === currentChat.messages.length - 1}
                  />
                ))}
                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Input Area */}
        <ChatInput
          onSendMessage={sendMessage}
          disabled={isLoading}
        />
      </div>
    </div>
  )
}

export default App