import { DocumentModel, IDocument } from "../../models/Document";
import { OnboardingApplication } from "../../models/OnboardingApplication";
import { User } from "../../models/User";
import { computeVisaStatus } from "../../services/visaStatus";
import sendEmails from "../../utils/sendEmail";
import { Context } from "../../context";
import { requireAuth, requireRole } from "../../utils/auth";

function toVisaDocument(d: IDocument) {
  return {
    id: String(d._id),
    type: d.type,
    filename: d.filename,
    fileSize: d.fileSize,
    url: `/api/files/${d._id}`,
    status: d.status,
    feedback: d.feedback ?? null,
    uploadedAt: d.createdAt.toISOString(),
  };
}

export const visaResolvers = {
  //opt情况
  Query: {
    myVisaStatus: async (_parent: any, _args: {}, context: Context) => {
      const currentUser = requireAuth(context);

      const application = await OnboardingApplication.findOne({
        owner: currentUser.userId,
      });
      const isOpt = application?.workAuth === "F1_CPT_OPT";
      if (!isOpt) {
        return { isOpt: false, steps: [], nextStep: "", uploadableType: null };
      }
      const docs = await DocumentModel.find({ owner: currentUser.userId });
      const result = computeVisaStatus(docs);
      return {
        isOpt: true,
        steps: result.steps.map((s) => ({
          ...s,
          document: s.document ? toVisaDocument(s.document) : null,
        })),
        nextStep: result.nextStep,
        uploadableType: result.uploadableType,
      };
    },
  },

  Mutation: {
    reviewDocument: async (
      _parent: any,
      args: {
        documentId: string;
        decision: "APPROVE" | "REJECT";
        feedback?: string;
      },
      context: Context,
    ) => {
      requireRole(context, "hr");

      const { documentId, decision, feedback } = args;

      if (decision === "REJECT" && !feedback) {
        return { success: false, message: "Feedback is required to reject" };
      }
      const doc = await DocumentModel.findById(documentId);
      if (!doc) {
        return { success: false, message: "Document not found" };
      }
      if (doc.status !== "PENDING") {
        return {
          success: false,
          message: "Only pending documents can be reviewed",
        };
      }
      doc.status = decision === "APPROVE" ? "APPROVED" : "REJECTED";

      if (decision === "REJECT") {
        doc.feedback = feedback!.trim();
      } else {
        doc.set("feedback", undefined);
      }
      await doc.save();
      return { success: true, document: toVisaDocument(doc) };
    },

    sendNotification: async (
      _parent: any,
      args: { userId: string },
      context: Context,
    ) => {
      requireRole(context, "hr");
      const user = await User.findById(args.userId);
      if (!user) throw new Error("User not found");
      const docs = await DocumentModel.find({ owner: args.userId });
      const { nextStep } = computeVisaStatus(docs);
      try {
        await sendEmails(
          user.email,
          "Visa Document Status Update",
          `<p>${nextStep}</p>`,
        );
        return { success: true, message: "Notification sent" };
      } catch (error) {
        return { success: false, message: (error as Error).message };
      }
    },
  },
};
