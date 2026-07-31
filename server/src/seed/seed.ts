import "dotenv/config";
import mongoose from "mongoose";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import { User } from "../models/User";
import { RegistrationToken } from "../models/RegistrationToken";
import { OnboardingApplication } from "../models/OnboardingApplication";
import { DocumentModel, DOC_TYPES } from "../models/Document";
import { hashPassword } from "../utils/auth";
import generateToken from "../utils/generateToken";

const uploadDir = path.resolve(__dirname, "../../uploads");
const templatePdf = path.resolve(__dirname, "../../templates/i983-empty.pdf");

// 复制模板 PDF 到 uploads/，让每份种子文档都真实可预览
function makeStoredFile(): string {
  fs.mkdirSync(uploadDir, { recursive: true });
  const storedName = crypto.randomBytes(16).toString("hex") + ".pdf";
  fs.copyFileSync(templatePdf, path.join(uploadDir, storedName));
  return storedName;
}

async function makeDoc(
  owner: mongoose.Types.ObjectId,
  type: (typeof DOC_TYPES)[number],
  status: "PENDING" | "APPROVED" | "REJECTED",
  feedback?: string,
) {
  return DocumentModel.create({
    owner,
    type,
    filename: `${type.toLowerCase()}.pdf`,
    storedName: makeStoredFile(),
    mimeType: "application/pdf",
    fileSize: 575,
    status,
    ...(feedback ? { feedback } : {}),
  });
}

type OnboardingDocType =
  | "PROFILE_PICTURE"
  | "DRIVERS_LICENSE"
  | "WORK_AUTHORIZATION";

async function makeEmployee(opts: {
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  appStatus: "PENDING" | "APPROVED" | "REJECTED";
  feedback?: string;
  workAuth?: "F1_CPT_OPT" | "H1B";
  isPermanent?: boolean;
  citizenshipType?: "CITIZEN" | "GREEN_CARD";
  onboardingDocs?: OnboardingDocType[];
}) {
  const passwordHash = await hashPassword("Test@123");
  const user = await User.create({
    userName: opts.userName,
    email: opts.email,
    passwordHash,
    role: "employee",
  });

  // onboarding 文档必须 APPROVED：visaEmployees 的 pendingDocument 取的是
  // 全部文档里第一个 PENDING，不能被非 OPT 文档占位
  const docFields: {
    profilePicture?: mongoose.Types.ObjectId;
    driversLicense?: mongoose.Types.ObjectId;
    workAuthDoc?: mongoose.Types.ObjectId;
  } = {};
  for (const type of opts.onboardingDocs ?? []) {
    const doc = await makeDoc(user._id, type, "APPROVED");
    const id = doc._id as mongoose.Types.ObjectId;
    if (type === "PROFILE_PICTURE") docFields.profilePicture = id;
    else if (type === "DRIVERS_LICENSE") docFields.driversLicense = id;
    else docFields.workAuthDoc = id;
  }

  await OnboardingApplication.create({
    owner: user._id,
    status: opts.appStatus,
    ...docFields,
    ...(opts.feedback ? { feedback: opts.feedback } : {}),
    firstName: opts.firstName,
    lastName: opts.lastName,
    address: {
      apt: "4B",
      street: "128 Maple Ave",
      city: "Austin",
      state: "TX",
      zip: "78701",
    },
    cellPhone: "(512) 555-0155",
    onboardEmail: opts.email,
    ssn: "123-45-" + String(Math.floor(1000 + Math.random() * 9000)),
    dob: new Date("1997-03-14"),
    gender: "NO_ANSWER",
    isPermanent: opts.isPermanent ?? false,
    ...(opts.citizenshipType ? { citizenshipType: opts.citizenshipType } : {}),
    ...(opts.workAuth ? { workAuth: opts.workAuth } : {}),
    ...(opts.workAuth === "F1_CPT_OPT"
      ? {
          visaStartDate: new Date("2026-08-01"),
          visaEndDate: new Date("2028-05-31"),
        }
      : {}),
    reference: {
      firstName: "Charles",
      lastName: "Babbage",
      relationship: "Mentor",
    },
    emergencyContact: [
      {
        firstName: "Maria",
        lastName: opts.lastName,
        phone: "(512) 555-0190",
        relationship: "Parent",
      },
    ],
  });

  return user;
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI!);
  console.log("connected, wiping collections…");

  await Promise.all([
    User.deleteMany({}),
    RegistrationToken.deleteMany({}),
    OnboardingApplication.deleteMany({}),
    DocumentModel.deleteMany({}),
  ]);

  // ── HR 账号 ──
  await User.create({
    userName: "hradmin",
    email: "hr@meridian.com",
    passwordHash: await hashPassword("Admin@123"),
    role: "hr",
  });

  // ── 员工1 Jordan：OPT，EAD 待审 → HR Visa 审批 demo ──
  const jordan = await makeEmployee({
    userName: "jordan",
    email: "jordan@example.com",
    firstName: "Jordan",
    lastName: "Rivera",
    appStatus: "APPROVED",
    workAuth: "F1_CPT_OPT",
    onboardingDocs: ["PROFILE_PICTURE", "DRIVERS_LICENSE", "WORK_AUTHORIZATION"],
  });
  await makeDoc(jordan._id, "OPT_RECEIPT", "APPROVED");
  await makeDoc(jordan._id, "OPT_EAD", "PENDING");

  // ── 员工2 Priya：OPT，EAD 已批 → 该传 I-983 → Send Notification demo ──
  const priya = await makeEmployee({
    userName: "priya",
    email: "priya@example.com",
    firstName: "Priya",
    lastName: "Nair",
    appStatus: "APPROVED",
    workAuth: "F1_CPT_OPT",
    onboardingDocs: ["PROFILE_PICTURE", "WORK_AUTHORIZATION"],
  });
  await makeDoc(priya._id, "OPT_RECEIPT", "APPROVED");
  await makeDoc(priya._id, "OPT_EAD", "APPROVED");

  // ── 员工3 Marcus：公民 → Profiles 显示 Citizen ──
  await makeEmployee({
    userName: "marcus",
    email: "marcus@example.com",
    firstName: "Marcus",
    lastName: "Lee",
    appStatus: "APPROVED",
    isPermanent: true,
    citizenshipType: "CITIZEN",
    onboardingDocs: ["PROFILE_PICTURE", "DRIVERS_LICENSE"],
  });

  // ── 员工4 Devon：申请待审 → Hiring Pending tab demo ──
  const devon = await makeEmployee({
    userName: "devon",
    email: "devon@example.com",
    firstName: "Devon",
    lastName: "Clarke",
    appStatus: "PENDING",
    workAuth: "F1_CPT_OPT",
    onboardingDocs: ["WORK_AUTHORIZATION"],
  });
  await makeDoc(devon._id, "OPT_RECEIPT", "PENDING");

  // ── 员工5 Sofia：申请被拒 → Rejected tab + 员工端反馈 demo ──
  await makeEmployee({
    userName: "sofia",
    email: "sofia@example.com",
    firstName: "Sofia",
    lastName: "Vargas",
    appStatus: "REJECTED",
    workAuth: "H1B",
    feedback: "SSN format is invalid. Please correct and resubmit.",
    onboardingDocs: ["WORK_AUTHORIZATION"],
  });

  // ── 员工6 Hassan：OPT 四个文档全批 → 流程完结态（只出现在 All tab）──
  const hassan = await makeEmployee({
    userName: "hassan",
    email: "hassan@example.com",
    firstName: "Hassan",
    lastName: "Ali",
    appStatus: "APPROVED",
    workAuth: "F1_CPT_OPT",
    onboardingDocs: ["PROFILE_PICTURE", "DRIVERS_LICENSE", "WORK_AUTHORIZATION"],
  });
  await makeDoc(hassan._id, "OPT_RECEIPT", "APPROVED");
  await makeDoc(hassan._id, "OPT_EAD", "APPROVED");
  await makeDoc(hassan._id, "I983", "APPROVED");
  await makeDoc(hassan._id, "I20", "APPROVED");

  // ── 员工7 Mei：EAD 被拒待重传 → HR 端 Send Notification + 员工端反馈 demo ──
  const mei = await makeEmployee({
    userName: "mei",
    email: "mei@example.com",
    firstName: "Mei",
    lastName: "Zhang",
    appStatus: "APPROVED",
    workAuth: "F1_CPT_OPT",
    onboardingDocs: ["WORK_AUTHORIZATION"],
  });
  await makeDoc(mei._id, "OPT_RECEIPT", "APPROVED");
  await makeDoc(
    mei._id,
    "OPT_EAD",
    "REJECTED",
    "EAD card scan is blurry — please re-upload a clear copy.",
  );

  // ── 员工8 Elena：绿卡 → Profiles 显示 Green Card ──
  await makeEmployee({
    userName: "elena",
    email: "elena@example.com",
    firstName: "Elena",
    lastName: "Petrova",
    appStatus: "APPROVED",
    isPermanent: true,
    citizenshipType: "GREEN_CARD",
    onboardingDocs: ["PROFILE_PICTURE", "DRIVERS_LICENSE"],
  });

  // ── 邀请历史：已提交 / 待注册 / 已过期 三种状态 ──
  await RegistrationToken.create([
    {
      invitedName: "Jordan Rivera",
      invitedEmail: "jordan@example.com",
      token: generateToken(),
      expireAt: new Date(Date.now() + 3 * 3600e3),
      used: true,
    },
    {
      invitedName: "New Hire",
      invitedEmail: "newhire@example.com",
      token: generateToken(),
      expireAt: new Date(Date.now() + 3 * 3600e3),
      used: false,
    },
    {
      invitedName: "Old Invite",
      invitedEmail: "expired@example.com",
      token: generateToken(),
      expireAt: new Date(Date.now() - 3600e3),
      used: false,
    },
  ]);

  console.log(`
✅ Seed 完成：
  HR:     hradmin / Admin@123
  员工:   jordan · priya · marcus · devon · sofia · hassan · mei · elena
          （密码全部 Test@123）
  状态:   jordan=EAD待审       priya=待发I983提醒   marcus=Citizen
          devon=申请待审       sofia=申请被拒       hassan=OPT全部完成
          mei=EAD被拒待重传    elena=Green Card
  文档:   jordan/hassan 有全套 onboarding 文档，其余按身份各有部分
  tokens: 已提交 / 待注册 / 已过期 各一条
`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
