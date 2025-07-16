import { useState, useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Message ChatGPT..." 
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'
    }
  }, [message])

  return (
    <div className="border-t border-white/10 bg-[#343541]">
      <div className="max-w-3xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-end bg-[#40414f] rounded-xl border border-white/20 focus-within:border-white/30 transition-colors">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className="
                flex-1 min-h-[52px] max-h-[200px] resize-none border-0 bg-transparent 
                text-white placeholder:text-white/50 focus-visible:ring-0 focus-visible:ring-offset-0
                py-3 px-4 pr-12
              "
              rows={1}
            />
            
            <Button
              type="submit"
              disabled={!message.trim() || disabled}
              className="
                absolute right-2 bottom-2 w-8 h-8 p-0 rounded-lg
                bg-white text-black hover:bg-white/90 disabled:bg-white/20 disabled:text-white/50
                transition-colors
              "
            >
              <PaperAirplaneIcon className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="text-xs text-white/50 text-center mt-2">
            ChatGPT can make mistakes. Consider checking important information.
          </div>
        </form>
      </div>
    </div>
  )
}