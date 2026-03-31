export default async (req, res) => {
  const code = req.query.code;
  const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
  const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
      }),
    });

    const data = await response.json();

    if (data.access_token) {
      // Retorna o token para o Decap CMS fechar o popup e logar
      // O CMS espera um script que faça 'postMessage' para sua janela pai
      res.send(`
        <html><body><script>
          (function() {
            function recieveMessage(e) {
              window.opener.postMessage(
                'authorization:github:success:${JSON.stringify({
                  token: data.access_token,
                  provider: 'github',
                })}',
                e.origin
              );
            }
            window.addEventListener("message", recieveMessage, false);
            window.opener.postMessage("authorizing:github", "*");
          })();
        </script></body></html>
      `);
    } else {
      res.status(500).send("Erro na autenticação: " + JSON.stringify(data));
    }
  } catch (error) {
    res.status(500).send("Erro interno no servidor de login :(");
  }
};
