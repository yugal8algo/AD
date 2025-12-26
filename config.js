require('dotenv').config();

module.exports = {
  ad: {
    // The LDAPS URL (e.g., ldaps://10.0.0.5:636)
    url: process.env.AD_URL || 'ldaps://your-ad-server.com',
    
    // The Base DN to search for users (e.g., dc=internal,dc=company,dc=com)
    baseDN: process.env.AD_BASE_DN || 'dc=example,dc=com',
    
    // Domain suffix for user principal name (e.g., @internal.company.com)
    domainSuffix: process.env.AD_DOMAIN_SUFFIX || '@example.com',

    // TLS Options
    rejectUnauthorized: process.env.AD_REJECT_UNAUTHORIZED === 'true'
  }
};