import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import axios from 'axios';
import { ArrowLeft, Calendar, Disc3, Loader2, Music2, Star, MessageSquare, Send } from 'lucide-react';

export default function AlbumPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { albumData } = location.state || {};
    const [value, setValue] = useState();
    const [loading, setLoading] = useState(false);
    const [commentloading, setcommentLoading] = useState(false);
    const [comment, setComment] = useState('');
    const [userComments, setUserComments] = useState([]);
    

    useEffect(() =>{
        const getComments = async()=>{
            try{
            const id = albumData.id;
            const response = await axios.get('https://album-app-api.azurewebsites.net/getcomments', {
                params: { id: albumData.id }  
            });
            if(response.status === 200){
                setUserComments(response.data);}
            } catch(error){
                console.error("Error fetching comments:", error);
            }
        }
        getComments();
    },[])

    const SubmitComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        
        setcommentLoading(true);
    
        try {
            const id = albumData.id;
            const date = new Date().toISOString();
    
            const response = await axios.post('https://album-app-api.azurewebsites.net/submitcomment', { 
                comment, 
                id, 
                date  
            });
    
            if (response.status === 200) {
                setComment('');
                // Refresh comments
                const newCommentsResponse = await axios.get('https://album-app-api.azurewebsites.net/getcomments', {
                    params: { id: albumData.id }
                });
    
                if (newCommentsResponse.status === 200) {
                    setUserComments(newCommentsResponse.data);
                }
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setcommentLoading(false);
        }
    };

    const submitrating = async(newValue) => {
        setValue(newValue);
        setLoading(true);
        try {
            const id = albumData.id;
            const name = albumData.name;
            const artist = albumData.artists[0].name;
            const img = albumData.images[1].url;
            const response = await axios.post("https://album-app-api.azurewebsites.net/submitrating", { 
                id, 
                name, 
                newrating: newValue, 
                artist, 
                img 
            });

            console.log("Server response:", response.data);
        } catch(error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffTime / (1000 * 60));

        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (!albumData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white flex items-center justify-center">
                <div className="text-center">
                    <Music2 className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
                    <p className="text-xl text-red-400 mb-4">Album not found</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="text-purple-400 hover:text-purple-300 transition-colors flex items-center justify-center space-x-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Return to Search</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white">
            <div className="container mx-auto px-4 py-12">
                {/* Header with Back Button */}
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors mb-8"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Results</span>
                </button>

                {/* Album Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    {/* Album Cover */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                        <div className="relative overflow-hidden">
                            {albumData.images?.[0]?.url ? (
                                <img 
                                    src={albumData.images[0].url} 
                                    alt="Album Cover"
                                    className="rounded-lg shadow-2xl w-full hover:scale-[1.12] duration-200"
                                />
                            ) : (
                                <div className="w-full aspect-square bg-gray-800 rounded-lg flex items-center justify-center">
                                    <Disc3 className="w-24 h-24 text-gray-700" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Album Details */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                {albumData.name}
                            </h1>
                            <h2 className="text-2xl text-gray-300">
                                {albumData.artists[0].name}
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 text-gray-300">
                                <Music2 className="w-5 h-5 text-purple-400" />
                                <span className="capitalize">{albumData.album_type}</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-300">
                                <Calendar className="w-5 h-5 text-purple-400" />
                                <span>{albumData.release_date}</span>
                            </div>
                        </div>

                        {/* Rating Section */}
                        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 space-y-4">
                            <div className="flex items-center space-x-3">
                                <Star className="w-5 h-5 text-purple-400" />
                                <h3 className="text-xl font-semibold">Rate this Album</h3>
                            </div>
                            <Rating
                                name="album-rating"
                                value={value}
                                onChange={(event, newValue) => {
                                    submitrating(newValue);
                                }}
                                precision={0.5}
                                size="large"
                                className="filter brightness-125"
                            />
                            {loading && (
                                <div className="flex items-center space-x-2 text-purple-400">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Submitting rating...</span>
                                </div>
                            )}
                        </div>

                        {/* Comments Section */}
                        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6">
                            <div className="flex items-center space-x-3 mb-6">
                                <MessageSquare className="w-5 h-5 text-purple-400" />
                                <h3 className="text-xl font-semibold">Comments</h3>
                                <span className="text-sm text-gray-400">({userComments.length})</span>
                            </div>

                            {/* Comment Form */}
                            <form onSubmit={SubmitComment} className="mb-6">
                                <div className="relative">
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        disabled={commentloading}
                                        placeholder="Share your thoughts..."
                                        className="w-full min-h-[100px] px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200 text-white placeholder-gray-400 resize-none"
                                    />
                                    <button
                                        type="submit"
                                        disabled={commentloading || !comment.trim()}
                                        className="absolute bottom-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-2 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {commentloading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Send className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* Comments List */}
                            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                                {userComments.length > 0 ? (
                                    userComments.map((comment, index) => (
                                        <div 
                                            key={comment.id || index} 
                                            className="bg-white/10 rounded-lg p-4 transition-all hover:bg-white/15"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <p className="text-gray-200 mb-2">{comment.usercomment}</p>
                                                    <span className="text-sm text-gray-400">
                                                        {formatDate(comment.created_at || new Date())}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                        <p className="text-gray-400">No comments yet. Be the first to share your thoughts!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}