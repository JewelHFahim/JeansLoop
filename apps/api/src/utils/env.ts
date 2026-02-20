import dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = [
    'NODE_ENV',
    'MONGO_URI',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'STRIPE_SECRET_KEY'
];

export const validateEnv = () => {
    const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);

    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:');
        missing.forEach(m => console.error(`   - ${m}`));

        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    } else {
        console.log('✅ Environment variables validated');
    }

    if (!process.env.ALLOWED_ORIGINS && process.env.NODE_ENV === 'production') {
        console.warn('⚠️ WARNING: ALLOWED_ORIGINS is not set in production. Using defaults.');
    }
};
