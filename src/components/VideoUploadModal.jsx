import React from 'react';

const VideoUploadModal = ({ onClose, onUpload, videoTitle, videoLink, setVideoTitle, setVideoLink }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                width: '90%',
                maxWidth: '500px'
            }}>
                <h3 style={{ marginBottom: '1.5rem', color: '#2a5298' }}>Upload Video Link</h3>
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
                        border: '1px solid #ddd'
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
                        border: '1px solid #ddd'
                    }}
                />
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '0.8rem 1.5rem',
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            background: 'white',
                            cursor: 'pointer'
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
                            background: '#2a5298',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        Upload
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoUploadModal;