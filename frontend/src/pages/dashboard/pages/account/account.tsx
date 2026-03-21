import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../../store/store';
import { loginUser } from '../../../../store/slice/authSlice';

const AccountPage = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<any>();

    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const [name, setName] = useState('');
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(null);

    const [profilePreview, setProfilePreview] = useState<string>('');
    const [backgroundPreview, setBackgroundPreview] = useState<string>('');

    useEffect(() => {
        if (user) {
            setName(user.name);
            setProfilePreview(user.profileImage || '');
            setBackgroundPreview(user.backgroundImage || '');
        }
    }, [user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profileImage' | 'backgroundImage') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        if (type === 'profileImage') {
            setProfileImageFile(file);
            setProfilePreview(previewUrl);
        } else {
            setBackgroundImageFile(file);
            setBackgroundPreview(previewUrl);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            setSuccessMsg('');

            const formData = new FormData();
            if (name !== user?.name) {
                formData.append('name', name);
            }
            if (profileImageFile) {
                formData.append('profileImage', profileImageFile);
            }
            if (backgroundImageFile) {
                formData.append('backgroundImage', backgroundImageFile);
            }

            const SERVER_PATH = import.meta.env.VITE_BACKEND_PATH;
            const res = await fetch(`${SERVER_PATH}/api/users`, {
                method: "PUT",
                credentials: "include",
                body: formData // multer needs form-data
            });

            if (res.ok) {
                setSuccessMsg('Account updated successfully!');
                dispatch(loginUser());
                setTimeout(() => setSuccessMsg(''), 3000);
                setProfileImageFile(null);
                setBackgroundImageFile(null);
            } else {
                console.error("Failed to update account");
            }
        } catch (error) {
            console.error("Error updating account", error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="p-8 text-center text-gray-500">Loading user info...</div>;

    return (
        <div className="w-full h-full flex flex-col p-8 items-center bg-gray-50">
            <h1 className="text-3xl font-bold w-full max-w-4xl text-left mb-6 text-gray-800 tracking-tight">Account Profile</h1>
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl overflow-hidden relative">

                <div
                    className="w-full h-64 bg-gray-200 relative group flex items-center justify-center overflow-hidden"
                    style={{
                        backgroundImage: backgroundPreview ? `url(${backgroundPreview})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {!backgroundPreview && <span className="text-gray-400 font-medium">No Background Image</span>}
                    <label className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-5 py-2.5 rounded-lg cursor-pointer hover:bg-black/80 transition opacity-0 group-hover:opacity-100 font-medium shadow-md">
                        Change Background
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'backgroundImage')} disabled={loading} />
                    </label>
                </div>

                <div className="px-8 pb-10 relative flex flex-col items-center">
                    <div className="w-36 h-36 rounded-full border-4 border-white overflow-hidden bg-gray-100 -mt-18 mb-6 relative group shadow-lg flex items-center justify-center">
                        {profilePreview ? (
                            <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-5xl text-gray-400 font-semibold">{user.name?.charAt(0).toUpperCase()}</div>
                        )}
                        <label className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer font-semibold backdrop-blur-sm rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                            Upload
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'profileImage')} disabled={loading} />
                        </label>
                    </div>

                    <div className="text-center w-full max-w-md">
                        <div className="mb-6 flex flex-col items-start w-full gap-1">
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="mb-8 flex flex-col items-start w-full gap-1">
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Email <span className="text-gray-400 font-normal lowercase">(Read Only)</span></label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-lg font-medium text-gray-500 cursor-not-allowed"
                            />
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={loading || (!profileImageFile && !backgroundImageFile && name === user.name)}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md active:scale-95 flex justify-center items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                                    Saving...
                                </>
                            ) : 'Save Changes'}
                        </button>
                    </div>

                    <div className="mt-6 min-h-[24px]">
                        {successMsg && <div className="text-green-600 bg-green-50 px-4 py-2 rounded-md border border-green-100 font-medium inline-flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> {successMsg}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
