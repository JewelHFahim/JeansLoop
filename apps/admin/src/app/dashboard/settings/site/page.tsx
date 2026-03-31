'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi, uploadApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { 
    Save, 
    Globe, 
    Mail, 
    Phone, 
    MapPin, 
    Facebook, 
    Instagram, 
    Youtube, 
    MessageCircle, 
    Clock, 
    Megaphone,
    Upload,
    Loader2,
    Image as ImageIcon,
    Trash2
} from 'lucide-react';

export default function SiteSettingsPage() {
    const queryClient = useQueryClient();
    const [logoPreview, setLogoPreview] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);

    const { data: settings, isLoading } = useQuery({
        queryKey: ['site-settings'],
        queryFn: async () => {
            const response = await settingsApi.get();
            return response.data;
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: any) => settingsApi.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['site-settings'] });
            alert('Settings updated successfully!');
        },
        onError: (error: any) => {
            alert('Failed to update settings: ' + (error.response?.data?.message || error.message));
        }
    });

    const [formData, setFormData] = useState<any>({
        title: '',
        tagline: '',
        email: '',
        phone: '',
        address: '',
        locationMapUrl: '',
        businessHours: '',
        announcement: '',
        logo: '',
        socialLinks: {
            facebook: '',
            instagram: '',
            youtube: '',
            whatsapp: '',
            tiktok: '',
        }
    });

    useEffect(() => {
        if (settings) {
            setFormData({
                ...settings,
                socialLinks: settings.socialLinks || {
                    facebook: '',
                    instagram: '',
                    youtube: '',
                    whatsapp: '',
                    tiktok: '',
                }
            });
            if (settings.logo) setLogoPreview(settings.logo);
        }
    }, [settings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('social.')) {
            const socialPlatform = name.split('.')[1];
            setFormData((prev: any) => ({
                ...prev,
                socialLinks: {
                    ...prev.socialLinks,
                    [socialPlatform]: value
                }
            }));
        } else {
            setFormData((prev: any) => ({ ...prev, [name]: value }));
        }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const response = await uploadApi.uploadImage(file);
            const imageUrl = response.data.url;
            setFormData((prev: any) => ({ ...prev, logo: imageUrl }));
            setLogoPreview(imageUrl);
        } catch (error) {
            alert('Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate(formData);
    };

    if (isLoading) return <div className="p-8 text-xs font-black uppercase animate-pulse">Loading System Configurations...</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b-4 border-black pb-6 gap-4">
                <div>
                    <h1 className="text-2xl md:text-4xl font-black tracking-tighter uppercase italic leading-none">Site Configuration</h1>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-2">Global Identity & Connectivity Management</p>
                </div>
                <Button 
                    type="submit" 
                    disabled={updateMutation.isPending}
                    className="rounded-none bg-black text-white px-8 h-12 font-black uppercase tracking-widest text-xs shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50"
                >
                    {updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Configurations
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Identity */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6">
                        <div className="flex items-center gap-2 mb-6 border-b-2 border-black pb-2">
                            <ImageIcon className="w-4 h-4" />
                            <h2 className="text-xs font-black uppercase tracking-widest italic">Visual Branding</h2>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="aspect-square border-2 border-black bg-gray-50 flex items-center justify-center relative overflow-hidden group">
                                {logoPreview ? (
                                    <>
                                        <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-4" />
                                        <button 
                                            type="button"
                                            onClick={(e) => { 
                                                e.stopPropagation(); 
                                                setFormData((prev: any) => ({ ...prev, logo: '' })); 
                                                setLogoPreview(''); 
                                            }}
                                            className="absolute top-2 right-2 z-30 bg-red-600 text-white p-1 rounded-none border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-none transition-all active:scale-95"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-center p-4">
                                        <Globe className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                                        <span className="text-[9px] font-black uppercase text-gray-400">No Logo Loaded</span>
                                    </div>
                                )}
                                <label className="absolute inset-0 z-10 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Upload className="text-white w-6 h-6" />
                                    <input type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
                                </label>
                            </div>
                            <p className="text-[9px] font-black uppercase text-gray-400 text-center tracking-widest leading-relaxed">
                                Upload a high-resolution PNG or SVG with transparent background
                            </p>
                        </div>
                    </div>

                    <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6">
                        <div className="flex items-center gap-2 mb-6 border-b-2 border-black pb-2">
                            <Megaphone className="w-4 h-4" />
                            <h2 className="text-xs font-black uppercase tracking-widest italic">Announcements</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase mb-1">Banner Text</label>
                                <textarea
                                    name="announcement"
                                    value={formData.announcement}
                                    onChange={handleChange}
                                    placeholder="e.g. 50% Ramadan Sale Live Now!"
                                    className="w-full rounded-none border-2 border-black p-3 font-bold text-xs h-24 italic"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Core Settings */}
                <div className="lg:col-span-2 space-y-8">
                    {/* General Information */}
                    <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8">
                        <div className="flex items-center gap-2 mb-8 border-b-2 border-black pb-4">
                            <Globe className="w-5 h-5" />
                            <h2 className="text-sm font-black uppercase tracking-widest italic">General Identity</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black uppercase mb-2">Platform Title</label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-none border-2 border-black h-12 px-4 font-black uppercase italic tracking-widest text-sm"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black uppercase mb-2">Tagline / Slogan</label>
                                <input
                                    name="tagline"
                                    value={formData.tagline}
                                    onChange={handleChange}
                                    className="w-full rounded-none border-2 border-black h-12 px-4 font-black italic text-sm text-gray-600"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase mb-2"><Mail className="inline w-3 h-3 mr-1" /> Public Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full rounded-none border-2 border-black h-12 px-4 font-bold text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase mb-2"><Phone className="inline w-3 h-3 mr-1" /> Support Phone</label>
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full rounded-none border-2 border-black h-12 px-4 font-bold text-sm"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black uppercase mb-2"><MapPin className="inline w-3 h-3 mr-1" /> physical Address</label>
                                <input
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full rounded-none border-2 border-black h-12 px-4 font-bold text-sm"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black uppercase mb-2">Google Maps Embed URL</label>
                                <input
                                    name="locationMapUrl"
                                    value={formData.locationMapUrl}
                                    onChange={handleChange}
                                    className="w-full rounded-none border-2 border-black h-12 px-4 font-mono text-[10px]"
                                    placeholder="https://www.google.com/maps/embed?..."
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase mb-2"><Clock className="inline w-3 h-3 mr-1" /> Business Hours</label>
                                <input
                                    name="businessHours"
                                    value={formData.businessHours}
                                    onChange={handleChange}
                                    placeholder="Sat - Thu, 10am - 8pm"
                                    className="w-full rounded-none border-2 border-black h-12 px-4 font-bold text-sm italic"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social Connectivity */}
                    <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8">
                        <div className="flex items-center gap-2 mb-8 border-b-2 border-black pb-4">
                            <MessageCircle className="w-5 h-5" />
                            <h2 className="text-sm font-black uppercase tracking-widest italic">Social Connectivity</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-black uppercase mb-2 flex items-center gap-2"><Facebook className="w-3 h-3 text-blue-600" /> Facebook URL</label>
                                <input
                                    name="social.facebook"
                                    value={formData.socialLinks.facebook}
                                    onChange={handleChange}
                                    className="w-full rounded-none border-2 border-black h-10 px-4 font-mono text-[11px]"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase mb-2 flex items-center gap-2"><Instagram className="w-3 h-3 text-pink-600" /> Instagram URL</label>
                                <input
                                    name="social.instagram"
                                    value={formData.socialLinks.instagram}
                                    onChange={handleChange}
                                    className="w-full rounded-none border-2 border-black h-10 px-4 font-mono text-[11px]"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase mb-2 flex items-center gap-2"><Youtube className="w-3 h-3 text-red-600" /> Youtube Channel</label>
                                <input
                                    name="social.youtube"
                                    value={formData.socialLinks.youtube}
                                    onChange={handleChange}
                                    className="w-full rounded-none border-2 border-black h-10 px-4 font-mono text-[11px]"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase mb-2 flex items-center gap-2"><MessageCircle className="w-3 h-3 text-green-600" /> WhatsApp Number</label>
                                <input
                                    name="social.whatsapp"
                                    value={formData.socialLinks.whatsapp}
                                    onChange={handleChange}
                                    className="w-full rounded-none border-2 border-black h-10 px-4 font-bold text-[11px]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
