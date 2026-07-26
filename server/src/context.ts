import jwt from 'jsonwebtoken';

export interface Context{
    currentUser: any | null,
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
            currentUser = jwt.verify(token, process.env.JWT_SECRET!);
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