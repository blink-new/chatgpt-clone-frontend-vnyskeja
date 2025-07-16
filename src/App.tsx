import { useState, useRef, useEffect } from 'react'
import { Send, Plus, MessageSquare, Menu, X, MoreHorizontal, Copy, RotateCcw } from 'lucide-react'
import { Button } from './components/ui/button'
import { Textarea } from './components/ui/textarea'
import { ScrollArea } from './components/ui/scroll-area'
import { Separator } from './components/ui/separator'
import { Avatar, AvatarFallback } from './components/ui/avatar'

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
  createdAt: Date
}

function App() {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      title: 'New chat',
      messages: [],
      createdAt: new Date()
    }
  ])
  const [currentChatId, setCurrentChatId] = useState('1')
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
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
      createdAt: new Date()
    }
    setChats(prev => [newChat, ...prev])
    setCurrentChatId(newChat.id)
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    // Update current chat with user message
    setChats(prev => prev.map(chat => 
      chat.id === currentChatId 
        ? { 
            ...chat, 
            messages: [...chat.messages, userMessage],
            title: chat.messages.length === 0 ? input.trim().slice(0, 30) + (input.trim().length > 30 ? '...' : '') : chat.title
          }
        : chat
    ))

    setInput('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'm a ChatGPT clone interface. You said: "${userMessage.content}". This is a frontend-only demo, so I can't actually process your request, but the interface works exactly like the real ChatGPT!`,
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
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
          content: `Here's a regenerated response to: "${lastUserMessage.content}". This is still a demo interface, but now with a different response to show the regenerate functionality!`,
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

  return (
    <div className="flex h-screen chatgpt-bg">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden chatgpt-sidebar border-r chatgpt-border`}>
        <div className="flex flex-col h-full">
          {/* New Chat Button */}
          <div className="p-3">
            <Button 
              onClick={createNewChat}
              className="w-full justify-start gap-3 bg-transparent border chatgpt-border chatgpt-hover text-white hover:text-white"
              variant="outline"
            >
              <Plus size={16} />
              New chat
            </Button>
          </div>

          {/* Chat History */}
          <ScrollArea className="flex-1 px-3">
            <div className="space-y-1">
              {chats.map((chat) => (
                <Button
                  key={chat.id}
                  onClick={() => setCurrentChatId(chat.id)}
                  variant="ghost"
                  className={`w-full justify-start text-left h-auto p-3 chatgpt-hover text-white hover:text-white ${
                    currentChatId === chat.id ? 'bg-gray-700' : ''
                  }`}
                >
                  <MessageSquare size={16} className="mr-3 flex-shrink-0" />
                  <span className="truncate">{chat.title}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>

          {/* User Section */}
          <div className="p-3 border-t chatgpt-border">
            <div className="flex items-center gap-3 p-2 rounded-lg chatgpt-hover cursor-pointer">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-green-600 text-white text-sm">U</AvatarFallback>
              </Avatar>
              <span className="text-white text-sm">User</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b chatgpt-border">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              variant="ghost"
              size="sm"
              className="text-white hover:text-white chatgpt-hover"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            <h1 className="text-white font-semibold">ChatGPT</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm chatgpt-text-secondary">GPT-3.5</span>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1">
          <div className="max-w-3xl mx-auto">
            {currentChat?.messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-white mb-4">How can I help you today?</h2>
                  <p className="chatgpt-text-secondary">Start a conversation by typing a message below.</p>
                </div>
              </div>
            ) : (
              <div className="py-8">
                {currentChat?.messages.map((message) => (
                  <div key={message.id} className={`group px-6 py-8 ${message.role === 'assistant' ? 'bg-gray-700/50' : ''}`}>
                    <div className="flex gap-6 max-w-4xl mx-auto">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className={`text-white text-sm ${
                          message.role === 'user' ? 'bg-green-600' : 'bg-purple-600'
                        }`}>
                          {message.role === 'user' ? 'U' : 'AI'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-white whitespace-pre-wrap break-words">
                          {message.content}
                        </div>
                        {message.role === 'assistant' && (
                          <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              onClick={() => copyMessage(message.content)}
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-white chatgpt-hover h-8 px-2"
                            >
                              <Copy size={14} />
                            </Button>
                            <Button
                              onClick={regenerateResponse}
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-white chatgpt-hover h-8 px-2"
                            >
                              <RotateCcw size={14} />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="px-6 py-8 bg-gray-700/50">
                    <div className="flex gap-6 max-w-4xl mx-auto">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="bg-purple-600 text-white text-sm">AI</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-1 text-white">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t chatgpt-border">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Message ChatGPT..."
                className="min-h-[52px] max-h-32 pr-12 resize-none chatgpt-input border-gray-600 text-white placeholder:text-gray-400 focus:border-gray-500"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                size="sm"
                className="absolute right-2 bottom-2 w-8 h-8 p-0 bg-white text-black hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400"
              >
                <Send size={16} />
              </Button>
            </div>
            <p className="text-xs chatgpt-text-secondary text-center mt-2">
              ChatGPT can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App