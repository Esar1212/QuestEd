export default function LoadingSpinner() {
    const size = 'clamp(50px, 10vw, 120px)';
  
    const spinnerStyle = {
      position: 'relative',
      width: size,
      height: size,
    };
  
    const ringStyle = (color, scale, duration, blur) => ({
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: `calc(${size} * ${scale})`,
      height: `calc(${size} * ${scale})`,
      marginTop: `calc(${size} * -0.5 * ${scale})`,
      marginLeft: `calc(${size} * -0.5 * ${scale})`,
      border: `4px solid ${color}`,
      borderTop: '4px solid transparent',
      borderRadius: '50%',
      animation: `spin ${duration}s linear infinite`,
      filter: `blur(${blur}px)`,
      boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
    });
  
    const containerStyle = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      minHeight: '200px',
      background: 'transparent',
      padding: '20px',
      boxSizing: 'border-box',
    };
  
    return (
      <div style={containerStyle}>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={spinnerStyle}>
            <div style={ringStyle('#00f0ff', 1, 1.2, 1)} />
            <div style={ringStyle('#ff00c8', 0.8, 2, 2)} />
            <div style={ringStyle('#faff00', 0.6, 2.8, 1)} />
          </div>
          <p style={{
            color: '#00f0ff',
            fontSize: '1.2rem',
            fontWeight: '500',
            marginTop: '20px',
            textAlign: 'center',
            textShadow: '0 0 8px rgba(0, 240, 255, 0.6)',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Loading... Please wait
          </p>
        </div>
      </div>
    );
}
