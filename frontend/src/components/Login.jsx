import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './ui/button'
import { Mail, Phone, ArrowLeft, Loader2, Users, Shield, KeyRound } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Login() {
  const { signInWithEmail, signInWithPhone, verifyEmailOtp, verifyPhoneOtp } = useAuth()

  const [mode, setMode] = useState(null) // 'email' | 'phone' | null
  const [step, setStep] = useState('input') // 'input' | 'verify'
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (mode === 'email') {
        const { error } = await signInWithEmail(email)
        if (error) {
          if (error.message.includes('Signups not allowed')) {
            setError('This email is not registered. Contact an administrator.')
          } else {
            setError(error.message)
          }
        } else {
          setMessage('Check your email for the login code')
          setStep('verify')
        }
      } else if (mode === 'phone') {
        const { error } = await signInWithPhone(phone)
        if (error) {
          if (error.message.includes('Signups not allowed')) {
            setError('This phone number is not registered. Contact an administrator.')
          } else {
            setError(error.message)
          }
        } else {
          setMessage('Check your phone for the verification code')
          setStep('verify')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (mode === 'email') {
        const { error } = await verifyEmailOtp(email, otp)
        if (error) {
          setError(error.message)
        }
      } else if (mode === 'phone') {
        const { error } = await verifyPhoneOtp(phone, otp)
        if (error) {
          setError(error.message)
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (step === 'verify') {
      setStep('input')
      setOtp('')
      setError('')
      setMessage('')
    } else {
      setMode(null)
      setEmail('')
      setPhone('')
      setError('')
      setMessage('')
    }
  }

  // Mode selection screen - Premium council aesthetic
  if (!mode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background-secondary to-background-tertiary p-6">
        <div className="w-full max-w-lg animate-fade-in-up">
          {/* Council Logo */}
          <div className="text-center mb-12">
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-20 blur-3xl rounded-full animate-pulse-glow" />
              <div className="relative flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-primary-hover text-white shadow-2xl">
                <Users className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-3 tracking-tight">
              LLM Council
            </h1>
            <p className="text-lg text-foreground-secondary">
              Enter the Council Chamber
            </p>
          </div>

          {/* Authentication Card */}
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-border-light overflow-hidden">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b-2 border-border-light">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Secure Authentication</h2>
                  <p className="text-sm text-foreground-tertiary">Choose your verification method</p>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setMode('email')}
                  className={cn(
                    'group relative w-full flex items-center gap-4 p-5 rounded-xl text-left',
                    'bg-gradient-to-br from-background-secondary to-background',
                    'border-2 border-border-light hover:border-primary/40',
                    'shadow-sm hover:shadow-md',
                    'transition-all duration-250',
                    'animate-council-gather'
                  )}
                  style={{ animationDelay: '100ms' }}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 shadow-md group-hover:scale-110 transition-transform duration-250">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground mb-1">Continue with Email</div>
                    <div className="text-sm text-foreground-tertiary">Receive OTP via email</div>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-foreground-muted rotate-180 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setMode('phone')}
                  className={cn(
                    'group relative w-full flex items-center gap-4 p-5 rounded-xl text-left',
                    'bg-gradient-to-br from-background-secondary to-background',
                    'border-2 border-border-light hover:border-primary/40',
                    'shadow-sm hover:shadow-md',
                    'transition-all duration-250',
                    'animate-council-gather'
                  )}
                  style={{ animationDelay: '200ms' }}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 shadow-md group-hover:scale-110 transition-transform duration-250">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground mb-1">Continue with Phone</div>
                    <div className="text-sm text-foreground-tertiary">Receive OTP via SMS</div>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-foreground-muted rotate-180 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 bg-gradient-to-r from-background-secondary/50 to-transparent border-t-2 border-border-light">
              <div className="flex items-center gap-2 text-xs text-foreground-tertiary">
                <KeyRound className="w-3.5 h-3.5 text-accent" />
                <span className="font-medium">Authorized council members only</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Email/Phone input or OTP verification screen - Premium design
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background-secondary to-background-tertiary p-6">
      <div className="w-full max-w-lg animate-fade-in-up">
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-border-light overflow-hidden">
          {/* Header */}
          <div className="relative p-8 pb-6 bg-gradient-to-r from-background-secondary/50 to-transparent border-b-2 border-border-light">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-foreground-tertiary hover:text-primary text-sm font-medium mb-6 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back
            </button>

            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 shadow-lg">
                {mode === 'email' ? (
                  <Mail className="w-7 h-7 text-primary" />
                ) : (
                  <Phone className="w-7 h-7 text-primary" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  {step === 'input'
                    ? `${mode === 'email' ? 'Email' : 'Phone'} Verification`
                    : 'Enter Your Code'
                  }
                </h2>
                <p className="text-sm text-foreground-secondary">
                  {step === 'input'
                    ? 'We'll send you a secure one-time code'
                    : 'Check your ' + (mode === 'email' ? 'inbox' : 'messages')
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {message && (
              <div className="mb-6 p-4 bg-success-bg border-2 border-success-border/30 rounded-xl">
                <p className="text-success font-medium text-sm">{message}</p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-error-bg border-2 border-error-border/30 rounded-xl">
                <p className="text-error font-medium text-sm">{error}</p>
              </div>
            )}

            {step === 'input' ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                {mode === 'email' ? (
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      autoFocus
                      className="w-full h-14 px-5 border-2 border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground text-base placeholder:text-foreground-muted transition-all"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-3">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      required
                      autoFocus
                      className="w-full h-14 px-5 border-2 border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground text-base placeholder:text-foreground-muted transition-all"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 text-base font-semibold bg-gradient-to-r from-primary to-primary-hover shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <KeyRound className="w-5 h-5 mr-2" />
                      Send Verification Code
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3 text-center">
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    required
                    autoFocus
                    maxLength={6}
                    className="w-full h-20 px-6 border-2 border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-foreground text-center text-4xl tracking-[0.5em] font-mono font-bold placeholder:text-foreground-muted/30 transition-all"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full h-14 text-base font-semibold bg-gradient-to-r from-accent to-accent-hover text-accent-foreground shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Verify & Enter Council
                    </>
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setStep('input')
                    setOtp('')
                    setError('')
                    setMessage('')
                  }}
                  className="w-full text-sm text-foreground-tertiary hover:text-primary font-medium transition-colors"
                >
                  Didn't receive the code? Send again
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
