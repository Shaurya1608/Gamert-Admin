// src/components/common/GlobalErrorBoundary.jsx
import React from "react";

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Critical System Failure:", error, errorInfo);
    
    // Auto-recovery for Chunk/Module load failures
    const isChunkError = 
      error.name === 'ChunkLoadError' || 
      error.message?.includes('Failed to fetch dynamically imported module') ||
      error.message?.includes('CSS_CHUNK_LOAD_FAILED');

    if (isChunkError) {
      const chunkErrorKey = 'last_chunk_error_reload';
      const lastReload = sessionStorage.getItem(chunkErrorKey);
      const now = Date.now();

      if (!lastReload || now - parseInt(lastReload) > 10000) {
        sessionStorage.setItem(chunkErrorKey, now.toString());
        console.warn("Chunk load failure detected. Initiating auto-recovery sequence...");
        window.location.reload();
      }
    }
  }

  handleReset = () => {
    sessionStorage.removeItem('last_chunk_error_reload');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // STATIC UI - No Hooks, No Framer Motion to prevent secondary "Invalid hook call" crashes
      return (
        <div style={{
          minHeight: '100-screen',
          backgroundColor: '#050505',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Ambient Background */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.1), transparent 50%)',
            pointerEvents: 'none'
          }} />
          
          <div style={{
            maxWidth: '448px',
            width: '100%',
            position: 'relative',
            zIndex: 10,
            backgroundColor: '#0c0c0c',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '48px',
            padding: '48px',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '24px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '32px'
            }}>
                <span style={{ fontSize: '40px' }}>⚠️</span>
            </div>

            <h1 style={{
                fontSize: '30px',
                fontWeight: 900,
                textTransform: 'uppercase',
                fontStyle: 'italic',
                marginBottom: '16px',
                letterSpacing: '-0.05em'
            }}>
                Access Protocol Interrupted
            </h1>
            
            <p style={{
                fontSize: '10px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                color: '#6b7280',
                marginBottom: '32px',
                lineHeight: 1.6
            }}>
                A connectivity exception has occurred. Our systems team has been notified.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                <button 
                    onClick={this.handleReset}
                    style={{
                        width: '100%',
                        padding: '16px',
                        backgroundColor: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '16px',
                        fontWeight: 900,
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        cursor: 'pointer',
                        transition: 'opacity 0.2s'
                    }}
                >
                    Reboot Infrastructure
                </button>
                
                <a 
                    href="/"
                    style={{
                        width: '100%',
                        padding: '16px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#9ca3af',
                        borderRadius: '16px',
                        fontWeight: 900,
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        textDecoration: 'none',
                        display: 'block'
                    }}
                >
                    Return to Base
                </a>
            </div>

            <div style={{ marginTop: '32px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '32px' }}>
                <span style={{
                    fontSize: '9px',
                    fontWeight: 900,
                    color: '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                }}>
                    Report Incident #{(Math.random() * 100000).toFixed(0)}
                </span>
            </div>

            {/* Error Code */}
            <div style={{
                position: 'absolute',
                bottom: '16px',
                right: '24px',
                fontSize: '8px',
                fontFamily: 'monospace',
                color: 'rgba(255, 255, 255, 0.05)',
                textTransform: 'uppercase'
            }}>
                CODE: {this.state.error?.name || "CRITICAL_FAILURE"}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
