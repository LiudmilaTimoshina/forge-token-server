// api/forge/token.js
export default async function handler(req, res) {
    // Разрешаем только GET запросы
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Добавляем CORS заголовки
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    try {
        // Проверяем переменные окружения
        const clientId = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET;

        console.log('CLIENT_ID exists:', !!clientId);
        console.log('CLIENT_SECRET exists:', !!clientSecret);

        if (!clientId || !clientSecret) {
            return res.status(500).json({ 
                error: 'Server configuration error',
                details: 'Missing CLIENT_ID or CLIENT_SECRET environment variables'
            });
        }

        // Создаем параметры для запроса токена
        const tokenParams = new URLSearchParams();
        tokenParams.append('client_id', clientId);
        tokenParams.append('client_secret', clientSecret);
        tokenParams.append('grant_type', 'client_credentials');
        tokenParams.append('scope', 'viewables:read');

        console.log('Making request to Autodesk API...');

        // ✅ ПРАВИЛЬНЫЙ URL для APS (новый API)
        const response = await fetch('https://developer.api.autodesk.com/authentication/v2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: tokenParams
        });

        const data = await response.json();

        console.log('Autodesk API response status:', response.status);
        console.log('Autodesk API response:', data);

        if (response.ok && data.access_token) {
            return res.status(200).json({ 
                access_token: data.access_token,
                expires_in: data.expires_in,
                token_type: data.token_type || 'Bearer'
            });
        } else {
            return res.status(500).json({ 
                error: 'Failed to get token from Autodesk',
                details: data
            });
        }

    } catch (error) {
        console.error('Token generation error:', error);
        return res.status(500).json({ 
            error: 'Failed to fetch token', 
            details: error.message 
        });
    }
}
