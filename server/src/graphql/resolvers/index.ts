import generateToken from "../../utils/generateToken";
import { RegistrationToken } from "../../models/RegistrationToken";
import { User } from "../../models/User";
import sendEmails from "../../utils/sendEmail";
import { Context } from "../../context";
import {
  hashPassword,
  generateJwtToken,
  comparePassword,
  requireAuth,
  requireRole,
  requireOwnership,
} from "../../utils/auth";
import { OnboardingApplication, IContactPerson, GENDER_TYPES, VISA_TYPES} from "../../models/OnboardingApplication";
import { visaResolvers } from "./visa";

interface SubmitOnboardingInput {
  firstName: string;
  lastName: string;
  middleName?: string;
  preferredName?: string;
  profilePicture?: string;    
  address: {
    apt?: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  cellPhone: string;
  workPhone?: string;
  onboardEmail: string;
  ssn: string;
  dob: string;                   
  gender: (typeof GENDER_TYPES)[number];
  isPermanent: boolean;
  citizenshipType?: "GREEN_CARD" | "CITIZEN";
  workAuth?: (typeof VISA_TYPES)[number];
  otherVisaTitle?: string;
  workAuthDoc?: string;
  visaStartDate?: string;
  visaEndDate?: string;
  driversLicense?: string;
  reference: IContactPerson;
  emergencyContact: IContactPerson[];
}

const authResolvers = {
  Query: {
    hello: () => "Hello World!",
    validateRegistrationToken: async (
      _parent: any,
      args: { token: string },
    ) => {
      const { token } = args;
      const curToken = await RegistrationToken.findOne({ token });
      if (!curToken) {
        return { valid: false, email: null };
      }
      if (curToken.used) {
        return { valid: false, email: null };
      }
      if (curToken.expireAt.getTime() < Date.now()) {
        return { valid: false, email: null };
      }

      return { valid: true, email: curToken.invitedEmail };
    },
    me: async (_parent: any, _args: any, contex: Context) => {
      if (!contex.currentUser) {
        throw new Error("Not Authenticated!");
      }
      const curUser = await User.findById(contex.currentUser.userId);
      if (!curUser) {
        throw new Error("Not Authenticated!");
      }
      return curUser;
    },
    myOnboardingApplication: async (
      _parent: any,
      _args: any,
      context: Context,
    ) => {
      const currentUser = requireAuth(context);
      const curApplication = await OnboardingApplication.findOne({
        owner: currentUser.userId,
      });
      if (!curApplication) return null;
      return curApplication;
    },
  },
  Mutation: {
    generateRegistrationToken: async (
      _parent: any,
      args: { input: { invitedName: string; invitedEmail: string } },
    ) => {
      const { invitedName, invitedEmail } = args.input;
      const token = generateToken();
      const expireAt = new Date(Date.now() + 3 * 60 * 60 * 1000);

      try {
        await RegistrationToken.create({
          invitedName: invitedName,
          invitedEmail: invitedEmail,
          expireAt: expireAt,
          token: token,
        });

        const registrationLink = `${process.env.FRONTEND_URL}/register?token=${token}`;

        await sendEmails(
          invitedEmail,
          "Please complete your onboarding registration",
          `<p>Please click the link below to complete your registration</p>
                <a href=${registrationLink}>${registrationLink}</a>
                `,
        );
      } catch (err) {
        return { success: false, message: (err as Error).message };
      }

      return { success: true, message: "Token generated and email sent!" };
    },
    register: async (
      _parent: any,
      args: {
        input: {
          token: string;
          registerName: string;
          registerEmail: string;
          password: string;
        };
      },
      _context: Context,
    ) => {
      const { token, registerName, registerEmail, password } = args.input;

      //Verify hr token
      const curToken = await RegistrationToken.findOne({ token });
      if (!curToken) {
        return {
          success: false,
          message: "Register token does not exist!",
          token: null,
          user: null,
        };
      }
      if (curToken.used) {
        return {
          success: false,
          message: "Register token has been used!",
          token: null,
          user: null,
        };
      }
      if (curToken.expireAt.getTime() < Date.now()) {
        return {
          success: false,
          message: "Register token has expired!",
          token: null,
          user: null,
        };
      }
      if (password.length < 6) {
        return {
          success: false,
          message: "Password must be at least 6 characters",
          token: null,
          user: null,
        };
      }

      // Check if user exists
      const existingUser = await User.findOne({
        $or: [{ userName: registerName }, { email: registerEmail }],
      });

      if (existingUser) {
        return {
          success: false,
          message: "Username or email already exists",
          token: null,
          user: null,
        };
      }

      // Create new user
      const hashedPassword = await hashPassword(password);
      const newUser = {
        userName: registerName,
        email: registerEmail,
        passwordHash: hashedPassword,
        role: "employee" as const,
      };

      const createdUser = await User.create(newUser);

      curToken.used = true;
      await curToken.save();

      const jwtToken = generateJwtToken(createdUser);

      return {
        success: true,
        message: "Successfully Registered!",
        token: jwtToken,
        user: createdUser,
      };
    },
    login: async (
      _parent: any,
      args: { input: { loginName: string; loginPassword: string } },
      _contex: Context,
    ) => {
      const { loginName, loginPassword } = args.input;
      try {
        const curUser = await User.findOne({ userName: loginName });
        if (!curUser) {
          return {
            success: false,
            message: "Invalid username or password!",
            token: null,
            user: null,
          };
        }
        const validPassword = await comparePassword(
          loginPassword,
          curUser.passwordHash,
        );
        if (!validPassword) {
          return {
            success: false,
            message: "Invalid username or password!",
            token: null,
            user: null,
          };
        }
        const jwtToken = generateJwtToken(curUser);
        return {
          success: true,
          message: "Successfully Logged in!",
          token: jwtToken,
          user: curUser,
        };
      } catch (err) {
        return {
          success: false,
          message: (err as Error).message,
          token: null,
          user: null,
        };
      }
    },
    submitOnboardingApplication: async(
        _parent: any,
        args: { input: SubmitOnboardingInput },
        context: Context
    ) => {
        const currentUser = requireAuth(context);
        const {
            firstName,
            lastName,
            middleName,
            preferredName,
            profilePicture,
            address,
            cellPhone,
            workPhone,
            onboardEmail,
            ssn,
            dob,
            gender,
            isPermanent,
            citizenshipType,
            workAuth,
            otherVisaTitle,
            workAuthDoc,
            visaStartDate,
            visaEndDate,
            driversLicense,
            reference,
            emergencyContact,
        } = args.input;
        if (isPermanent === false && !workAuth) {
            return { 
                success: false, 
                message: "Please choose your work authorization", 
                application: null 
            };
        }
        if (isPermanent === true && !citizenshipType) {
            return { 
                success: false, 
                message: "Please choose your citizenship type", 
                application: null 
            };
        }
        if (workAuth === 'F1_CPT_OPT' && !workAuthDoc) {
            return { 
                success: false, 
                message: "Please upload work authorization document", 
                application: null 
            };
        }
        if (workAuth === 'OTHER' && !otherVisaTitle) {
            return { 
                success: false, 
                message: "Please choose your visa title", 
                application: null 
            };
        }

        try{
            const existingApplication = await OnboardingApplication.findOne({ owner: currentUser.userId });
            if(existingApplication && existingApplication.status !== "REJECTED"){
                return {
                    success: false,
                    message: "You already have an application in progress.",
                    application: null,
                };
            }

            const applicationData = {
            owner: currentUser.userId,
            status: "PENDING" as const,
            firstName,
            lastName,
            ...(middleName !== undefined && { middleName }),
            ...(preferredName !== undefined && { preferredName }),
            ...(profilePicture !== undefined && { profilePicture }),
            address,
            cellPhone,
            ...(workPhone !== undefined && { workPhone }),
            onboardEmail,
            ssn,
            dob: new Date(dob),
            gender,
            isPermanent,
            ...(citizenshipType !== undefined && { citizenshipType }),
            ...(workAuth !== undefined && { workAuth }),
            ...(otherVisaTitle !== undefined && { otherVisaTitle }),
            ...(workAuthDoc !== undefined && { workAuthDoc }),
            ...(visaStartDate !== undefined && { visaStartDate: new Date(visaStartDate) }),
            ...(visaEndDate !== undefined && { visaEndDate: new Date(visaEndDate) }),
            ...(driversLicense !== undefined && { driversLicense }),
            reference,
            emergencyContact,
            };

            let savedApplication;
            if(existingApplication){
                Object.assign(existingApplication, applicationData);
                existingApplication.feedback = "";
                savedApplication = await existingApplication.save();
            }
            else{
                savedApplication = await OnboardingApplication.create(applicationData)
            }

            return {
                success: true,
                message: "Application submitted successfully!",
                application: savedApplication,
            };

        }
        catch(err){
            return {
                success: false,
                message: (err as Error).message,
                application: null,
            };
        }
    }
  },
};
export const resolvers = [authResolvers, visaResolvers];