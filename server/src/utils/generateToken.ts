import crypto from 'node:crypto';

function generateToken(): string{
    return crypto.randomBytes(32).toString('base64url'); ;
}


export default generateToken;
