import fetch = require('node-fetch');
import cache = require('memory-cache');

type Credentials = {
    WSKEY: string
    , secret: string
    , scopes: string[]
}

type Token = {
    access_token: string
    , expires_at: string
    , authenticating_institution_id: string
    , principalID: string
    , context_institution_id: string
    , scopes: string
    , token_type: string
    , expires_in: number
    , principalIDNS: string
}

async function freshToken(postURL: string, auth: string): Promise<unknown> {
    try {
        const res = await fetch(postURL, {
            method: 'post',
            headers: { 'Accept': 'application/json', 'Authorization': auth },
        });
        return res.json();
    } catch (err) {
        return (err as unknown);
    }
}

export async function getToken(credentials: Credentials) {

    const WSKEY         = credentials.WSKEY;
    const secret        = credentials.secret;
    const scopes        = credentials.scopes;
    const baseURL       = 'https://oauth.oclc.org/token?grant_type=client_credentials';
    const scopeString   = scopes.join('%20');
    const postURL       = `${baseURL}&scope=${scopeString}`;
    const auth          = 'Basic ' + Buffer.from(`${WSKEY}:${secret}`).toString('base64');


    let token = await cache.get('token');

    if (token === null) {
        // first time
        token = await freshToken(postURL, auth);
        cache.put('token', token);
        return token.access_token;
    } else if ( Date.parse(token.expires_at) < Date.now() ) {
        // token has expired, get a new one
        token = await freshToken(postURL, auth);
        cache.put('token', token);
        return token.access_token;
    } else {
        // token is still good
        return token.access_token;
    }
}
