import { useState } from 'react'
import { Button } from './ui/button'
import { 
  Copy, 
  RotateCcw,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
  onCopy: (content: string) => void
  onRegenerate?: () => void
  isLast?: boolean
}

export function ChatMessage({ message, onCopy, onRegenerate, isLast }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    onCopy(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isUser = message.role === 'user'

  return (
    <div className={`group relative ${isUser ? 'bg-transparent' : 'bg-[#2f2f2f]'}`}>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex space-x-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${isUser 
                ? 'bg-[#10a37f] text-white' 
                : 'bg-[#10a37f] text-white'
              }
            `}>
              {isUser ? 'U' : 'AI'}
            </div>
          </div>

          {/* Message content */}
          <div className="flex-1 min-w-0">
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-white leading-7">
                {message.content}
              </div>
            </div>

            {/* Action buttons */}
            {!isUser && (
              <div className="flex items-center space-x-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="text-white/70 hover:text-white hover:bg-white/10 h-8 px-2"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                
                {isLast && onRegenerate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRegenerate}
                    className="text-white/70 hover:text-white hover:bg-white/10 h-8 px-2"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Regenerate
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white hover:bg-white/10 h-8 px-2"
                >
                  <ThumbsUp className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white hover:bg-white/10 h-8 px-2"
                >
                  <ThumbsDown className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="bg-[#2f2f2f]">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex space-x-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-[#10a37f] rounded-full flex items-center justify-center text-sm font-medium text-white">
              AI
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="typing-dots text-white/70">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}