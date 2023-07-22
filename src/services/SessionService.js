
import { caching } from 'cache-manager';
import { randomBytes } from 'crypto';

const sessionMemoryCache = await caching('memory', {
    max: 5,
    ttl: 2 * 60 * 60 * 1000 /*milliseconds*/, // 2 hours
});


export const createSession = async (accountId) => {
    console.log('Creating session for account id:', accountId);
    const newSessionId = randomBytes(16).toString('base64');
    const sessionData = { accountId: accountId };
    await sessionMemoryCache.set(newSessionId, sessionData);
    return newSessionId;
}

export const getSession = async (clientSessionId) => {
    console.log('Getting session for id:', clientSessionId);
    return await sessionMemoryCache.get(clientSessionId);
}
