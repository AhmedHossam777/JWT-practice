const getTokenFromHeader = (req) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  return token;
}

module.exports = getTokenFromHeader;