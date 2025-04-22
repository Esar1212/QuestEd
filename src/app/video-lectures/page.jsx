'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function VideoLectures() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTeacherId, setSearchTeacherId] = useState('');
    const [searchTitle, setSearchTitle] = useState('');
    const [isSearching, setIsSearching] = useState(true);
    const router = useRouter();

    const getVideoId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const getVideoEmbed = (url) => {
        if (url.includes('drive.google.com')) {
            const driveId = url.match(/[-\w]{25,}/);
            if (driveId) {
                return `https://drive.google.com/file/d/${driveId[0]}/preview`;
            }
            return null;
        }
        const youtubeId = getVideoId(url);
        if (youtubeId) {
            return `https://www.youtube.com/embed/${youtubeId}`;
        }
        return null;
    };

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await fetch('/api/getVideos', {
                    credentials: 'include'
                });
                const data = await res.json();
                
                if (!res.ok) throw new Error(data.message);
                setVideos(data.videos);
            } catch (error) {
                console.error('Error fetching videos:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    const handleSearch = () => {
        setIsSearching(false);
    };

    const filteredVideos = videos.filter(video => 
        (!searchTeacherId || video.teacherId.toLowerCase().includes(searchTeacherId.toLowerCase())) &&
        (!searchTitle || video.title.toLowerCase().includes(searchTitle.toLowerCase()))
    );

    if (loading) return <LoadingSpinner />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div style={{
            padding: '6rem 2rem 2rem 2rem',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #5152d 5%, #0b1727 100%)'
        }}>
            {isSearching ? (
                <div style={{
                    maxWidth: '600px',
                    margin: '0 auto',
                    padding: '2.5rem',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 240, 255, 0.95) 100%)',
                    borderRadius: '20px',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Decorative Elements */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #4ade80, #6366f1, #ec4899, #f59e0b)',
                        backgroundSize: '300% 100%',
                        animation: 'gradient-shift 6s linear infinite'
                    }} />
                    
                    <div style={{
                        position: 'absolute',
                        top: '-50px',
                        right: '-50px',
                        width: '150px',
                        height: '150px',
                        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
                        borderRadius: '50%'
                    }} />
                    
                    <div style={{
                        position: 'absolute',
                        bottom: '-30px',
                        left: '-30px',
                        width: '120px',
                        height: '120px',
                        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
                        borderRadius: '50%'
                    }} />
                    
                    <h2 style={{
                        color: '#2a5298',
                        fontSize: '2rem',
                        textAlign: 'center',
                        marginBottom: '2.5rem',
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, #2a5298 0%, #6366f1 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        position: 'relative'
                    }}>
                        <span style={{
                            display: 'inline-block',
                            marginRight: '0.5rem',
                            fontSize: '2.2rem'
                        }}>🎥</span>
                        Find Your Video Lecture
                    </h2>
                    
                    <div style={{ 
                        marginBottom: '2rem',
                        position: 'relative'
                    }}>
                        <label style={{
                            display: 'block',
                            color: '#4a5568',
                            marginBottom: '0.75rem',
                            fontSize: '1.1rem',
                            fontWeight: '500'
                        }}>Which teacher's uploaded video you want to watch?</label>
                        <input
                            type="text"
                            value={searchTeacherId}
                            onChange={(e) => setSearchTeacherId(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem 1.25rem',
                                borderRadius: '12px',
                                border: '2px solid rgba(99, 102, 241, 0.2)',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease',
                                background: 'rgba(255, 255, 255, 0.9)',
                                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                                outline: 'none'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#6366f1';
                                e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.2)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                                e.target.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
                            }}
                            placeholder="Enter teacher's name"
                        />
                    </div>

                    <div style={{ 
                        marginBottom: '2.5rem',
                        position: 'relative'
                    }}>
                        <label style={{
                            display: 'block',
                            color: '#4a5568',
                            marginBottom: '0.75rem',
                            fontSize: '1.1rem',
                            fontWeight: '500'
                        }}>Which video do you want to watch?</label>
                        <input
                            type="text"
                            value={searchTitle}
                            onChange={(e) => setSearchTitle(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem 1.25rem',
                                borderRadius: '12px',
                                border: '2px solid rgba(99, 102, 241, 0.2)',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease',
                                background: 'rgba(255, 255, 255, 0.9)',
                                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                                outline: 'none'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#6366f1';
                                e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.2)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                                e.target.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
                            }}
                            placeholder="Enter video title"
                        />
                    </div>

                    <button
                        onClick={handleSearch}
                        style={{
                            width: '100%',
                            padding: '1.25rem',
                            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <span style={{ fontSize: '1.2rem' }}>🔍</span>
                        Search Video
                    </button>
                </div>
            ) : (
                <>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        maxWidth: '1400px',
                        margin: '0 auto 3rem auto',
                        background: 'rgba(255, 255, 255, 0.03)',
                        padding: '2rem',
                        borderRadius: '24px',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                    }}>
                        {/* Decorative gradient line */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(90deg, #4ade80, #6366f1, #ec4899, #f59e0b)',
                            backgroundSize: '300% 100%',
                            animation: 'gradient-shift 6s linear infinite'
                        }} />
                        
                        <h1 style={{
                            color: 'white',
                            fontSize: '3.5rem',
                            fontWeight: '800',
                            background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.5rem',
                            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                            letterSpacing: '-0.03em',
                            position: 'relative'
                        }}>
                            <span style={{
                                width: '64px',
                                height: '64px',
                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(99, 102, 241, 0.1))',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2.2rem',
                                backdropFilter: 'blur(4px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                boxShadow: '0 8px 32px rgba(99, 102, 241, 0.2)',
                                transform: 'rotate(-5deg)',
                                transition: 'all 0.3s ease'
                            }}>🎥</span>
                            Video Lectures
                            <span style={{
                                position: 'absolute',
                                bottom: '-10px',
                                left: '80px',
                                right: '0',
                                height: '4px',
                                background: 'linear-gradient(90deg, #6366f1, transparent)',
                                borderRadius: '2px'
                            }} />
                        </h1>
                        <button
                            onClick={() => setIsSearching(true)}
                            style={{
                                padding: '1rem 2rem',
                                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '16px',
                                cursor: 'pointer',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
                                fontFamily: '"Inter", sans-serif',
                                letterSpacing: '-0.01em'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 8px 30px rgba(99, 102, 241, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.3)';
                            }}
                        >
                            <span style={{ fontSize: '1.4rem' }}>🔍</span>
                            New Search
                        </button>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                        gap: '2.5rem',
                        maxWidth: '1400px',
                        margin: '0 auto',
                        padding: '0.5rem'
                    }}>
                        {filteredVideos.length > 0 ? (
                            filteredVideos.map((video) => (
                                <div key={video._id} style={{
                                    background: 'rgba(255, 255, 255, 0.98)',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    position: 'relative'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                                    e.currentTarget.style.boxShadow = '0 24px 50px rgba(0, 0, 0, 0.25)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
                                }}>
                                    {/* Decorative gradient line */}
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '4px',
                                        background: 'linear-gradient(90deg, #6366f1, #ec4899)',
                                        opacity: 0,
                                        transition: 'opacity 0.3s ease'
                                    }} />
                                    
                                    <div style={{
                                        position: 'relative',
                                        paddingTop: '56.25%',
                                        width: '100%',
                                        background: '#000'
                                    }}>
                                        <iframe
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                border: 'none'
                                            }}
                                            src={getVideoEmbed(video.link)}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>

                                    <div style={{ 
                                        padding: '1.8rem',
                                        background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(249,250,251,0.98) 100%)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        {/* Animated background effect */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '-50%',
                                            left: '-50%',
                                            width: '200%',
                                            height: '200%',
                                            background: 'radial-gradient(circle, rgba(99,102,241,0.03) 0%, transparent 50%)',
                                            animation: 'rotate 15s linear infinite',
                                            pointerEvents: 'none'
                                        }} />
                                        
                                        <style>{`
                                            @keyframes rotate {
                                                from { transform: rotate(0deg); }
                                                to { transform: rotate(360deg); }
                                            }
                                            @keyframes slideIn {
                                                from { transform: translateY(20px); opacity: 0; }
                                                to { transform: translateY(0); opacity: 1; }
                                            }
                                            @keyframes shimmer {
                                                0% { background-position: -200% center; }
                                                100% { background-position: 200% center; }
                                            }
                                        `}</style>

                                        <h3 style={{
                                            fontSize: '1.6rem',
                                            color: '#1e293b',
                                            marginBottom: '1.2rem',
                                            fontWeight: '700',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            letterSpacing: '-0.02em',
                                            lineHeight: '1.4',
                                            fontFamily: '"Cal Sans", "Inter", -apple-system, sans-serif',
                                            animation: 'slideIn 0.6s ease-out',
                                            background: 'linear-gradient(90deg, #1e293b, #334155, #1e293b)',
                                            backgroundSize: '200% auto',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            animation: 'shimmer 6s linear infinite'
                                        }}>
                                            <span style={{
                                                width: '40px',
                                                height: '40px',
                                                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                                borderRadius: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.4rem',
                                                color: 'white',
                                                boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
                                                transform: 'rotate(-5deg)',
                                                transition: 'transform 0.3s ease'
                                            }}>📼</span>
                                            {video.title}
                                        </h3>

                                        <div style={{
                                            display: 'flex',
                                            gap: '1rem',
                                            marginBottom: '1.2rem',
                                            animation: 'slideIn 0.6s ease-out 0.2s backwards'
                                        }}>
                                            <span style={{
                                                padding: '0.5rem 1.2rem',
                                                background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(99,102,241,0.2))',
                                                color: '#4338ca',
                                                borderRadius: '999px',
                                                fontSize: '1rem',
                                                fontWeight: '600',
                                                letterSpacing: '0.02em',
                                                border: '1px solid rgba(99,102,241,0.2)',
                                                boxShadow: '0 2px 8px rgba(99,102,241,0.1)',
                                                fontFamily: '"Inter", sans-serif',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                transition: 'all 0.3s ease'
                                            }}>
                                                <span style={{
                                                    width: '8px',
                                                    height: '8px',
                                                    background: '#4338ca',
                                                    borderRadius: '50%'
                                                }} />
                                                {video.subject}
                                            </span>
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginTop: '1.2rem',
                                            padding: '1rem 1.2rem',
                                            background: 'linear-gradient(to right, rgba(99,102,241,0.05), rgba(99,102,241,0.1))',
                                            borderRadius: '12px',
                                            fontSize: '0.95rem',
                                            color: '#4b5563',
                                            fontFamily: '"Inter", sans-serif',
                                            animation: 'slideIn 0.6s ease-out 0.4s backwards'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem'
                                            }}>
                                                <span style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontSize: '1rem',
                                                    boxShadow: '0 2px 8px rgba(99,102,241,0.2)'
                                                }}>👨‍🏫</span>
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '0.2rem'
                                                }}>
                                                    <span style={{
                                                        fontSize: '0.85rem',
                                                        color: '#6b7280',
                                                        fontWeight: '500'
                                                    }}>Teacher</span>
                                                    <span style={{
                                                        color: '#111827',
                                                        fontWeight: '600'
                                                    }}>{video.teacherId}</span>
                                                </div>
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                background: 'rgba(255,255,255,0.8)',
                                                padding: '0.5rem 0.75rem',
                                                borderRadius: '8px',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                                border: '1px solid rgba(0,0,0,0.05)'
                                            }}>
                                                <span style={{ 
                                                    fontSize: '1rem',
                                                    opacity: 0.8 
                                                }}>📅</span>
                                                <span style={{
                                                    fontSize: '0.9rem',
                                                    fontWeight: '500',
                                                    color: '#374151'
                                                }}>
                                                    {new Date(video.uploadedAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{
                                gridColumn: '1 / -1',
                                textAlign: 'center',
                                color: 'white',
                                padding: '3rem 2rem',
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '16px',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                fontSize: '1.2rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <span style={{ fontSize: '3rem' }}>🔍</span>
                                No videos found matching your search criteria.
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
