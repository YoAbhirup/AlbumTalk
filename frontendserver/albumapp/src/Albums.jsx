import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; 
import TiltedCard from './components/TiltedCard/TiltedCard';
import Rating from '@mui/material/Rating';
import { ArrowLeft, Loader2, Music2 } from 'lucide-react';

export default function Albums() {
    const [loading, setLoading] = useState(false);
    const [albumRatings, setAlbumRatings] = useState({});
    const location = useLocation();
    const { albums } = location.state || {};
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRatings = async () => {
            if (!albums?.releases?.length) return;
    
            const albumIds = albums.releases.map(release => release.id).join(",");
    
            try {
                const response = await axios.get(`http://localhost:3000/getratings?albumIds=${albumIds}`);
    
                if (response.status === 200) {
                    setAlbumRatings(response.data);
                }
            } catch (error) {
                console.error("Error fetching ratings:", error);
            }
        };
    
        fetchRatings();
    }, [albums]);

    const openalbumpage = async (albumId) => {
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:3000/albumpage', { albumId });

            if (response.status === 200) {
                navigate('/albumpage', { state: { albumData: response.data.albumData } });
            }
        } catch (error) {
            console.error("Error fetching album details:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white">
            <div className="container mx-auto px-4 py-12">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-12">
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Search</span>
                    </button>
                    <div className="flex items-center space-x-3">
                        <Music2 className="w-6 h-6 text-purple-400" />
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Search Results
                        </h1>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white/10 p-6 rounded-2xl flex items-center space-x-3">
                            <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                            <p className="text-white">Loading album details...</p>
                        </div>
                    </div>
                )}

                {/* Results Grid */}
                {albums?.releases?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {albums.releases.slice(0, 12).map((release) => (
                            <div 
                                key={release.id} 
                                id={release.id} 
                                onClick={() => openalbumpage(release.id)}
                                className="transform hover:scale-105 transition duration-300 cursor-pointer"
                            >
                                <TiltedCard
                                    imageSrc={release.cover_art || "/placeholder.jpg"}
                                    altText={`${release.title} by ${release.artist}`}
                                    captionText={`${release.title} - ${release.artist}`}
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
                                            {release.title} <br />
                                            <span className="text-lg">{release.artist}</span>
                                        </h2>
                                        {release.url && (
                                            <a 
                                                href={release.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-green-300 text-sm"
                                            >
                                                Listen on Spotify
                                            </a>
                                        )}
                                        <Rating name="read-only" value={albumRatings[release.id] || 0} readOnly precision={0.5}/>
                                    </div>
                                    }
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <Music2 className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
                        <p className="text-xl text-red-400">
                            No results found for the given album and artist.
                        </p>
                        <button 
                            onClick={() => navigate('/')}
                            className="mt-4 text-purple-400 hover:text-purple-300 transition-colors"
                        >
                            Try another search
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}