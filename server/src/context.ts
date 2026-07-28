import jwt from 'jsonwebtoken';
import { verifyToken, JWTPayload } from './utils/auth';


export interface Context{
    currentUser: JWTPayload | null,
    token?: string | undefined    
}


async function createContext({req}:{req?: any}):Promise<Context>{
    let token: string | undefined;

    if(req?.headers?.authorization){
        token = req.headers.authorization.replace('Bearer ', '')
    }

    let currentUser = null;
    if(token){
        try{
            currentUser = verifyToken(token);
        }
        catch(err){
            currentUser = null;
        }
    }

    return {
        currentUser,
        token
    }
}

export default createContext;