import generateToken from "../../utils/generateToken";
import { RegistrationToken } from "../../models/RegistrationToken";
import sendEmails from "../../utils/sendEmail";

export const resolvers = {
  Query: {
    hello: () => "Hello World!",
    validateRegistrationToken: async(
        _parent: any,
        args: {token: string}
    ) => {
        const { token } = args;
        const curToken = await RegistrationToken.findOne({token});
        if(!curToken){
            return({valid: false, email: null});
        }
        if(curToken.used){
            return({valid: false, email: null});
        }
        if(curToken.expireAt.getTime() < Date.now()){
            return({valid: false, email: null});
        }

        return({valid: true, email: curToken.invitedEmail});
    }

  },
  Mutation: {
    generateRegistrationToken: async(
        _parent: any,
        args: {input: {invitedName: string, invitedEmail: string}}
    ) => {
        const { invitedName, invitedEmail} = args.input;
        const token = generateToken();
        const expireAt = new Date(Date.now() + 3 * 60 * 60 * 1000);

        try{
            await RegistrationToken.create({
                invitedName: invitedName,
                invitedEmail: invitedEmail,
                expireAt: expireAt,
                token: token
            })

            const registrationLink = `${process.env.FRONTEND_URL}/register?token=${token}`;

            await sendEmails(
                invitedEmail, 
                'Please complete your onboarding registration', 
                `<p>Please click the link below to complete your registration</p>
                <a href=${registrationLink}>${registrationLink}</a>
                `)

        }
        catch(err){
            return ({success: false, message: (err as Error).message});
        }

        return ({success: true, message:"Token generated and email sent!"})
    }
}
};

