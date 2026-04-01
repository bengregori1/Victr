export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, segment } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const body = { email, reactivate_existing: true };
  if (segment) {
    body.tags = [segment];
  }

  const url = `https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUB_ID}/subscriptions`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  console.log('Beehiiv status:', response.status, 'body:', text);
  const data = JSON.parse(text);
  return res.status(response.status).json(data);
}
