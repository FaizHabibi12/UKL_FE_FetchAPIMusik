'use client';
import React, { useState, ChangeEvent, FormEvent } from 'react';

const AddSongPage: React.FC = () => {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [description, setDescription] = useState('');
    const [source, setSource] = useState('');
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setThumbnail(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!title || !artist || !description || !source || !thumbnail) {
            setMessage('All fields are required.');
            return;
        }

        // Simple URL validation
        try {
            new URL(source);
        } catch {
            setMessage('Source must be a valid URL.');
            return;
        }

        if (
            thumbnail &&
            !['image/png', 'image/jpeg', 'image/jpg'].includes(thumbnail.type)
        ) {
            setMessage('Thumbnail must be PNG, JPG, or JPEG.');
            return;
        }

        if (thumbnail && thumbnail.size > 2 * 1024 * 1024) {
            setMessage('Thumbnail size must be less than 2MB.');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('artist', artist);
        formData.append('description', description);
        formData.append('source', source);
        formData.append('thumbnail', thumbnail);

        try {
            const res = await fetch(
                'https://learn.smktelkom-mlg.sch.id/ukl2/playlists/song',
                {
                    method: 'POST',
                    body: formData,
                }
            );
            const data = await res.json();
            if (data.success) {
                setMessage('Song has created');
                setTitle('');
                setArtist('');
                setDescription('');
                setSource('');
                setThumbnail(null);
            } else {
                setMessage(data.message || 'Failed to create song.');
            }
        } catch {
            setMessage('Error submitting form.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-10 border border-gray-700 p-6 rounded-lg shadow bg-black text-white">
            <h2 className="text-2xl font-bold text-center mb-6">ADD SONG</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-4">
                    <label className="block font-medium mb-1">
                        Title
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full mt-1 px-3 py-2 border border-gray-700 rounded focus:outline-none focus:ring focus:ring-blue-800 bg-black text-white"
                            required
                        />
                    </label>
                </div>
                <div className="mb-4">
                    <label className="block font-medium mb-1">
                        Artist
                        <input
                            type="text"
                            value={artist}
                            onChange={e => setArtist(e.target.value)}
                            className="w-full mt-1 px-3 py-2 border border-gray-700 rounded focus:outline-none focus:ring focus:ring-blue-800 bg-black text-white"
                            required
                        />
                    </label>
                </div>
                <div className="mb-4">
                    <label className="block font-medium mb-1">
                        Description
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full mt-1 px-3 py-2 border border-gray-700 rounded focus:outline-none focus:ring focus:ring-blue-800 min-h-[60px] bg-black text-white"
                            required
                        />
                    </label>
                </div>
                <div className="mb-4">
                    <label className="block font-medium mb-1">
                        Source URL
                        <input
                            type="url"
                            value={source}
                            onChange={e => setSource(e.target.value)}
                            className="w-full mt-1 px-3 py-2 border border-gray-700 rounded focus:outline-none focus:ring focus:ring-blue-800 bg-black text-white"
                            required
                            placeholder="https://youtu.be/IpFX2vq8HKw?si=QaEp8wH_0muNSGPh"
                        />
                    </label>
                </div>
                <div className="mb-5">
                    <label className="block font-medium mb-1">
                        Thumbnail
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={handleFileChange}
                            className="block mt-1 text-white"
                            required
                        />
                        <span className="text-xs text-gray-400">
                            {thumbnail ? thumbnail.name : 'No file chosen'}
                        </span>
                    </label>
                </div>
                {message && (
                    <div
                        className={`mb-4 text-sm font-medium ${
                            message === 'Song has created' ? 'text-green-400' : 'text-red-400'
                        }`}
                    >
                        {message}
                    </div>
                )}
                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={() => {
                            setTitle('');
                            setArtist('');
                            setDescription('');
                            setSource('');
                            setThumbnail(null);
                            setMessage(null);
                        }}
                        disabled={loading}
                        className="px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 disabled:opacity-50"
                    >
                        cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 rounded bg-blue-800 hover:bg-blue-900 text-white font-semibold disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Song'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddSongPage;