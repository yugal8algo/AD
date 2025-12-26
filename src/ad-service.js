const { Client } = require('ldapts');
const config = require('../config');

class AdService {
  constructor() {
    this.config = config.ad;
  }

  /**
   * Creates a new LDAP client instance.
   * @returns {Client}
   */
  createClient() {
    return new Client({
      url: this.config.url,
      tlsOptions: {
        rejectUnauthorized: this.config.rejectUnauthorized
      }
    });
  }

  /**
   * Authenticates a user against Active Directory.
   * @param {string} username - The username (e.g., 'jdoe').
   * @param {string} password - The user's password.
   * @returns {Promise<Object>} - Returns user info if successful, throws error if failed.
   */
  async authenticate(username, password) {
    const client = this.createClient();

    try {
      // Construct the User Principal Name (UPN) or DN depending on your AD setup
      // Common formats: 'username@domain.com' or 'DOMAIN\username'
      const bindDN = `${username}${this.config.domainSuffix}`;

      // Attempt to bind (authenticate)
      await client.bind(bindDN, password);

      // If bind succeeds, the user is authenticated.
      // Now, let's fetch the user's details (like display name, groups, email).
      
      const filter = `(sAMAccountName=${username})`; // Filter to find the specific user
      
      const searchResult = await client.search(this.config.baseDN, {
        scope: 'sub',
        filter: filter,
        attributes: ['displayName', 'mail', 'memberOf', 'sAMAccountName'] // Fetch specific attributes
      });

      if (searchResult.searchEntries.length === 0) {
        throw new Error('User authenticated but not found in directory search.');
      }

      const userEntry = searchResult.searchEntries[0];

      // Return a flat object suitable for JWT payload
      return {
        username: userEntry.sAMAccountName,
        displayName: userEntry.displayName,
        email: userEntry.mail,
        groups: userEntry.memberOf
      };

    } catch (error) {
      console.error('AD Authentication failed:', error.message);
      throw new Error('Authentication failed: Invalid credentials or server error.');
    } finally {
      // Always ensure the client is unbound/disconnected to prevent leaks
      try {
        await client.unbind();
      } catch (ex) {
        // Ignore unbind errors
      }
    }
  }
}

module.exports = new AdService();
