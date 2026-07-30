import { DocumentModel, IDocument } from "../../models/Document";
import {
  OnboardingApplication,
  IOnboardingApplication,
} from "../../models/OnboardingApplication";
import { RegistrationToken } from "../../models/RegistrationToken";
import { computeVisaStatus } from "../../services/visaStatus";
import { Context } from "../../context";
import { requireRole } from "../../utils/auth";

function toVisaDocument(d: IDocument) {
  return {
    id: String(d._id),
    type: d.type,
    filename: d.filename,
    url: `/api/files/${d._id}`,
    status: d.status,
    feedback: d.feedback ?? null,
    uploadedAt: d.createdAt.toISOString(),
  };
}

const fullName = (a: {
  firstName: string;
  middleName?: string;
  lastName: string;
}) => [a.firstName, a.middleName, a.lastName].filter(Boolean).join(" ");

const daysRemaining = (end?: Date | null) =>
  end
    ? Math.max(0, Math.ceil((end.getTime() - Date.now()) / 86_400_000))
    : null;

const matchSearch = (search: string | undefined) => {
  if (!search) return {};
  const rx = new RegExp(search, "i");
  return { $or: [{ firstName: rx }, { lastName: rx }, { preferredName: rx }] };
};

const workAuthLabel = (application: IOnboardingApplication): string | null => {
  if (application.isPermanent) return application.citizenshipType ?? null;
  if (application.workAuth === "OTHER")
    return application.otherVisaTitle ?? "OTHER";
  return application.workAuth ?? null;
};

export const hrResolvers = {
  Query: {
    // HR查看已经提交申请的员工列表
    employees: async (
      _parent: any,
      args: { search?: string },
      context: Context,
    ) => {
      requireRole(context, "hr");

      const applications = await OnboardingApplication.find({
        status: { $ne: "NEVER_SUBMITTED" },
        ...matchSearch(args.search),
      }).sort({ lastName: 1 });

      return applications.map((app) => ({
        userId: String(app.owner),
        fullName: fullName(app),
        preferredName: app.preferredName ?? null,
        ssn: app.ssn,
        workAuth: workAuthLabel(app),
        phone: app.cellPhone,
        email: app.onboardEmail,
      }));
    },

    employee: async (_p: any, args: { userId: string }, ctx: Context) => {
      requireRole(ctx, "hr");
      return OnboardingApplication.findOne({ owner: args.userId });
    },

    applicationsByStatus: async (
      _p: any,
      args: { status: IOnboardingApplication["status"] },
      context: Context,
    ) => {
      requireRole(context, "hr");
      return OnboardingApplication.find({ status: args.status });
    },

    // HR visa status页面
    visaEmployees: async (
      _p: any,
      args: { search?: string; inProgressOnly?: boolean },
      ctx: Context,
    ) => {
      requireRole(ctx, "hr");

      const applications = await OnboardingApplication.find({
        status: "APPROVED",
        workAuth: "F1_CPT_OPT",
        ...matchSearch(args.search),
      });

      // 一次获取全部文件，根据id分组
      const ownerIds = applications.map((a) => a.owner);
      const allDocs = await DocumentModel.find({ owner: { $in: ownerIds } });
      const docsByOwner = new Map<string, IDocument[]>();
      allDocs.forEach((d) => {
        const key = String(d.owner);
        if (!docsByOwner.has(key)) docsByOwner.set(key, []);
        docsByOwner.get(key)!.push(d);
      });

      // 每人的信息组装成一行
      const rows = applications.map((app) => {
        const docs = docsByOwner.get(String(app.owner)) ?? [];
        const { nextStep, uploadableType } = computeVisaStatus(docs);
        const pendingDoc = docs.find((d) => d.status === "PENDING");

        return {
          userId: String(app.owner),
          fullName: fullName(app),
          email: app.onboardEmail,
          workAuth: workAuthLabel(app),
          visaStartDate: app.visaStartDate?.toISOString() ?? null,
          visaEndDate: app.visaEndDate?.toISOString() ?? null,
          daysRemaining: daysRemaining(app.visaEndDate),
          nextStep,
          pendingDocument: pendingDoc ? toVisaDocument(pendingDoc) : null,
          _finished: uploadableType === null && !pendingDoc,
        };
      });

      return args.inProgressOnly ? rows.filter((r) => !r._finished) : rows;
    },

    // Hiring management 里面的invatation history table
    registrationTokens: async (_p: any, _a: any, ctx: Context) => {
      requireRole(ctx, "hr");

      const tokens = await RegistrationToken.find().sort({ createdAt: -1 });

      const submittedApplications = await OnboardingApplication.find(
        { status: { $ne: "NEVER_SUBMITTED" } },
        { onboardEmail: 1 },
      );
      const submittedEmails = new Set(
        submittedApplications.map((a) => a.onboardEmail.toLowerCase()),
      );
      return tokens.map((t) => ({
        id: String(t._id),
        invitedName: t.invitedName,
        invitedEmail: t.invitedEmail,
        link: `${process.env.FRONTEND_URL ?? "http://localhost:5173"}/register?token=${t.token}`,
        expireAt: t.expireAt.toISOString(),
        used: t.used,
        applicationSubmitted: submittedEmails.has(t.invitedEmail.toLowerCase()),
        createdAt: t.createdAt.toISOString(),
      }));
    },
  },

  Mutation: {
    //Application Review页面（对应HR.11)
    reviewApplication: async (
      _parent: any,
      args: {
        userId: string;
        decision: "APPROVE" | "REJECT";
        feedback?: string;
      },
      context: Context,
    ) => {
      requireRole(context, "hr");
      const { userId, decision, feedback } = args;

      if (decision === "REJECT" && !feedback?.trim()) {
        return { success: false, message: "Feedback is required to reject" };
      }

      const application = await OnboardingApplication.findOne({
        owner: userId,
      });
      if (!application) {
        return { success: false, message: "Application not found" };
      }
      if (application.status !== "PENDING") {
        return {
          success: false,
          message: "Only pending applications can be reviewed",
        };
      }

      application.status = decision === "APPROVE" ? "APPROVED" : "REJECTED";
      if (decision === "REJECT") {
        application.feedback = feedback!.trim();
      } else {
        application.set("feedback", undefined);
      }
      await application.save();

      return { success: true, document: null };
    },
  },
};
