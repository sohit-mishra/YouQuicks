import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";


export default function AllVideo() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const apiKey =  import.meta.env.VITE_Google_API_KEY; 
    const channelId = localStorage.getItem('channelId');

    useEffect(() => {
        if (!channelId) {
            setLoading(false);
            setError(true);
            return;
        }

        const fetchVideos = async () => {
            try {
                const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
                    params: {
                        key: apiKey,
                        channelId: channelId,
                        part: "snippet,id",
                        order: "date",
                        maxResults: 50,
                    },
                    withCredentials: false,
                });

                setVideos(response.data.items || []);
                setLoading(false);
                setError(false);
            } catch (error) {
                console.error("Error fetching videos:", error);
                setLoading(false);
                setError(true);
            }
        };

        fetchVideos();
    }, [channelId]);

    const filteredVideos = videos.filter(video => video.id && video.id.videoId);

    return (
        <section className="mt-5 flex flex-col lg:flex-row items-start justify-between gap-8 bg-gray-100">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white shadow-[0px_0px_16px_0px_rgb(173,173,173)] w-full max-w-4xl mx-auto"
            >
                <div className="text-left mt-3">
                    <h1 className="text-2xl font-bold px-5 py-2 text-gray-800">Suggested Videos</h1>
                </div>
                <hr />
                <div className="flex overflow-x-auto space-x-4 py-4 gap-5 scrollbar-thin mb-5">
                    {loading && <p className="p-5 text-gray-600">Loading videos...</p>}

                    {!loading && error && (
                        <p className="py-15 text-gray-600 text-2xl flex justify-center items-center w-full">No videos available.</p>
                    )}

                    {!loading && !error && filteredVideos.length === 0 && (
                        <p className="p-5 text-gray-600">No videos available.</p>
                    )}

                    {!loading && !error && filteredVideos.length > 0 &&
                        filteredVideos
                            .slice(0, filteredVideos.length - 1)
                            .map((video, i) => (
                                <Link
                                    key={i}
                                    to={`/user/video/${video.id.videoId}`}
                                    className="mx-2 pl-3 text-[#606060]"
                                >
                                    <div className="max-w-[250px] min-w-[230px] w-full h-[220px] bg-white rounded-[5px] shadow-[0_0_18px_1px_#adadad] flex-shrink-0">
                                        <img
                                            src={video.snippet.thumbnails.high.url}
                                            alt={video.snippet.title}
                                            className="w-full h-[140px] object-cover rounded-t-[5px]"
                                        />
                                        <div className="text-[15px] p-[5px] h-[70px] overflow-hidden w-full mt-2 font-semibold text-gray-800 leading-snug">
                                            {video.snippet.title}
                                        </div>
                                    </div>
                                </Link>
                            ))
                    }
                </div>
            </motion.div>
        </section>
    );
}
