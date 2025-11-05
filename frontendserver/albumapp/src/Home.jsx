import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TiltedCard from './components/TiltedCard/TiltedCard';
import Rating from '@mui/material/Rating';
import { Search, Disc3, Loader2 } from 'lucide-react';

export default function Home() {
    const [album, setAlbum] = useState('');
    const [artist, setArtist] = useState('');  
    const [loading, setLoading] = useState(false);
    const [albumsloading, setAlbumsLoading] = useState(false);
    const [topAlbums, setTopAlbums] = useState([]);
    const navigate = useNavigate();
    
    
    useEffect(() => {
        const topalbums = async() => {
            setAlbumsLoading(true);
            try {
                const response = await axios.get('https://album-app-api.azurewebsites.net/topalbums');
                if (response.status === 200) {
                    setTopAlbums(response.data);  
                }
            } catch (error) {
                console.error("Error fetching ratings:", error);
            } finally {
                setAlbumsLoading(false);
            }
        }

        topalbums();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('https://album-app-api.azurewebsites.net/api', { album, artist });  
            if (response.status === 200) {
                navigate('/albums', { state: { albums: response.data } });
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white">
            <div className="container mx-auto px-4 py-12">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center mb-6">
                        <Disc3 className="w-12 h-12 text-purple-400 animate-spin-slow" />
                    </div>
                    <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent" style={{fontFamily:'"Montserrat", serif'}}>
                        AlbumTalk
                    </h1>
                    <p className="text-gray-300 text-2xl" style={{fontFamily:'"Montserrat",serif'}}>
                        Discover and rate your favorite music
                    </p>
                </div>

                {/* Search Form */}
                <div className="max-w-2xl mx-auto mb-20 bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-200">
                                Album Name
                            </label>
                            <input
                                type="text"
                                value={album}
                                onChange={(e) => setAlbum(e.target.value)}
                                disabled={loading}
                                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200 text-white placeholder-gray-400"
                                placeholder="Enter album name..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-200">
                                Artist Name
                            </label>
                            <input
                                type="text"
                                value={artist}
                                onChange={(e) => setArtist(e.target.value)}
                                disabled={loading}
                                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200 text-white placeholder-gray-400"
                                placeholder="Enter artist name..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition duration-200 disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Search className="w-5 h-5" />
                                    <span>Search Albums</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Top Albums Section */}
                <div className="mt-16">
                    <h2 className="text-3xl font-bold mb-12 text-center topalbumstoday" >
                        Top Albums Today
                    </h2>
                    
                    {albumsloading ? (
                        <div className="flex justify-center items-center">
                            <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                        </div>
                    ) : topAlbums?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                            {topAlbums.map((release) => (
                                <div key={release.id} id={release.id} className="transform hover:scale-105 transition duration-300">
                                    <TiltedCard
                                        imageSrc={release.image}
                                        altText={`${release.name} by ${release.artist}`}
                                        captionText={`${release.name} - ${release.artist}`}
                                        containerHeight="300px"
                                        containerWidth="300px"
                                        imageHeight="300px"
                                        imageWidth="300px"
                                        rotateAmplitude={12}
                                        scaleOnHover={1.2}
                                        showMobileWarning={false}
                                        showTooltip={true}
                                        displayOverlayContent={true}
                                        overlayContent={
                                            <div className="ml-8 mt-8 py-2 px-4 bg-black/50 rounded-2xl">
                                        <h2 className="tilted-card-demo-text text-white text-2xl font-semibold">
                                            {release.name} <br />
                                            <span className="text-lg">{release.artist}</span>
                                        </h2>
                                        
                                        
                                        
                                        <Rating name="read-only" value={release.rating || 0} readOnly precision={0.5}/>
                                    </div>
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-xl text-red-400">
                            No albums found
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}