"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Comment {
    comment_text: string;
    creator: string;
    createdAt: string;
}

interface Song {
    uuid: string;
    title: string;
    artist: string;
    description: string;
    source: string;
    thumbnail: string;
    likes: number;
    comments: Comment[];
}

export default function SongDetailPage() {
    const { id } = useParams();
    const [song, setSong] = useState<Song | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSong = async () => {
            try {
                const res = await fetch(`https://learn.smktelkom-mlg.sch.id/ukl2/playlists/song/${id}`);
                const data = await res.json();

                if (!data.success) throw new Error("Failed to fetch song");

                setSong(data.data);
            } catch {
                setError("Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchSong();
    }, [id]);

    const getYouTubeEmbedUrl = (url: string): string | null => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
        return match ? `https://www.youtube.com/embed/${match[1]}` : null;
    };

    if (loading) return <div className="text-center mt-6">Loading...</div>;
    if (error || !song) return <div className="text-center mt-6 text-red-500">{error}</div>;

    const embedUrl = getYouTubeEmbedUrl(song.source);

    return (
        <div className="max-w-2xl mx-auto p-4 bg-black text-white border border-white rounded">
            <h1 className="text-2xl font-bold mb-2">{song.title}</h1>
            <h2 className="text-lg text-gray-300 mb-4">Artist: {song.artist}</h2>

            <div className="mb-4">
                {embedUrl ? (
                    <iframe
                        width="100%"
                        height="315"
                        src={embedUrl}
                        title={song.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                ) : (
                    <p className="text-red-400">Invalid or unsupported YouTube URL.</p>
                )}
            </div>

            <p className="mb-6">{song.description}</p>

            <h3 className="text-xl font-semibold mb-2">Comments</h3>
            {song.comments.length === 0 ? (
                <p className="text-gray-400">No comments yet.</p>
            ) : (
                <ul className="space-y-3">
                    {song.comments.map((comment, index) => (
                        <li key={index} className="bg-black border border-white p-3 rounded shadow">
                            <p className="font-medium">{comment.creator}</p>
                            <p className="text-sm text-gray-400">
                                {new Date(comment.createdAt).toLocaleString()}
                            </p>
                            <p className="mt-1">{comment.comment_text}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
