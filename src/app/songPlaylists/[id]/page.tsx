"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { get } from '../../../lib/api';
import { useRouter } from "next/navigation";

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

interface Playlist {
    uuid: string;
    playlist_name: string;
    song_list: Song[];
}

export default function PlaylistDetailPage() {
    const router = useRouter();
    const params = useParams();
    const playlistId = params.id as string;

    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                setLoading(true);
                const res = await get(
                    `https://learn.smktelkom-mlg.sch.id/ukl2/playlists/song-list/${playlistId}`
                );

                if (!res || typeof res !== "object" || !("success" in res)) {
                    throw new Error("Invalid response");
                }

                if (!res.success) {
                    const message = (res as { message?: string }).message;
                    throw new Error(message || "Failed to fetch songs");
                }

                const fakePlaylist: Playlist = {
                    uuid: playlistId,
                    playlist_name: `Playlist ${playlistId}`,
                    song_list: ((res as unknown) as { data: Song[] }).data || [],
                };

                setPlaylist(fakePlaylist);
                setFilteredSongs(fakePlaylist.song_list);
                setError(null);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message || "Something went wrong");
                } else {
                    setError("Something went wrong");
                }
                setPlaylist(null);
            } finally {
                setLoading(false);
            }
        };

        if (playlistId) fetchPlaylist();
    }, [playlistId]);


    useEffect(() => {
        if (!playlist || !playlist.song_list) return;

        const keyword = search.toLowerCase();
        const filtered = playlist.song_list.filter(
            (song) =>
                song.title.toLowerCase().includes(keyword) ||
                song.artist.toLowerCase().includes(keyword)
        );

        setFilteredSongs(filtered);
    }, [search, playlist]);

    return (
        <div className="p-6 max-w-4xl mx-auto bg-black min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-white">
                Playlist: {playlist?.playlist_name || "Loading..."}
            </h1>

            <input
                type="text"
                placeholder="Search by title or artist..."
                className="w-full p-2 border border-white rounded mb-4 bg-black text-white placeholder-gray-300"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {loading && <p className="text-white">Loading songs...</p>}
            {error && <p className="text-red-400">{error}</p>}
            {!loading && !error && (filteredSongs?.length ?? 0) === 0 && (
                <p className="text-white">No songs found.</p>
            )}

            {!loading && filteredSongs?.length > 0 && (
                <ul className="space-y-4">
                    {filteredSongs.map((song) => (
                        <li
                            key={song.uuid}
                            className="p-3 border border-white rounded bg-black shadow flex items-center gap-4 cursor-pointer hover:bg-white/10"
                            onClick={() => router.push(`/song/${song.uuid}`)}
                        >
                            <Image
                                src={`https://learn.smktelkom-mlg.sch.id/ukl2/thumbnail/${song.thumbnail}`}
                                unoptimized
                                alt={song.title}
                                width={80}
                                height={80}
                                className="object-cover rounded border border-white"
                            />
                            <div>
                                <p className="text-lg font-semibold text-white">{song.title}</p>
                                <p className="text-sm text-gray-300">By {song.artist}</p>
                                <p className="text-sm text-gray-400">❤️ {song.likes} likes</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
