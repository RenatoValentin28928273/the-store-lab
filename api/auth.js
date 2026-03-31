export default (req, res) => {
  const GITHUB_AUTH_URL = `https://github.com/login/oauth/authorize`;
  const CLIENT_ID = process.env.OAUTH_CLIENT_ID;

  if (!CLIENT_ID) {
    return res.status(500).send("Erro: OAUTH_CLIENT_ID não está configurado na Vercel. Por favor, adicione-o em Settings > Environment Variables.");
  }

  const host = req.headers.host;
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const redirect_uri = `${protocol}://${host}/api/callback`;

  const url = `${GITHUB_AUTH_URL}?client_id=${CLIENT_ID}&scope=repo&redirect_uri=${redirect_uri}`;

  res.setHeader('Location', url);
  res.status(302).end();
};
