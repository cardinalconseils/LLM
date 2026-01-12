import { useState, useEffect, useRef, useMemo } from 'react'
import { Menu, X, LogOut } from 'lucide-react'
import Sidebar from './components/Sidebar'
import ChatInterface from './components/ChatInterface'
import RightPanel from './components/RightPanel'
import Login from './components/Login'
import { Button } from './components/ui/button'
import { api } from './api'
import { cn } from './lib/utils'
import { useAuth } from './contexts/AuthContext'

function App() {
  const { user, loading: authLoading, signOut } = useAuth()

  const [conversations, setConversations] = useState([])
  const [currentConversationId, setCurrentConversationId] = useState(null)
  const [currentConversation, setCurrentConversation] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [councilMode, setCouncilMode] = useState('chat')
  const [customModels, setCustomModels] = useState(null)
  const [chairmanModel, setChairmanModel] = useState(null)
  const abortControllerRef = useRef(null)

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (currentConversationId) {
      loadConversation(currentConversationId)
    }
  }, [currentConversationId])

  const loadConversations = async () => {
    try {
      const convs = await api.listConversations()
      setConversations(convs)
    } catch (error) {
      console.error('Failed to load conversations:', error)
    }
  }

  const loadConversation = async (id) => {
    try {
      const conv = await api.getConversation(id)
      setCurrentConversation(conv)
    } catch (error) {
      console.error('Failed to load conversation:', error)
    }
  }

  const handleNewConversation = async () => {
    try {
      const newConv = await api.createConversation()
      setConversations([
        { id: newConv.id, created_at: newConv.created_at, message_count: 0 },
        ...conversations,
      ])
      setCurrentConversationId(newConv.id)
    } catch (error) {
      console.error('Failed to create conversation:', error)
    }
  }

  const handleSelectConversation = (id) => {
    setCurrentConversationId(id)
  }

  const handleSendMessage = async (content) => {
    if (!currentConversationId) return

    setIsLoading(true)
    try {
      const userMessage = { role: 'user', content }
      setCurrentConversation((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
      }))

      const assistantMessage = {
        role: 'assistant',
        stage1: null,
        stage2: null,
        stage3: null,
        metadata: null,
        loading: {
          stage1: false,
          stage2: false,
          stage3: false,
        },
      }

      setCurrentConversation((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
      }))

      await api.sendMessageStream(
        currentConversationId,
        content,
        (eventType, event) => {
          switch (eventType) {
            case 'stage1_start':
              setCurrentConversation((prev) => {
                const messages = [...prev.messages]
                const lastMsg = messages[messages.length - 1]
                lastMsg.loading.stage1 = true
                return { ...prev, messages }
              })
              break

            case 'stage1_complete':
              setCurrentConversation((prev) => {
                const messages = [...prev.messages]
                const lastMsg = messages[messages.length - 1]
                lastMsg.stage1 = event.data
                lastMsg.loading.stage1 = false
                return { ...prev, messages }
              })
              break

            case 'stage2_start':
              setCurrentConversation((prev) => {
                const messages = [...prev.messages]
                const lastMsg = messages[messages.length - 1]
                lastMsg.loading.stage2 = true
                return { ...prev, messages }
              })
              break

            case 'stage2_complete':
              setCurrentConversation((prev) => {
                const messages = [...prev.messages]
                const lastMsg = messages[messages.length - 1]
                lastMsg.stage2 = event.data
                lastMsg.metadata = event.metadata
                lastMsg.loading.stage2 = false
                return { ...prev, messages }
              })
              break

            case 'stage3_start':
              setCurrentConversation((prev) => {
                const messages = [...prev.messages]
                const lastMsg = messages[messages.length - 1]
                lastMsg.loading.stage3 = true
                return { ...prev, messages }
              })
              break

            case 'stage3_complete':
              setCurrentConversation((prev) => {
                const messages = [...prev.messages]
                const lastMsg = messages[messages.length - 1]
                lastMsg.stage3 = event.data
                lastMsg.loading.stage3 = false
                return { ...prev, messages }
              })
              break

            case 'title_complete':
              loadConversations()
              break

            case 'complete':
              loadConversations()
              setIsLoading(false)
              break

            case 'error':
              console.error('Stream error:', event.message)
              setIsLoading(false)
              break

            default:
              console.log('Unknown event type:', eventType)
          }
        },
        { mode: councilMode, customModels, chairmanModel }
      )
    } catch (error) {
      console.error('Failed to send message:', error)
      setCurrentConversation((prev) => ({
        ...prev,
        messages: prev.messages.slice(0, -2),
      }))
      setIsLoading(false)
    }
  }

  const handleSelectConversationMobile = (id) => {
    handleSelectConversation(id)
    setSidebarOpen(false)
  }

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsLoading(false)
    }
  }

  // Get the latest assistant message data for the right panel
  const latestAssistantData = useMemo(() => {
    if (!currentConversation?.messages) return null
    const assistantMessages = currentConversation.messages.filter(m => m.role === 'assistant')
    const latest = assistantMessages[assistantMessages.length - 1]
    if (!latest) return null
    return {
      aggregateRankings: latest.metadata?.aggregate_rankings,
      labelToModel: latest.metadata?.label_to_model,
      stage1Responses: latest.stage1,
    }
  }, [currentConversation?.messages])

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background-secondary">
        <div className="animate-pulse text-slate-500">Loading...</div>
      </div>
    )
  }

  // Show login if not authenticated
  if (!user) {
    return <Login />
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background-secondary">
      {/* Mobile Menu Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
        className={cn(
          'fixed top-4 left-4 z-50 md:hidden',
          'bg-white/80 backdrop-blur-sm shadow-md hover:bg-white'
        )}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Logout Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={signOut}
        aria-label="Sign out"
        title={`Signed in as ${user?.email || user?.phone}`}
        className={cn(
          'fixed top-4 right-4 z-50',
          'bg-white/80 backdrop-blur-sm shadow-md hover:bg-white hover:text-red-600'
        )}
      >
        <LogOut className="w-4 h-4" />
      </Button>

      {/* Mobile Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden',
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setSidebarOpen(false)}
      />

      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversationMobile}
        onNewConversation={handleNewConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <ChatInterface
        conversation={currentConversation}
        onSendMessage={handleSendMessage}
        onStopGeneration={handleStopGeneration}
        isLoading={isLoading}
        mode={councilMode}
        onModeChange={setCouncilMode}
        customModels={customModels}
        onModelsChange={setCustomModels}
        chairmanModel={chairmanModel}
        onChairmanChange={setChairmanModel}
      />

      {/* Right Panel - Council Analytics */}
      {currentConversation && (
        <div className="hidden lg:flex h-full">
          <RightPanel
            aggregateRankings={latestAssistantData?.aggregateRankings}
            labelToModel={latestAssistantData?.labelToModel}
            stage1Responses={latestAssistantData?.stage1Responses}
            isVisible={true}
          />
        </div>
      )}
    </div>
  )
}

export default App
