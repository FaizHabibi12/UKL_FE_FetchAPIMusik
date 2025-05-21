"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Playlist = {
    uuid: string;
    playlist_name: string;
    song_count: number;
};

export default function PlaylistPage() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetch("https://learn.smktelkom-mlg.sch.id/ukl2/playlists")
            .then((res) => res.json())
            .then((data) => {
                setPlaylists(data.data);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-center mt-8">Loading...</div>;

    return (
        <div className="max-w-sm mx-auto mt-8">
            {playlists.map((playlist) => (
                <div
                    key={playlist.uuid}
                    className="border-2 border-gray-800 rounded p-4 mb-4 bg-black shadow cursor-pointer"
                    onClick={() => router.push(`/songPlaylists/${playlist.uuid}`)}
                >
                    <div className="font-bold text-xl mb-1 text-white">
                        {playlist.playlist_name}
                    </div>
                    <div className="text-white">Song count: {playlist.song_count}</div>
                </div>
            ))}
        </div>
    );
}
