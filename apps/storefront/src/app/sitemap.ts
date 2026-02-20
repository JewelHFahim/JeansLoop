import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://jeansloop.com'

    // Static routes
    const routes = [
        '',
        '/shop',
        '/contact',
        '/faq',
        '/shipping',
        '/returns',
        '/privacy',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    try {
        // In a real production scenario, we would fetch all products from the API here
        // For now, we contribute the static routes
        return [...routes]
    } catch (error) {
        return routes
    }
}
