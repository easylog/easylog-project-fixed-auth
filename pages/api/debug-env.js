// Middleware zur Überprüfung der Umgebungsvariablen
export default function handler(req, res) {
  // Aktivieren von CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Behandlung von OPTIONS-Anfragen (für CORS-Preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Überprüfen der Umgebungsvariablen
  const envStatus = {
    mongodb_uri: !!process.env.MONGODB_URI,
    mongodb_db: !!process.env.MONGODB_DB,
    jwt_secret: !!process.env.JWT_SECRET,
    node_env: process.env.NODE_ENV || 'development'
  };

  // Zusätzliche Informationen für Debugging
  const debugInfo = {
    apiEndpoint: req.url,
    method: req.method,
    headers: req.headers,
    timestamp: new Date().toISOString()
  };

  return res.status(200).json({
    message: 'Umgebungsvariablen-Status',
    envStatus,
    debugInfo
  });
}
