import React from 'react';

const VideoUploadModal = ({ onClose, onUpload, videoTitle, videoLink, setVideoTitle, setVideoLink }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.3s ease-out'
        }}>
            <style>
                {`
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                        }
                        to {
                            opacity: 1;
                        }
                    }
                    @keyframes slideIn {
                        from {
                            opacity: 0;
                            transform: scale(0.95) translateY(10px);
                        }
                        to {
                            opacity: 1;
                            transform: scale(1) translateY(0);
                        }
                    }
                `}
            </style>
            <div style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                padding: '2rem',
                borderRadius: '12px',
                width: '90%',
                maxWidth: '500px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                animation: 'slideIn 0.3s ease-out'
            }}>
                {/* Decorative Elements */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100px',
                    height: '100px',
                    background: 'radial-gradient(circle, rgba(42,82,152,0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    transform: 'translate(30px, -30px)'
                }} />
                
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '150px',
                    height: '150px',
                    background: 'radial-gradient(circle, rgba(52,211,153,0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    transform: 'translate(-50px, 50px)'
                }} />

                {/* Header */}
                <div style={{
                    marginBottom: '1.5rem',
                    position: 'relative'
                }}>
                    <h3 style={{ 
                        fontSize: '1.5rem',
                        marginBottom: '0.5rem',
                        background: 'linear-gradient(135deg, #2a5298 0%, #34D399 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: '600'
                    }}>Upload Video Link</h3>
                    <div style={{
                        width: '60px',
                        height: '3px',
                        background: 'linear-gradient(90deg, #2a5298, #34D399)',
                        borderRadius: '3px',
                        marginTop: '0.5rem'
                    }} />
                </div>

                {/* Input Fields */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <input
                        type="text"
                        placeholder="Video Title"
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            marginBottom: '1rem',
                            borderRadius: '8px',
                            border: '2px solid rgba(42,82,152,0.1)',
                            background: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '1rem',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                            ':focus': {
                                borderColor: '#2a5298',
                                boxShadow: '0 4px 12px rgba(42,82,152,0.1)',
                                outline: 'none'
                            }
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Paste YouTube or Google Drive link"
                        value={videoLink}
                        onChange={(e) => setVideoLink(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            marginBottom: '1rem',
                            borderRadius: '8px',
                            border: '2px solid rgba(52,211,153,0.1)',
                            background: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '1rem',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                            ':focus': {
                                borderColor: '#34D399',
                                boxShadow: '0 4px 12px rgba(52,211,153,0.1)',
                                outline: 'none'
                            }
                        }}
                    />
                </div>

                {/* Buttons */}
                <div style={{ 
                    display: 'flex', 
                    gap: '1rem', 
                    justifyContent: 'flex-end',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '0.8rem 1.5rem',
                            borderRadius: '8px',
                            border: '2px solid rgba(42,82,152,0.1)',
                            background: 'white',
                            color: '#2a5298',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '500',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                            ':hover': {
                                background: 'rgba(42,82,152,0.05)',
                                transform: 'translateY(-2px)'
                            }
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onUpload}
                        style={{
                            padding: '0.8rem 1.5rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #2a5298 0%, #34D399 100%)',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '500',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 12px rgba(42,82,152,0.2)',
                            position: 'relative',
                            overflow: 'hidden',
                            ':hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 16px rgba(42,82,152,0.3)'
                            }
                        }}
                    >
                        <span style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
                            transform: 'translateX(-100%)',
                            animation: 'shimmer 2s infinite'
                        }} />
                        Upload
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoUploadModal;