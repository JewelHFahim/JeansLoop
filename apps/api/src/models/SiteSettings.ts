import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
    logo: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        required: true,
        default: 'JeansLoop'
    },
    tagline: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    locationMapUrl: {
        type: String,
        default: ''
    },
    socialLinks: {
        facebook: { type: String, default: '' },
        instagram: { type: String, default: '' },
        youtube: { type: String, default: '' },
        whatsapp: { type: String, default: '' },
        tiktok: { type: String, default: '' },
    },
    businessHours: {
        type: String,
        default: ''
    },
    announcement: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

export const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
