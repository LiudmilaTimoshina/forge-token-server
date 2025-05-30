export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const params = new URLSearchParams();
    params.append('client_id', process.env.CLIENT_ID);
    params.append('client_secret', process.env.CLIENT_SECRET);
    params.append('grant_type', 'client_credentials');
    params.append('scope', 'viewables:read');

    const response = await fetch('https://developer.api.autodesk.com/authentication/v1/authenticate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });

    const data = await response.json();

    if (data.access_token) {
      res.status(200).json({ access_token: data.access_token });
    } else {
      res.status(500).json({ error: 'Token not received', details: data });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch token', details: err.message });
  }
}
