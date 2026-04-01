export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, segment } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const pubId = process.env.BEEHIIV_PUB_ID;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`,
  };

  // Step 1: Create subscription
  const subUrl = `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`;
  const response = await fetch(subUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, reactivate_existing: true }),
  });

  const text = await response.text();
  console.log('Beehiiv status:', response.status, 'body:', text);

  if (!response.ok) {
    const data = JSON.parse(text);
    return res.status(response.status).json(data);
  }

  const data = JSON.parse(text);
  const subscriptionId = data.data && data.data.id;

  // Step 2: Add tag if segment provided
  if (segment && subscriptionId) {
    const tagUrl = `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions/${subscriptionId}/tags`;
    const tagRes = await fetch(tagUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ tags: [segment] }),
    });
    console.log('Beehiiv tag status:', tagRes.status);
  }

  return res.status(response.status).json(data);
}
