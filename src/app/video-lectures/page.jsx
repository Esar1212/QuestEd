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
                    padding: '2rem',
                    background: 'rgba(230, 240, 247, 0.88)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    align-items: 'center'
                }}>
                    <h2 style={{
                        color: '#2a5298',
                        fontSize: '1.8rem',
                        textAlign: 'center',
                        marginBottom: '2rem',
                        font-weight: '600'
                    }}>Find Your Video Lecture</h2>
                    
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            color: '#444',
                            marginBottom: '0.5rem',
                            fontSize: '1rem',
                            font-weight: '500'
                        }}>Which teacher's uploaded video you want to watch?</label>
                        <input
                            type="text"
                            value={searchTeacherId}
                            onChange={(e) => setSearchTeacherId(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '8px',
                                border: '2px solid #818184',
                                fontSize: '1rem',
                                transition: 'border-color 0.3s ease',
                                ':focus': {
                                    borderColor: '#2a5298',
                                    outline: 'none'
                                }
                            }}
                            placeholder="Enter teacher's name"
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{
                            display: 'block',
                            color: '#444',
                            marginBottom: '0.5rem',
                            fontSize: '1rem',
                            font-weight: '500'
                        }}>Which video do you want to watch?</label>
                        <input
                            type="text"
                            value={searchTitle}
                            onChange={(e) => setSearchTitle(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '8px',
                                border: '2px solid #818184',
                                fontSize: '1rem',
                                transition: 'border-color 0.3s ease',
                                ':focus': {
                                    borderColor: '#2a5298',
                                    outline: 'none'
                                }
                            }}
                            placeholder="Enter video title"
                        />
                    </div>

                    <button
                        onClick={handleSearch}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: 'linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease',
                            ':hover': {
                                transform: 'translateY(-2px)'
                            }
                        }}
                    >
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
                        margin: '0 auto 2rem auto'
                    }}>
                        <h1 style={{
                            color: 'white',
                            fontSize: '2.5rem'
                        }}>Video Lectures</h1>
                        <button
                            onClick={() => setIsSearching(true)}
                            style={{
                                padding: '0.8rem 1.5rem',
                                background: '#2a5298',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            New Search
                        </button>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem',
                        maxWidth: '1400px',
                        margin: '0 auto'
                    }}>
                        {filteredVideos.length > 0 ? (
                            filteredVideos.map((video) => (
                                <div key={video._id} style={{
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    transition: 'transform 0.3s ease'
                                }}>
                                    <div style={{
                                        position: 'relative',
                                        paddingTop: '56.25%',
                                        width: '100%'
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

                                    <div style={{ padding: '1.5rem' }}>
                                        <h3 style={{
                                            fontSize: '1.2rem',
                                            color: '#2a5298',
                                            marginBottom: '0.5rem'
                                        }}>
                                            {video.title}
                                        </h3>
                                        <p style={{
                                            fontSize: '0.9rem',
                                            color: '#666',
                                            marginBottom: '0.5rem'
                                        }}>
                                            Subject: {video.subject}
                                        </p>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginTop: '1rem',
                                            fontSize: '0.8rem',
                                            color: '#888'
                                        }}>
                                            <span>Uploaded by : Teacher {video.teacherId}</span>
                                            <span>
                                                {new Date(video.uploadedAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{
                                gridColumn: '1 / -1',
                                textAlign: 'center',
                                color: 'white',
                                padding: '2rem',
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px'
                            }}>
                                No videos found matching your search criteria.
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
