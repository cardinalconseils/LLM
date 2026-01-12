import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './ui/button'
import { Mail, Phone, ArrowLeft, Loader2, Users, Shield, KeyRound } from 'lucide-react'

export default function Login() {
  const { signInWithEmail, signInWithPhone, verifyEmailOtp, verifyPhoneOtp } = useAuth()

  const [mode, setMode] = useState(null) // 'email' | 'phone' | null
  const [step, setStep] = useState('input') // 'input' | 'verify'

  // Force full viewport layout
  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    height: '100vh',
  }
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  // Normalize phone number to E.164 format (e.g., +14388018302)
  const normalizePhone = (phoneInput) => {
    // Remove all non-digit characters except leading +
    const cleaned = phoneInput.replace(/[^\d+]/g, '')

    // If it starts with +, use as-is
    if (cleaned.startsWith('+')) {
      return cleaned
    }

    // If it starts with 1 and has 11 digits, add +
    if (cleaned.startsWith('1') && cleaned.length === 11) {
      return '+' + cleaned
    }

    // If it has 10 digits, assume US/Canada and add +1
    if (cleaned.length === 10) {
      return '+1' + cleaned
    }

    // Otherwise return cleaned version
    return cleaned.startsWith('+') ? cleaned : '+' + cleaned
  }

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
        // Normalize phone number before sending
        const normalizedPhone = normalizePhone(phone)
        const { error } = await signInWithPhone(normalizedPhone)
        if (error) {
          setError(`Failed to send verification code: ${error.message}`)
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
        // Normalize phone number before verifying
        const normalizedPhone = normalizePhone(phone)
        const { error } = await verifyPhoneOtp(normalizedPhone, otp)
        if (error) {
          if (error.message.includes('Invalid token') || error.message.includes('expired')) {
            setError('Invalid or expired code. Please try again.')
          } else if (error.message.includes('not found')) {
            setError('This phone number is not registered. Contact an administrator.')
          } else {
            setError(error.message)
          }
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

  // Inline styles for reliable rendering
  const styles = {
    container: {
      ...containerStyle,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #fdfbf7 0%, #f5f3ed 50%, #eae7df 100%)',
      padding: '24px',
      overflow: 'auto',
    },
    wrapper: {
      width: '100%',
      maxWidth: '448px',
    },
    logoSection: {
      textAlign: 'center',
      marginBottom: '48px',
    },
    logoContainer: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '96px',
      height: '96px',
      borderRadius: '24px',
      background: 'linear-gradient(135deg, #2d3561 0%, #3d4676 100%)',
      color: 'white',
      boxShadow: '0 16px 48px rgba(29, 33, 45, 0.15)',
      marginBottom: '24px',
    },
    title: {
      fontSize: '2.25rem',
      fontWeight: '700',
      color: '#1a1d2e',
      marginBottom: '8px',
      letterSpacing: '-0.025em',
    },
    subtitle: {
      fontSize: '1.125rem',
      color: '#4a4d5e',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 16px 48px rgba(29, 33, 45, 0.10), 0 8px 16px rgba(29, 33, 45, 0.05)',
      border: '2px solid #e8e5dd',
      overflow: 'hidden',
    },
    cardContent: {
      padding: '32px',
    },
    headerSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '24px',
      paddingBottom: '24px',
      borderBottom: '2px solid #e8e5dd',
    },
    iconBox: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, rgba(45, 53, 97, 0.1) 0%, rgba(212, 165, 116, 0.05) 100%)',
    },
    headerText: {
      flex: 1,
    },
    headerTitle: {
      fontSize: '1.125rem',
      fontWeight: '700',
      color: '#1a1d2e',
      marginBottom: '4px',
    },
    headerSubtitle: {
      fontSize: '0.875rem',
      color: '#6b6e7e',
    },
    optionButton: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '20px',
      borderRadius: '12px',
      textAlign: 'left',
      background: 'linear-gradient(135deg, #f5f3ed 0%, #fdfbf7 100%)',
      border: '2px solid #e8e5dd',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginBottom: '12px',
    },
    optionIconBox: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, rgba(45, 53, 97, 0.1) 0%, rgba(212, 165, 116, 0.05) 100%)',
      boxShadow: '0 4px 8px rgba(29, 33, 45, 0.06)',
      flexShrink: 0,
    },
    optionContent: {
      flex: 1,
      minWidth: 0,
    },
    optionTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#1a1d2e',
      marginBottom: '4px',
    },
    optionSubtitle: {
      fontSize: '0.875rem',
      color: '#6b6e7e',
    },
    footer: {
      padding: '20px 32px',
      background: 'linear-gradient(90deg, rgba(245, 243, 237, 0.5) 0%, transparent 100%)',
      borderTop: '2px solid #e8e5dd',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '0.75rem',
      color: '#6b6e7e',
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'none',
      border: 'none',
      color: '#6b6e7e',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      padding: '0',
      marginBottom: '24px',
    },
    formHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '32px',
    },
    formIconBox: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '56px',
      height: '56px',
      borderRadius: '16px',
      background: 'linear-gradient(135deg, rgba(45, 53, 97, 0.1) 0%, rgba(212, 165, 116, 0.05) 100%)',
      boxShadow: '0 8px 24px rgba(29, 33, 45, 0.08)',
      flexShrink: 0,
    },
    formTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#1a1d2e',
      marginBottom: '4px',
    },
    formSubtitle: {
      fontSize: '0.875rem',
      color: '#4a4d5e',
    },
    messageBox: {
      marginBottom: '24px',
      padding: '16px',
      borderRadius: '12px',
      fontSize: '0.875rem',
      fontWeight: '500',
    },
    successBox: {
      backgroundColor: '#f0f9f4',
      border: '2px solid rgba(74, 157, 111, 0.3)',
      color: '#4a9d6f',
    },
    errorBox: {
      backgroundColor: '#fdf2f2',
      border: '2px solid rgba(199, 75, 75, 0.3)',
      color: '#c74b4b',
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#1a1d2e',
      marginBottom: '12px',
    },
    input: {
      width: '100%',
      height: '56px',
      padding: '0 20px',
      fontSize: '1rem',
      border: '2px solid #e8e5dd',
      borderRadius: '12px',
      outline: 'none',
      color: '#1a1d2e',
      transition: 'all 0.2s ease',
    },
    otpInput: {
      width: '100%',
      height: '80px',
      padding: '0 24px',
      fontSize: '2.25rem',
      fontFamily: 'monospace',
      fontWeight: '700',
      textAlign: 'center',
      letterSpacing: '0.5em',
      border: '2px solid #e8e5dd',
      borderRadius: '12px',
      outline: 'none',
      color: '#1a1d2e',
      transition: 'all 0.2s ease',
    },
    resendButton: {
      width: '100%',
      background: 'none',
      border: 'none',
      color: '#6b6e7e',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      padding: '8px',
      marginTop: '16px',
    },
  }

  // Mode selection screen
  if (!mode) {
    return (
      <div style={styles.container} className="w-full">
        <div style={styles.wrapper} className="w-full">
          {/* Logo Section */}
          <div style={styles.logoSection}>
            <div style={styles.logoContainer}>
              <Users size={48} />
            </div>
            <h1 style={styles.title}>LLM Council</h1>
            <p style={styles.subtitle}>Enter the Council Chamber</p>
          </div>

          {/* Authentication Card */}
          <div style={styles.card}>
            <div style={styles.cardContent}>
              <div style={styles.headerSection}>
                <div style={styles.iconBox}>
                  <Shield size={20} style={{ color: '#2d3561' }} />
                </div>
                <div style={styles.headerText}>
                  <div style={styles.headerTitle}>Secure Authentication</div>
                  <div style={styles.headerSubtitle}>Choose your verification method</div>
                </div>
              </div>

              <div>
                <button
                  onClick={() => setMode('email')}
                  style={styles.optionButton}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(45, 53, 97, 0.4)'
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(29, 33, 45, 0.06)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e8e5dd'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={styles.optionIconBox}>
                    <Mail size={24} style={{ color: '#2d3561' }} />
                  </div>
                  <div style={styles.optionContent}>
                    <div style={styles.optionTitle}>Continue with Email</div>
                    <div style={styles.optionSubtitle}>Receive OTP via email</div>
                  </div>
                  <ArrowLeft size={20} style={{ color: '#9b9dad', transform: 'rotate(180deg)', flexShrink: 0 }} />
                </button>

                <button
                  onClick={() => setMode('phone')}
                  style={styles.optionButton}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(45, 53, 97, 0.4)'
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(29, 33, 45, 0.06)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e8e5dd'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={styles.optionIconBox}>
                    <Phone size={24} style={{ color: '#2d3561' }} />
                  </div>
                  <div style={styles.optionContent}>
                    <div style={styles.optionTitle}>Continue with Phone</div>
                    <div style={styles.optionSubtitle}>Receive OTP via SMS</div>
                  </div>
                  <ArrowLeft size={20} style={{ color: '#9b9dad', transform: 'rotate(180deg)', flexShrink: 0 }} />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div style={styles.footer}>
              <KeyRound size={14} style={{ color: '#d4a574' }} />
              <span style={{ fontWeight: '500' }}>Authorized council members only</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Email/Phone input or OTP verification screen
  return (
    <div style={styles.container} className="w-full">
      <div style={styles.wrapper} className="w-full">
        <div style={styles.card}>
          <div style={styles.cardContent}>
            {/* Back Button */}
            <button
              onClick={handleBack}
              style={styles.backButton}
              onMouseOver={(e) => e.currentTarget.style.color = '#2d3561'}
              onMouseOut={(e) => e.currentTarget.style.color = '#6b6e7e'}
            >
              <ArrowLeft size={16} />
              Back
            </button>

            {/* Form Header */}
            <div style={styles.formHeader}>
              <div style={styles.formIconBox}>
                {mode === 'email' ? (
                  <Mail size={28} style={{ color: '#2d3561' }} />
                ) : (
                  <Phone size={28} style={{ color: '#2d3561' }} />
                )}
              </div>
              <div>
                <h2 style={styles.formTitle}>
                  {step === 'input'
                    ? `${mode === 'email' ? 'Email' : 'Phone'} Verification`
                    : 'Enter Your Code'
                  }
                </h2>
                <p style={styles.formSubtitle}>
                  {step === 'input'
                    ? "We'll send you a secure one-time code"
                    : `Check your ${mode === 'email' ? 'inbox' : 'messages'}`
                  }
                </p>
              </div>
            </div>

            {/* Messages */}
            {message && (
              <div style={{ ...styles.messageBox, ...styles.successBox }}>
                {message}
              </div>
            )}

            {error && (
              <div style={{ ...styles.messageBox, ...styles.errorBox }}>
                {error}
              </div>
            )}

            {/* Forms */}
            {step === 'input' ? (
              <form onSubmit={handleSendOtp}>
                <div style={{ marginBottom: '24px' }}>
                  <label style={styles.label}>
                    {mode === 'email' ? 'Email Address' : 'Phone Number'}
                  </label>
                  {mode === 'email' ? (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      autoFocus
                      style={styles.input}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#2d3561'
                        e.target.style.boxShadow = '0 0 0 3px rgba(45, 53, 97, 0.08)'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e8e5dd'
                        e.target.style.boxShadow = 'none'
                      }}
                    />
                  ) : (
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 438 801 8302 or 4388018302"
                      required
                      autoFocus
                      style={styles.input}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#2d3561'
                        e.target.style.boxShadow = '0 0 0 3px rgba(45, 53, 97, 0.08)'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e8e5dd'
                        e.target.style.boxShadow = 'none'
                      }}
                    />
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 text-base font-semibold"
                  style={{
                    background: 'linear-gradient(90deg, #2d3561 0%, #3d4676 100%)',
                    boxShadow: '0 8px 24px rgba(29, 33, 45, 0.08)',
                  }}
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
              <form onSubmit={handleVerifyOtp}>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ ...styles.label, textAlign: 'center' }}>
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
                    style={styles.otpInput}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#d4a574'
                      e.target.style.boxShadow = '0 0 0 3px rgba(212, 165, 116, 0.12)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e8e5dd'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full h-14 text-base font-semibold"
                  style={{
                    background: 'linear-gradient(90deg, #d4a574 0%, #e6c299 100%)',
                    color: '#1a1d2e',
                    boxShadow: '0 8px 24px rgba(29, 33, 45, 0.08)',
                    opacity: loading || otp.length !== 6 ? 0.5 : 1,
                  }}
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
                  style={styles.resendButton}
                  onMouseOver={(e) => e.currentTarget.style.color = '#2d3561'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#6b6e7e'}
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
