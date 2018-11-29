// from https://github.com/hapijs/hapi-auth-cookie#hapi-auth-cookie

import cookieAuth, { validateFunc } from 'hapi-auth-cookie';
import { Server, Request } from 'hapi';

const server = new Server();

const cache = server.cache({
    segment: 'test',
    expiresIn: 3 * 24 * 60 * 60 * 1000
});

const validateFunc: validateFunc = async (request: Request, session: any) => {
    const valid = await request.server.app.cache.get('hello');
    const out = {
        valid: !!valid
    };

    return out;
};

server.register(cookieAuth).then(() => {
    server.auth.strategy('session', 'cookie', { validateFunc });
    server.auth.default('session');
    server.app.cache = cache;
    server.app.cache.set('hello', true);

    server.route({ method: 'GET', path: '/', options: { auth: 'session' } });
});
