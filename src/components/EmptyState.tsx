import { 
  SunIcon, 
  BoltIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline'

const examples = [
  "Explain quantum computing in simple terms",
  "Got any creative ideas for a 10 year old's birthday?",
  "How do I make an HTTP request in Javascript?"
]

const capabilities = [
  "Remembers what user said earlier in the conversation",
  "Allows user to provide follow-up corrections",
  "Trained to decline inappropriate requests"
]

const limitations = [
  "May occasionally generate incorrect information",
  "May occasionally produce harmful instructions or biased content",
  "Limited knowledge of world and events after 2021"
]

interface EmptyStateProps {
  onExampleClick: (example: string) => void
}

export function EmptyState({ onExampleClick }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-white mb-2">ChatGPT</h1>
        </div>

        {/* Three columns */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Examples */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <SunIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-medium text-white mb-4">Examples</h3>
            <div className="space-y-2">
              {examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => onExampleClick(example)}
                  className="
                    w-full p-3 text-sm text-white/80 bg-white/5 hover:bg-white/10 
                    rounded-lg border border-white/20 transition-colors text-left
                  "
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>

          {/* Capabilities */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <BoltIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-medium text-white mb-4">Capabilities</h3>
            <div className="space-y-2">
              {capabilities.map((capability, index) => (
                <div
                  key={index}
                  className="
                    p-3 text-sm text-white/80 bg-white/5 
                    rounded-lg border border-white/20
                  "
                >
                  {capability}
                </div>
              ))}
            </div>
          </div>

          {/* Limitations */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <ExclamationTriangleIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-medium text-white mb-4">Limitations</h3>
            <div className="space-y-2">
              {limitations.map((limitation, index) => (
                <div
                  key={index}
                  className="
                    p-3 text-sm text-white/80 bg-white/5 
                    rounded-lg border border-white/20
                  "
                >
                  {limitation}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}