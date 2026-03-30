export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, segment } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const body = { email, reactivate_existing: true };
  if (segment) {
    body.custom_fields = [{ name: 'segment', value: segment }];
  }

  const response = await fetch(
    `https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUB_ID}/subscriptions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`,
      },
      body: JSON.stringify(body),
    }
  );

  const data = await response.json();
  return res.status(response.status).json(data);
}
