import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';
import { Toaster } from 'sonner';
import { showSuccessToast, showErrorToast } from '@/lib/toastUtils';

export default function ImportVideo() {
    const [videoUrl, setVideoUrl] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!videoUrl) {
            showErrorToast("Please paste a YouTube link.");
            return;
        }

        const videoId = extractYouTubeVideoID(videoUrl);

        if (!videoId) {
            showErrorToast("Invalid YouTube URL format.");
            return;
        }

        console.log("Extracted Video ID:", videoId);

        setTimeout(() => {
            navigate(`/user/video/${videoId}`);
        }, 300); 
    };

    function extractYouTubeVideoID(url) {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (!text) {
                showErrorToast("Clipboard is empty.");
                return;
            }
            setVideoUrl(text);
            showSuccessToast("Link pasted from clipboard!");
        } catch (error) {
            console.error(error);
            showErrorToast("Failed to read from clipboard.");
        }
    };

    return (
        <section className="w-full py-5 flex justify-center bg-gray-100">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-2xl min-w-[300px] bg-white shadow-[0px_0px_16px_0px_rgb(173,173,173)] mx-auto"
            >
                <Toaster richColors position="top-center" />
                <div className="text-left mb-3">
                    <h1 className="text-2xl font-bold text-gray-800 px-5 mt-4">Import Video</h1>
                </div>
                <hr />
                <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4 px-5 mb-8">
                    <div>
                        <Label htmlFor="videoUrl" className="block text-lg py-3 font-medium text-gray-700">
                            Paste YouTube link
                        </Label>
                        <Input
                            type="text"
                            id="videoUrl"
                            name="videoUrl"
                            placeholder="https://www.youtube.com/watch?v=wN4vVAZzZ9w"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0abb87]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            type="button"
                            onClick={handlePaste}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2"
                        >
                            Paste
                        </Button>

                        <Button
                            type="submit"
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2"
                        >
                            Import
                        </Button>
                    </div>
                </form>
            </motion.div>
        </section>
    );
}
