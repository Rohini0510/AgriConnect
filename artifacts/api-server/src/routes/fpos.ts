import { Router, type IRouter } from "express";
import {
  AddMemberBody,
  AddMemberParams,
  CreateJoinRequestBody,
  DecideFpoBody,
  DecideFpoParams,
  GetAdminFpoParams,
  GetFpoOnboardingParams,
  GetFpoParams,
  GetJoinRequestParams,
  ListAdminFposQueryParams,
  ListFposQueryParams,
  ListMembersParams,
  SubmitFpoOnboardingBody,
} from "@workspace/api-zod";

type DocumentStatus = {
  id: string;
  name: string;
  status: "Pending" | "Under Review" | "Verified" | "Rejected";
  reason?: string | null;
  fileName?: string | null;
};

type Fpo = {
  id: string;
  name: string;
  registrationNumber: string;
  state: string;
  district: string;
  block: string;
  villages: string[];
  crops: string[];
  memberCount: number;
  totalArea: number;
  status: "Pending" | "Under Review" | "Verified" | "Rejected";
  description: string;
  contactName: string;
  contactMobile: string;
  documents: DocumentStatus[];
  legalAct?: string;
  incorporationDate?: string;
  pan?: string;
  gst?: string | null;
  email?: string;
  step?: number;
  submittedAt?: string;
};

type Member = {
  id: string;
  farmerId: string;
  name: string;
  village: string;
  mobile: string;
  landholding: number;
  crops: string[];
};

type JoinRequest = Member & {
  requestId: string;
  fpoId: string;
  status: "Pending" | "Accepted" | "Rejected";
  requestedAt: string;
};

const documents = (): DocumentStatus[] => [
  { id: "incorporation", name: "Certificate of incorporation", status: "Verified", fileName: "sahyadri-incorporation.pdf" },
  { id: "bylaws", name: "Bylaws / MoA", status: "Verified", fileName: "sahyadri-bylaws.pdf" },
  { id: "pan", name: "PAN card", status: "Under Review", fileName: "sahyadri-pan.pdf" },
  { id: "bank", name: "Bank passbook / cancelled cheque", status: "Pending", fileName: null },
  { id: "signatory", name: "Authorized signatory ID", status: "Pending", fileName: null },
];

let fpos: Fpo[] = [
  {
    id: "fpo-sahyadri",
    name: "Sahyadri Farmer Producer Company",
    registrationNumber: "FPO-MH-8421",
    state: "Maharashtra",
    district: "Pune",
    block: "Junnar",
    villages: ["Narayangaon", "Ale", "Otur"],
    crops: ["Vegetables", "Fruits", "Grains"],
    memberCount: 486,
    totalArea: 1280,
    status: "Verified",
    description: "We help farmers collect produce together, learn better practices, and reach reliable buyers without middlemen.",
    contactName: "Ramesh Verma",
    contactMobile: "+91 98234 00000",
    documents: documents().map((doc) => ({ ...doc, status: "Verified" })),
    legalAct: "Companies Act, 2013",
    incorporationDate: "2019-08-14",
    pan: "AAECS8421K",
    gst: "27AAECS8421K1ZQ",
    email: "secretary@sahyadrifpo.in",
    step: 5,
    submittedAt: "2024-10-18T09:30:00.000Z",
  },
  {
    id: "fpo-pragati",
    name: "Pragati Krushi Vikas FPO",
    registrationNumber: "FPO-MH-6017",
    state: "Maharashtra",
    district: "Nashik",
    block: "Sinnar",
    villages: ["Panchale", "Wavi", "Shivade"],
    crops: ["Fruits", "Vegetables"],
    memberCount: 214,
    totalArea: 672,
    status: "Under Review",
    description: "A grower-led collective supporting better grading, shared transport, and fair market access for orchard farmers.",
    contactName: "Meena Pawar",
    contactMobile: "+91 98765 43120",
    documents: documents().map((doc, index) => ({ ...doc, status: index < 2 ? "Verified" : index === 2 ? "Under Review" : "Pending" })),
    legalAct: "Cooperative Act",
    incorporationDate: "2022-03-08",
    pan: "AAECP6017L",
    gst: null,
    email: "hello@pragatifpo.in",
    step: 4,
    submittedAt: "2024-10-22T11:15:00.000Z",
  },
];

let members: Record<string, Member[]> = {
  "fpo-sahyadri": [
    { id: "member-1", farmerId: "AG-FR-1042", name: "Ramesh Shinde", village: "Narayangaon", mobile: "+91 98234 10001", landholding: 4.5, crops: ["Tomato", "Onion"] },
    { id: "member-2", farmerId: "AG-FR-1043", name: "Sunita Jadhav", village: "Ale", mobile: "+91 98234 10002", landholding: 2.25, crops: ["Grapes", "Tomato"] },
    { id: "member-3", farmerId: "AG-FR-1044", name: "Vilas Pawar", village: "Otur", mobile: "+91 98234 10003", landholding: 6, crops: ["Onion", "Wheat"] },
  ],
  "fpo-pragati": [
    { id: "member-4", farmerId: "AG-FR-2091", name: "Kiran More", village: "Panchale", mobile: "+91 98765 43210", landholding: 3.75, crops: ["Grapes"] },
  ],
};

let joinRequests: JoinRequest[] = [];
let auditLogs: Record<string, { id: string; actor: string; action: string; at: string; detail?: string | null }[]> = {
  "fpo-sahyadri": [{ id: "audit-1", actor: "Anita Kulkarni", action: "FPO verified", at: "2024-10-19T12:30:00.000Z", detail: "All five documents verified." }],
  "fpo-pragati": [{ id: "audit-2", actor: "Vikram Patil", action: "Documents moved to review", at: "2024-10-23T09:10:00.000Z", detail: "PAN card needs a clearer scan." }],
};

const router: IRouter = Router();

function getFpo(id: string) {
  return fpos.find((fpo) => fpo.id === id);
}

function filterFpos(list: Fpo[], query: Record<string, unknown>) {
  const search = String(query.search ?? "").toLowerCase();
  const state = String(query.state ?? "");
  const district = String(query.district ?? "");
  const crop = String(query.crop ?? "").toLowerCase();
  const status = String(query.status ?? "");
  return list.filter((fpo) => {
    const matchesSearch = !search || [fpo.name, fpo.district, fpo.block, ...fpo.villages].join(" ").toLowerCase().includes(search);
    const matchesState = !state || fpo.state === state;
    const matchesDistrict = !district || fpo.district === district;
    const matchesCrop = !crop || fpo.crops.some((item) => item.toLowerCase() === crop || item.toLowerCase().includes(crop));
    const matchesStatus = !status || fpo.status === status;
    return matchesSearch && matchesState && matchesDistrict && matchesCrop && matchesStatus;
  });
}

function onboardingView(fpo: Fpo) {
  return {
    ...fpo,
    step: fpo.step ?? 5,
    submittedAt: fpo.submittedAt ?? new Date().toISOString(),
    legalAct: fpo.legalAct,
    incorporationDate: fpo.incorporationDate,
    pan: fpo.pan,
    gst: fpo.gst,
    email: fpo.email,
  };
}

router.get("/fpos", (req, res) => {
  const query = ListFposQueryParams.parse(req.query);
  res.json(filterFpos(fpos, query));
});

router.get("/fpos/:fpoId", (req, res) => {
  const { fpoId } = GetFpoParams.parse(req.params);
  const fpo = getFpo(fpoId);
  if (!fpo) return res.status(404).json({ error: "FPO not found" });
  return res.json(fpo);
});

router.post("/fpos/onboarding", (req, res) => {
  const input = SubmitFpoOnboardingBody.parse(req.body);
  const id = `fpo-${Date.now()}`;
  const fpo: Fpo = {
    id,
    name: input.name,
    registrationNumber: input.registrationNumber,
    state: input.state,
    district: input.district,
    block: input.block,
    villages: [],
    crops: input.crops ?? ["Vegetables"],
    memberCount: 0,
    totalArea: 0,
    status: "Pending",
    description: "A newly submitted farmer producer organization application.",
    contactName: input.contactName,
    contactMobile: input.mobile,
    documents: input.documents ?? documents().map((doc) => ({ ...doc, status: "Pending" })),
    legalAct: input.legalAct,
    incorporationDate: input.incorporationDate,
    pan: input.pan,
    gst: input.gst,
    email: input.email,
    step: 5,
    submittedAt: new Date().toISOString(),
  };
  fpos = [fpo, ...fpos];
  members[id] = [];
  auditLogs[id] = [{ id: `audit-${Date.now()}`, actor: "System", action: "Onboarding submitted", at: new Date().toISOString(), detail: "Application queued for review." }];
  res.status(201).json(onboardingView(fpo));
});

router.get("/fpos/:fpoId/onboarding", (req, res) => {
  const { fpoId } = GetFpoOnboardingParams.parse(req.params);
  const fpo = getFpo(fpoId);
  if (!fpo) return res.status(404).json({ error: "FPO not found" });
  return res.json(onboardingView(fpo));
});

router.get("/fpos/:fpoId/members", (req, res) => {
  const { fpoId } = ListMembersParams.parse(req.params);
  if (!getFpo(fpoId)) return res.status(404).json({ error: "FPO not found" });
  return res.json(members[fpoId] ?? []);
});

router.post("/fpos/:fpoId/members", (req, res) => {
  const { fpoId } = AddMemberParams.parse(req.params);
  const input = AddMemberBody.parse(req.body);
  const fpo = getFpo(fpoId);
  if (!fpo) return res.status(404).json({ error: "FPO not found" });
  const next: Member = {
    id: `member-${Date.now()}`,
    farmerId: `AG-FR-${Math.floor(1000 + Math.random() * 8999)}`,
    ...input,
  };
  members[fpoId] = [...(members[fpoId] ?? []), next];
  fpo.memberCount += 1;
  fpo.totalArea = Number((fpo.totalArea + input.landholding).toFixed(2));
  return res.status(201).json(next);
});

router.post("/join-requests", (req, res) => {
  const input = CreateJoinRequestBody.parse(req.body);
  if (!getFpo(input.fpoId)) return res.status(404).json({ error: "FPO not found" });
  const requestId = `join-${Date.now()}`;
  const request: JoinRequest = {
    id: `member-${Date.now()}`,
    farmerId: `AG-FR-${Math.floor(1000 + Math.random() * 8999)}`,
    name: input.name,
    village: input.village,
    mobile: input.mobile,
    landholding: input.landholding,
    crops: input.crops,
    requestId,
    fpoId: input.fpoId,
    status: "Pending",
    requestedAt: new Date().toISOString(),
  };
  joinRequests = [request, ...joinRequests];
  return res.status(201).json(request);
});

router.get("/join-requests/:requestId", (req, res) => {
  const { requestId } = GetJoinRequestParams.parse(req.params);
  const request = joinRequests.find((item) => item.requestId === requestId);
  if (!request) return res.status(404).json({ error: "Join request not found" });
  return res.json(request);
});

router.get("/admin/fpos", (req, res) => {
  const query = ListAdminFposQueryParams.parse(req.query);
  res.json(filterFpos(fpos, query));
});

router.get("/admin/fpos/:fpoId", (req, res) => {
  const { fpoId } = GetAdminFpoParams.parse(req.params);
  const fpo = getFpo(fpoId);
  if (!fpo) return res.status(404).json({ error: "FPO not found" });
  return res.json({ fpo, auditLog: auditLogs[fpoId] ?? [] });
});

router.post("/admin/fpos/:fpoId/decision", (req, res) => {
  const { fpoId } = DecideFpoParams.parse(req.params);
  const input = DecideFpoBody.parse(req.body);
  const fpo = getFpo(fpoId);
  if (!fpo) return res.status(404).json({ error: "FPO not found" });
  fpo.status = input.decision === "approve" ? "Verified" : "Rejected";
  fpo.documents = fpo.documents.map((document) => ({
    ...document,
    status: input.decision === "approve" ? "Verified" : "Rejected",
    reason: input.decision === "reject" ? input.reason ?? "Please re-upload this document." : null,
  }));
  auditLogs[fpoId] = [
    ...(auditLogs[fpoId] ?? []),
    {
      id: `audit-${Date.now()}`,
      actor: "Admin reviewer",
      action: input.decision === "approve" ? "FPO approved" : "FPO rejected",
      at: new Date().toISOString(),
      detail: input.reason ?? null,
    },
  ];
  return res.json(fpo);
});

export default router;