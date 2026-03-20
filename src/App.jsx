import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Factory,
  FileText,
  Package,
  Pencil,
  Plus,
  Search,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Sparkles,
  Trash2,
  WalletCards,
  X,
} from "lucide-react";

const costcoAuditSections = [
  {
    id: "supply_chain",
    title: "供应链披露与分包",
    summary: "依据 Costco Supplier Code of Conduct（Updated December 2023）整理",
    weight: 14,
    items: [
      {
        id: "disclose_all_facilities",
        label: "所有参与 Costco 订单生产的工厂均已披露并获得批准",
        description: "如有未披露工厂或未经批准的生产点，视为重大风险。",
        critical: true,
        hardFail: true,
      },
      {
        id: "traceability",
        label: "能够追溯产品组件/原料来源，并可提供供应链实体信息",
        description: "包括分包商、居家工、地址与联系人。",
        critical: true,
      },
      {
        id: "home_worker_list",
        label: "如存在居家工，已建立名单、监控记录且符合当地法律",
        description: "无居家工时可判定为符合。",
        critical: false,
      },
    ],
  },
  {
    id: "documentation",
    title: "文件与记录",
    weight: 10,
    items: [
      {
        id: "licenses_and_permits",
        label: "营业执照、许可证、政策制度、员工记录等可供查验",
        description: "文件应完整、真实、可追溯。",
        critical: true,
      },
      {
        id: "employment_agency_docs",
        label: "如使用劳务中介/招聘代理，其记录也可供审查",
        description: "包括合规资质及相关员工记录。",
        critical: false,
      },
      {
        id: "records_are_consistent",
        label: "工时、工资、产量、考勤等记录彼此一致",
        description: "如记录冲突、伪造或重大缺漏，会显著影响判定。",
        critical: true,
      },
    ],
  },
  {
    id: "child_labor",
    title: "童工与未成年工",
    weight: 12,
    items: [
      {
        id: "minimum_age",
        label: "所有员工达到法定最低年龄；若当地未规定，则至少 14 岁",
        description: "发现童工应直接视为重大不合规。",
        critical: true,
        hardFail: true,
      },
      {
        id: "age_documents",
        label: "保存可验证年龄/出生日期的正式文件",
        description: "可用法定可识别方式确认年龄。",
        critical: true,
      },
      {
        id: "young_worker_protection",
        label: "18 岁以下员工未从事危险工序、夜班、重体力或受限空间作业",
        description: "需有岗位限制与保护措施。",
        critical: true,
      },
    ],
  },
  {
    id: "forced_labor",
    title: "强迫劳动 / 人口贩运 / 监狱劳工",
    weight: 14,
    items: [
      {
        id: "voluntary_work",
        label: "员工完全自愿工作，不存在胁迫、欺骗、债役或限制人身自由",
        description: "发现强迫劳动、贩运迹象应直接判红灯。",
        critical: true,
        hardFail: true,
      },
      {
        id: "document_control",
        label: "员工自行持有身份证件和旅行证件",
        description: "不得扣押证件。",
        critical: true,
        hardFail: true,
      },
      {
        id: "no_recruitment_fees",
        label: "员工未承担招聘费/中介费，相关费用未从工资中扣除",
        description: "适用于直接或间接招聘。",
        critical: true,
      },
      {
        id: "no_prison_labor",
        label: "不存在监狱劳工、服刑释放项目劳工或变相强制劳工",
        description: "发现即重大不合规。",
        critical: true,
        hardFail: true,
      },
      {
        id: "can_refuse_overtime",
        label: "员工可拒绝加班且不会被报复或惩罚",
        description: "需与工时制度联动核查。",
        critical: true,
      },
    ],
  },
  {
    id: "abuse",
    title: "虐待、骚扰与纪律处分",
    weight: 8,
    items: [
      {
        id: "no_abuse",
        label: "无体罚、辱骂、精神/言语/性骚扰、威胁或胁迫",
        description: "任何系统性虐待均应严肃处理。",
        critical: true,
        hardFail: true,
      },
      {
        id: "disciplinary_policy",
        label: "有书面纪律处分制度，并保存处分记录",
        description: "制度应透明、合法。",
        critical: true,
      },
      {
        id: "no_illegal_fines",
        label: "不存在非法或过度罚款、侮辱式安保搜查等行为",
        description: "包括异性搜身、强制脱衣检查。",
        critical: true,
      },
    ],
  },
  {
    id: "labor_management",
    title: "劳动与雇佣管理",
    weight: 16,
    items: [
      {
        id: "written_contract",
        label: "法律要求时，已向员工提供其能理解语言的书面劳动合同",
        description: "包含雇佣条款、工资和工作要求。",
        critical: true,
      },
      {
        id: "no_discriminatory_tests",
        label: "未将孕检、HIV 检测、节育要求等作为录用条件",
        description: "医疗检测不得用于就业歧视。",
        critical: true,
      },
      {
        id: "legal_work_auth",
        label: "已核验员工合法用工资格与工作许可",
        description: "适用于外籍及本地员工。",
        critical: true,
      },
      {
        id: "wages_paid_legally",
        label: "工资不低于法定最低工资，并依法支付加班费",
        description: "直接支付给员工或员工控制账户。",
        critical: true,
      },
      {
        id: "itemized_wage_slips",
        label: "提供完整工资条，含工时、费率、加班、扣款、福利等信息",
        description: "工资单须准确完整。",
        critical: true,
      },
      {
        id: "legal_benefits",
        label: "依法提供社保、法定假期、病假、育儿假等法定福利",
        description: "需与工资/人事记录对应。",
        critical: true,
      },
      {
        id: "hours_within_limit",
        label: "总工时不超过法律要求或每周 60 小时，以更严格者为准",
        description: "重大超时通常会触发黄/红灯。",
        critical: true,
      },
      {
        id: "one_day_off",
        label: "每 7 天至少休息 1 天",
        description: "需有排班/考勤佐证。",
        critical: true,
      },
      {
        id: "no_off_clock_work",
        label: "不存在下班后无记录工作、带回家工作或隐形加班",
        description: "除依法批准的正式居家工安排外。",
        critical: true,
      },
      {
        id: "no_discrimination",
        label: "招聘与用工中不存在歧视",
        description: "涵盖性别、年龄、种族、宗教、婚育、残障等。",
        critical: true,
      },
      {
        id: "freedom_of_association",
        label: "尊重员工自由结社与集体协商权利",
        description: "不得因工会相关活动实施打压或报复。",
        critical: true,
      },
      {
        id: "migrant_workers_protected",
        label: "外籍/移民员工的聘用符合所在国法律，且不存在驱逐威胁",
        description: "应合法合规且不受歧视。",
        critical: true,
      },
      {
        id: "grievance_mechanism",
        label: "设有匿名、保密、无报复的申诉机制，并追踪处理结果",
        description: "应能直达较高层管理。",
        critical: true,
      },
    ],
  },
  {
    id: "health_safety",
    title: "健康安全与宿舍",
    weight: 18,
    items: [
      {
        id: "hs_training",
        label: "已向员工提供书面健康安全信息与培训，且使用员工可理解语言",
        description: "公告应持续更新。",
        critical: true,
      },
      {
        id: "chemical_training",
        label: "接触化学品/危险品员工已接受安全处理、储存和处置培训",
        description: "含对应标识与操作要求。",
        critical: true,
      },
      {
        id: "dangerous_equipment_training",
        label: "危险设备有操作培训、说明书和安全标识",
        description: "需覆盖上岗人员。",
        critical: true,
      },
      {
        id: "emergency_exits",
        label: "紧急出口标识清晰、无堵塞、未上锁，并朝疏散方向开启",
        description: "发现锁闭或堵塞通常直接判重大风险。",
        critical: true,
        hardFail: true,
      },
      {
        id: "secondary_exits",
        label: "每层设置次级紧急出口，疏散路线清晰、照明充分并通向安全集合区",
        description: "集合区不应靠近危险品区域。",
        critical: true,
      },
      {
        id: "fire_equipment",
        label: "灭火器配置合适、无遮挡、已按月至少检查；报警装置可识别",
        description: "应与生产类型匹配。",
        critical: true,
      },
      {
        id: "evacuation_drills",
        label: "所有班次/楼层至少每 12 个月开展一次应急疏散演练",
        description: "需有演练记录。",
        critical: true,
      },
      {
        id: "electrical_safety",
        label: "配电箱、线路、插座至少每月检查，且无破损裸露或绊倒风险",
        description: "电气安全是高频审核项。",
        critical: true,
      },
      {
        id: "first_aid",
        label: "每班至少有 1 名受训急救人员，急救箱易取且标识清晰",
        description: "严重受伤可及时送医。",
        critical: true,
      },
      {
        id: "ppe_free",
        label: "必要的工服和个人防护用品免费提供给员工",
        description: "如口罩、护目镜、耳塞、手套、安全鞋等。",
        critical: true,
      },
      {
        id: "sanitation_water",
        label: "厕所、洗手设施、饮水点充足、清洁、隐私良好且男女分开",
        description: "饮用水应随时可及。",
        critical: true,
      },
      {
        id: "dormitory_compliance",
        label: "如有宿舍，与生产区分离，住宿安全合规，员工非工作时间可自由离开",
        description: "不得对外籍员工实施锁门/锁出制度。",
        critical: false,
      },
    ],
  },
  {
    id: "environment",
    title: "环境管理",
    weight: 4,
    items: [
      {
        id: "hazardous_waste",
        label: "化学品、废水、固废等按照环保责任方式处理处置",
        description: "如有异常排放需立即整改并通知相关机构。",
        critical: true,
      },
      {
        id: "odc_control",
        label: "积极减少/淘汰消耗臭氧层化学品",
        description: "属鼓励项，但有助于提升成熟度。",
        critical: false,
      },
      {
        id: "recycling",
        label: "具备回收与减废实践",
        description: "属鼓励项。",
        critical: false,
      },
    ],
  },
  {
    id: "management_ethics",
    title: "管理体系与审计伦理",
    weight: 4,
    items: [
      {
        id: "responsible_person",
        label: "已指定负责人持续监控并落实行为准则要求",
        description: "应有具体职责。",
        critical: true,
      },
      {
        id: "audit_access",
        label: "接受不限时审厂、文件查阅及员工保密访谈",
        description: "不得预先串供。",
        critical: true,
      },
      {
        id: "no_falsification",
        label: "不存在贿赂、腐败、欺骗或伪造记录行为",
        description: "一经发现通常直接终止合作。",
        critical: true,
        hardFail: true,
      },
    ],
  },
];

const productSeed = [
  {
    id: "p1",
    name: "防晒冰袖 Pro",
    sku: "UV-ARM-2026-001",
    category: "防紫外线配件",
    targetQty: 50000,
    description: "韩国与美国渠道高标准防晒配件项目。",
    fabricsRequired: ["冰丝主布", "弹力网眼布", "防滑硅胶带"],
  },
  {
    id: "p2",
    name: "运动面罩 Lite",
    sku: "UV-MASK-2026-002",
    category: "户外防晒",
    targetQty: 80000,
    description: "轻量型户外防晒第二产品线。",
    fabricsRequired: ["凉感针织布", "透气网布"],
  },
];

const factorySeed = [
  {
    id: "f1",
    productId: "p1",
    name: "青岛华腾工厂",
    country: "中国",
    city: "青岛",
    areaSqm: 12800,
    lastAuditDate: "2026-02-11",
    notes: "主力候选工厂",
    quote: {
      fabrics: [
        { id: "q1", name: "冰丝主布", spec: "160cm / 230gsm", unitCost: 12.8, usage: 0.26 },
        { id: "q2", name: "弹力网眼布", spec: "155cm / 120gsm", unitCost: 9.4, usage: 0.11 },
        { id: "q3", name: "防滑硅胶带", spec: "定制", unitCost: 0.72, usage: 1 },
      ],
      laborCost: 2.15,
      accessoriesCost: 0.68,
      packagingCost: 0.92,
      packagingMode: "factory",
      remarks: "交期稳定",
    },
    audit: {
      disclose_all_facilities: "yes",
      traceability: "yes",
      home_worker_list: "na",
      licenses_and_permits: "yes",
      employment_agency_docs: "na",
      records_are_consistent: "yes",
      minimum_age: "yes",
      age_documents: "yes",
      young_worker_protection: "yes",
      voluntary_work: "yes",
      document_control: "yes",
      no_recruitment_fees: "yes",
      no_prison_labor: "yes",
      can_refuse_overtime: "yes",
      no_abuse: "yes",
      disciplinary_policy: "yes",
      no_illegal_fines: "yes",
      written_contract: "yes",
      no_discriminatory_tests: "yes",
      legal_work_auth: "yes",
      wages_paid_legally: "yes",
      itemized_wage_slips: "yes",
      legal_benefits: "yes",
      hours_within_limit: "yes",
      one_day_off: "yes",
      no_off_clock_work: "pending",
      no_discrimination: "yes",
      freedom_of_association: "yes",
      migrant_workers_protected: "yes",
      grievance_mechanism: "yes",
      hs_training: "yes",
      chemical_training: "yes",
      dangerous_equipment_training: "yes",
      emergency_exits: "yes",
      secondary_exits: "yes",
      fire_equipment: "yes",
      evacuation_drills: "yes",
      electrical_safety: "yes",
      first_aid: "yes",
      ppe_free: "yes",
      sanitation_water: "yes",
      dormitory_compliance: "na",
      hazardous_waste: "yes",
      odc_control: "pending",
      recycling: "yes",
      responsible_person: "yes",
      audit_access: "yes",
      no_falsification: "yes",
    },
    findings: "目前无重大风险，建议补充核查是否存在隐形加班。",
  },
  {
    id: "f2",
    productId: "p1",
    name: "绍兴锦耀工厂",
    country: "中国",
    city: "绍兴",
    areaSqm: 8600,
    lastAuditDate: "2026-01-28",
    notes: "报价较低",
    quote: {
      fabrics: [
        { id: "q1", name: "冰丝主布", spec: "160cm / 230gsm", unitCost: 12.1, usage: 0.26 },
        { id: "q2", name: "弹力网眼布", spec: "155cm / 120gsm", unitCost: 8.9, usage: 0.11 },
        { id: "q3", name: "防滑硅胶带", spec: "定制", unitCost: 0.63, usage: 1 },
      ],
      laborCost: 1.9,
      accessoriesCost: 0.61,
      packagingCost: 0.54,
      packagingMode: "external",
      remarks: "需跟进消防与工时",
    },
    audit: {
      disclose_all_facilities: "yes",
      traceability: "pending",
      home_worker_list: "na",
      licenses_and_permits: "yes",
      employment_agency_docs: "pending",
      records_are_consistent: "yes",
      minimum_age: "yes",
      age_documents: "yes",
      young_worker_protection: "pending",
      voluntary_work: "yes",
      document_control: "yes",
      no_recruitment_fees: "pending",
      no_prison_labor: "yes",
      can_refuse_overtime: "no",
      no_abuse: "yes",
      disciplinary_policy: "yes",
      no_illegal_fines: "yes",
      written_contract: "yes",
      no_discriminatory_tests: "yes",
      legal_work_auth: "yes",
      wages_paid_legally: "yes",
      itemized_wage_slips: "yes",
      legal_benefits: "pending",
      hours_within_limit: "no",
      one_day_off: "pending",
      no_off_clock_work: "pending",
      no_discrimination: "yes",
      freedom_of_association: "pending",
      migrant_workers_protected: "yes",
      grievance_mechanism: "pending",
      hs_training: "yes",
      chemical_training: "pending",
      dangerous_equipment_training: "pending",
      emergency_exits: "yes",
      secondary_exits: "pending",
      fire_equipment: "no",
      evacuation_drills: "pending",
      electrical_safety: "pending",
      first_aid: "yes",
      ppe_free: "yes",
      sanitation_water: "yes",
      dormitory_compliance: "na",
      hazardous_waste: "yes",
      odc_control: "pending",
      recycling: "pending",
      responsible_person: "yes",
      audit_access: "yes",
      no_falsification: "yes",
    },
    findings: "工时与消防不稳定，暂不建议直接过审。",
  },
];

const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwNefYqW7PFKk5tueiO0vZgOfhgbYPyBUyRTDGJkXHuH2YY1XoiVne9-U38CXxJ_Rax/exec";

const statusMeta = {
  green: {
    label: "绿灯",
    passLabel: "已通过",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    soft: "bg-emerald-50 border-emerald-200",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  yellow: {
    label: "黄灯",
    passLabel: "整改中",
    dot: "bg-amber-500",
    text: "text-amber-700",
    soft: "bg-amber-50 border-amber-200",
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  red: {
    label: "红灯",
    passLabel: "未通过",
    dot: "bg-rose-500",
    text: "text-rose-700",
    soft: "bg-rose-50 border-rose-200",
    icon: <ShieldX className="h-4 w-4" />,
  },
};

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function formatMoney(value) {
  return `¥${Number(value || 0).toFixed(2)}`;
}

function formatArea(value) {
  return `${Number(value || 0).toLocaleString()} ㎡`;
}

function calcFabricCost(quote) {
  return (quote?.fabrics || []).reduce((sum, item) => sum + Number(item.unitCost || 0) * Number(item.usage || 0), 0);
}

function calcTotalQuote(quote) {
  return calcFabricCost(quote) + Number(quote?.laborCost || 0) + Number(quote?.accessoriesCost || 0) + Number(quote?.packagingCost || 0);
}

function getAllAuditItems() {
  return costcoAuditSections.flatMap((section) => section.items.map((item) => ({ ...item, sectionId: section.id, sectionTitle: section.title, sectionWeight: section.weight })));
}

function evaluateFactory(factory) {
  const audit = factory?.audit || {};
  const allItems = getAllAuditItems();

  const effectiveItems = allItems.filter((item) => audit[item.id] !== "na");
  const hardFails = effectiveItems.filter((item) => item.hardFail && audit[item.id] === "no");
  const criticalFails = effectiveItems.filter((item) => item.critical && audit[item.id] === "no");
  const pendingCritical = effectiveItems.filter((item) => item.critical && audit[item.id] === "pending");

  const sections = costcoAuditSections.map((section) => {
    const sectionItems = section.items.filter((item) => audit[item.id] !== "na");
    const max = sectionItems.length * 2;
    const earned = sectionItems.reduce((sum, item) => {
      const value = audit[item.id];
      if (value === "yes") return sum + 2;
      if (value === "pending") return sum + 1;
      return sum;
    }, 0);

    const percent = max ? Math.round((earned / max) * 100) : 100;
    const hasSectionHardFail = sectionItems.some((item) => item.hardFail && audit[item.id] === "no");
    const noCount = sectionItems.filter((item) => audit[item.id] === "no").length;
    const pendingCount = sectionItems.filter((item) => audit[item.id] === "pending").length;

    let traffic = "green";
    if (hasSectionHardFail || percent < 60 || noCount >= 2) traffic = "red";
    else if (percent < 85 || pendingCount > 0 || noCount > 0) traffic = "yellow";

    return {
      id: section.id,
      title: section.title,
      percent,
      traffic,
      noCount,
      pendingCount,
    };
  });

  const weightedScore = Math.round(
    sections.reduce((sum, section) => {
      const weight = costcoAuditSections.find((s) => s.id === section.id)?.weight || 0;
      return sum + section.percent * weight;
    }, 0) / 100
  );

  const completion = Math.round((effectiveItems.filter((item) => audit[item.id] !== "pending").length / Math.max(effectiveItems.length, 1)) * 100);

  let status = "green";
  if (hardFails.length > 0 || weightedScore < 65 || criticalFails.length >= 3) status = "red";
  else if (criticalFails.length > 0 || pendingCritical.length > 0 || weightedScore < 85) status = "yellow";

  const verdict =
    status === "green" ? "已通过" : status === "yellow" ? "整改后可复审" : "未通过";

  const recommendations = [];
  if (hardFails.length > 0) {
    recommendations.push(`存在 ${hardFails.length} 项重大红线问题，必须先关闭后才可推进。`);
  }
  if (pendingCritical.length > 0) {
    recommendations.push(`仍有 ${pendingCritical.length} 项关键条目待确认，当前不宜直接判定通过。`);
  }
  const weakSections = sections.filter((s) => s.traffic !== "green").sort((a, b) => a.percent - b.percent).slice(0, 3);
  if (weakSections.length > 0) {
    recommendations.push(`优先整改：${weakSections.map((s) => s.title).join("、")}。`);
  }
  if (recommendations.length === 0) {
    recommendations.push("当前未发现重大阻断项，可进入商务比价与复核阶段。");
  }

  return {
    status,
    score: weightedScore,
    verdict,
    completion,
    hardFails,
    criticalFails,
    pendingCritical,
    sections,
    recommendations,
  };
}

function buildDefaultAudit() {
  return Object.fromEntries(getAllAuditItems().map((item) => [item.id, "pending"]));
}

function buildDefaultQuote(product = null) {
  return {
    fabrics: (product?.fabricsRequired || []).map((name) => ({
      id: uid("fabric"),
      name,
      spec: "",
      unitCost: 0,
      usage: 0,
    })),
    laborCost: 0,
    accessoriesCost: 0,
    packagingCost: 0,
    packagingMode: "factory",
    remarks: "",
  };
}

function normalizeProduct(product) {
  return {
    id: product?.id || uid("product"),
    name: product?.name || "",
    sku: product?.sku || "",
    category: product?.category || "",
    targetQty: Number(product?.targetQty || 0),
    description: product?.description || "",
    fabricsRequired: Array.isArray(product?.fabricsRequired) ? product.fabricsRequired : [],
  };
}

function normalizeFactory(factory, products) {
  const relatedProduct = products.find((item) => item.id === factory?.productId) || null;
  const fallbackQuote = buildDefaultQuote(relatedProduct);
  const incomingQuote = factory?.quote || {};

  return {
    id: factory?.id || uid("factory"),
    productId: factory?.productId || relatedProduct?.id || "",
    name: factory?.name || "",
    country: factory?.country || "",
    city: factory?.city || "",
    areaSqm: Number(factory?.areaSqm || 0),
    lastAuditDate: factory?.lastAuditDate || "",
    notes: factory?.notes || "",
    findings: factory?.findings || "",
    quote: {
      fabrics: Array.isArray(incomingQuote.fabrics)
        ? incomingQuote.fabrics.map((row) => ({
            id: row?.id || uid("fabric"),
            name: row?.name || "",
            spec: row?.spec || "",
            unitCost: Number(row?.unitCost || 0),
            usage: Number(row?.usage || 0),
          }))
        : fallbackQuote.fabrics,
      laborCost: Number(incomingQuote.laborCost || 0),
      accessoriesCost: Number(incomingQuote.accessoriesCost || 0),
      packagingCost: Number(incomingQuote.packagingCost || 0),
      packagingMode: incomingQuote.packagingMode || "factory",
      remarks: incomingQuote.remarks || "",
    },
    audit: {
      ...buildDefaultAudit(),
      ...(factory?.audit || {}),
    },
  };
}

function ButtonPill({ active, onClick, children, tone = "default" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition",
        active
          ? tone === "danger"
            ? "border-rose-300 bg-rose-50 text-rose-700"
            : tone === "warning"
              ? "border-amber-300 bg-amber-50 text-amber-700"
              : "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
      )}
    >
      {children}
    </button>
  );
}

function SectionProgress({ title, percent, traffic, noCount, pendingCount }) {
  return (
    <div className="rounded-[24px] border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-slate-900">{title}</div>
          <div className="mt-1 text-xs text-slate-500">
            不符合 {noCount} 项 · 待确认 {pendingCount} 项
          </div>
        </div>
        <div className={cn("rounded-full border px-2.5 py-1 text-xs font-medium", statusMeta[traffic].soft, statusMeta[traffic].text)}>
          {statusMeta[traffic].label}
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-stone-100">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            traffic === "green" ? "bg-emerald-500" : traffic === "yellow" ? "bg-amber-500" : "bg-rose-500"
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="mt-2 text-right text-xs text-slate-500">{percent}%</div>
    </div>
  );
}

function KpiCard({ title, value, hint, icon }) {
  return (
    <div className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-slate-500">{title}</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{value}</div>
          <div className="mt-2 text-sm text-slate-500">{hint}</div>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3 text-slate-700">{icon}</div>
      </div>
    </div>
  );
}

function ModalShell({ title, subtitle, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-2xl rounded-[32px] border border-stone-200 bg-[#fcfbf8] shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        <div className="flex items-start justify-between gap-4 border-b border-stone-200 px-6 py-5">
          <div>
            <div className="text-lg font-semibold text-slate-950">{title}</div>
            {subtitle ? <div className="mt-1 text-sm text-slate-500">{subtitle}</div> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full border border-stone-200 bg-white p-2 text-slate-500 transition hover:text-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer ? <div className="flex flex-wrap items-center justify-end gap-3 border-t border-stone-200 px-6 py-4">{footer}</div> : null}
      </div>
    </div>
  );
}

function ProductEditor({ product, onChange, onSave, onDelete, onClose, isNew }) {
  return (
    <ModalShell
      title={isNew ? "新增产品" : "编辑产品"}
      subtitle="通过二级窗口维护当前产品信息。"
      onClose={onClose}
      footer={(
        <>
          {!isNew && (
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700"
            >
              <Trash2 className="h-4 w-4" />
              删除产品
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
          >
            取消
          </button>
          <button type="button" onClick={onSave} className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
            保存产品
          </button>
        </>
      )}
    >
      <div className="space-y-3">
        <input value={product.name} onChange={(e) => onChange({ ...product, name: e.target.value })} placeholder="产品名称" className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-400" />
        <input value={product.sku} onChange={(e) => onChange({ ...product, sku: e.target.value })} placeholder="SKU" className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-400" />
        <input value={product.category} onChange={(e) => onChange({ ...product, category: e.target.value })} placeholder="分类" className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-400" />
        <input
          value={product.targetQty}
          onChange={(e) => onChange({ ...product, targetQty: Number(e.target.value || 0) })}
          placeholder="目标数量"
          type="number"
          className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-400"
        />
        <textarea value={product.description} onChange={(e) => onChange({ ...product, description: e.target.value })} placeholder="描述" rows={3} className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-400" />
        <textarea
          value={(product.fabricsRequired || []).join("，")}
          onChange={(e) => onChange({ ...product, fabricsRequired: e.target.value.split(/[，,]/).map((i) => i.trim()).filter(Boolean) })}
          placeholder="用料，用中文逗号分隔"
          rows={2}
          className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-400"
        />
      </div>
    </ModalShell>
  );
}

function ConfirmDialog({ title, description, confirmText = "确认", tone = "default", onCancel, onConfirm }) {
  return (
    <ModalShell
      title={title}
      subtitle={description}
      onClose={onCancel}
      footer={(
        <>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
          >
            取消
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-white",
              tone === "danger" ? "bg-rose-600" : "bg-slate-900"
            )}
          >
            {confirmText}
          </button>
        </>
      )}
    >
      <div className="rounded-[24px] border border-stone-200 bg-white px-4 py-4 text-sm leading-6 text-slate-600">
        {description}
      </div>
    </ModalShell>
  );
}

function FactoryListCard({ factory, evaluation, onOpen }) {
  return (
    <div className="rounded-[30px] border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className={cn("h-2.5 w-2.5 rounded-full", statusMeta[evaluation.status].dot)} />
            <div className="text-lg font-semibold text-slate-900">{factory.name}</div>
          </div>
          <div className="mt-1 text-sm text-slate-500">
            {factory.country} · {factory.city} · {formatArea(factory.areaSqm)}
          </div>
        </div>
        <div className={cn("rounded-full border px-3 py-1.5 text-xs font-medium", statusMeta[evaluation.status].soft, statusMeta[evaluation.status].text)}>
          {statusMeta[evaluation.status].label}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-2xl bg-stone-50 p-3">
          <div className="text-xs text-slate-500">是否过</div>
          <div className="mt-1 text-lg font-semibold text-slate-950">{statusMeta[evaluation.status].passLabel}</div>
        </div>
        <div className="rounded-2xl bg-stone-50 p-3">
          <div className="text-xs text-slate-500">准备度</div>
          <div className="mt-1 text-lg font-semibold text-slate-950">{evaluation.score}</div>
        </div>
        <div className="rounded-2xl bg-stone-50 p-3">
          <div className="text-xs text-slate-500">工厂面积</div>
          <div className="mt-1 text-lg font-semibold text-slate-950">{Math.round(factory.areaSqm || 0).toLocaleString()}</div>
        </div>
        <div className="rounded-2xl bg-stone-50 p-3">
          <div className="text-xs text-slate-500">总报价</div>
          <div className="mt-1 text-lg font-semibold text-slate-950">{formatMoney(calcTotalQuote(factory.quote))}</div>
        </div>
      </div>

      {(evaluation.hardFails.length > 0 || evaluation.pendingCritical.length > 0) && (
        <div className={cn("mt-4 rounded-2xl border px-4 py-3 text-sm", evaluation.hardFails.length > 0 ? "border-rose-200 bg-rose-50 text-rose-700" : "border-amber-200 bg-amber-50 text-amber-700")}>
          {evaluation.hardFails.length > 0
            ? `重大问题：${evaluation.hardFails.map((i) => i.label).join("；")}`
            : `待确认关键项：${evaluation.pendingCritical.map((i) => i.label).slice(0, 2).join("；")}`}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="text-sm text-slate-500">最后更新 {factory.lastAuditDate || "未填写"}</div>
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center gap-1 rounded-full border border-stone-300 bg-stone-50 px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-stone-100"
        >
          录入 / 查看审核
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function QuoteTable({ factory, onFactoryChange }) {
  const fabrics = factory.quote.fabrics || [];

  const updateFabric = (id, key, value) => {
    onFactoryChange({
      ...factory,
      quote: {
        ...factory.quote,
        fabrics: fabrics.map((row) => (row.id === id ? { ...row, [key]: key === "name" || key === "spec" ? value : Number(value || 0) } : row)),
      },
    });
  };

  const addFabric = () => {
    onFactoryChange({
      ...factory,
      quote: {
        ...factory.quote,
        fabrics: [...fabrics, { id: uid("fabric"), name: "", spec: "", unitCost: 0, usage: 0 }],
      },
    });
  };

  const removeFabric = (id) => {
    onFactoryChange({
      ...factory,
      quote: {
        ...factory.quote,
        fabrics: fabrics.filter((row) => row.id !== id),
      },
    });
  };

  return (
    <div className="rounded-[30px] border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-lg font-semibold text-slate-900">报价结构</div>
          <div className="mt-1 text-sm text-slate-500">同一页面直接修改面料、人工、辅料、包装。</div>
        </div>
        <button type="button" onClick={addFabric} className="inline-flex items-center gap-1 rounded-full border border-stone-300 bg-stone-50 px-3 py-2 text-sm font-medium text-slate-800">
          <Plus className="h-4 w-4" />
          新增面料
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {fabrics.map((row) => (
          <div key={row.id} className="grid grid-cols-1 gap-3 rounded-2xl border border-stone-200 p-4 lg:grid-cols-[1.2fr_1fr_0.7fr_0.7fr_auto]">
            <input value={row.name} onChange={(e) => updateFabric(row.id, "name", e.target.value)} placeholder="名称" className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-400" />
            <input value={row.spec} onChange={(e) => updateFabric(row.id, "spec", e.target.value)} placeholder="规格" className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-400" />
            <input value={row.unitCost} type="number" step="0.01" onChange={(e) => updateFabric(row.id, "unitCost", e.target.value)} placeholder="单价" className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-400" />
            <input value={row.usage} type="number" step="0.01" onChange={(e) => updateFabric(row.id, "usage", e.target.value)} placeholder="用量" className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-400" />
            <button type="button" onClick={() => removeFabric(row.id)} className="inline-flex items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-3 py-3 text-rose-700">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <div className="mb-2 text-sm text-slate-500">人工费</div>
          <input value={factory.quote.laborCost} type="number" step="0.01" onChange={(e) => onFactoryChange({ ...factory, quote: { ...factory.quote, laborCost: Number(e.target.value || 0) } })} className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-400" />
        </div>
        <div>
          <div className="mb-2 text-sm text-slate-500">辅料</div>
          <input value={factory.quote.accessoriesCost} type="number" step="0.01" onChange={(e) => onFactoryChange({ ...factory, quote: { ...factory.quote, accessoriesCost: Number(e.target.value || 0) } })} className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-400" />
        </div>
        <div>
          <div className="mb-2 text-sm text-slate-500">包装</div>
          <input value={factory.quote.packagingCost} type="number" step="0.01" onChange={(e) => onFactoryChange({ ...factory, quote: { ...factory.quote, packagingCost: Number(e.target.value || 0) } })} className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-400" />
        </div>
        <div>
          <div className="mb-2 text-sm text-slate-500">包装来源</div>
          <select value={factory.quote.packagingMode} onChange={(e) => onFactoryChange({ ...factory, quote: { ...factory.quote, packagingMode: e.target.value } })} className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-400">
            <option value="factory">工厂提供</option>
            <option value="external">外部提供</option>
          </select>
        </div>
      </div>

      <textarea value={factory.quote.remarks || ""} onChange={(e) => onFactoryChange({ ...factory, quote: { ...factory.quote, remarks: e.target.value } })} rows={3} placeholder="报价备注" className="mt-4 w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-400" />

      <div className="mt-4 rounded-[24px] border border-stone-200 bg-stone-50 p-4">
        <div className="text-xs text-slate-500">总报价</div>
        <div className="mt-1 text-2xl font-semibold text-slate-950">{formatMoney(calcTotalQuote(factory.quote))}</div>
      </div>
    </div>
  );
}

function AuditChecklist({ factory, onFactoryChange }) {
  const audit = factory.audit || {};

  const setAnswer = (itemId, value) => {
    onFactoryChange({
      ...factory,
      audit: {
        ...audit,
        [itemId]: value,
      },
    });
  };

  return (
    <div className="space-y-5">
      {costcoAuditSections.map((section) => {
        const sectionEval = evaluateFactory(factory).sections.find((item) => item.id === section.id);
        return (
          <section key={section.id} className="rounded-[30px] border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="text-lg font-semibold text-slate-900">{section.title}</div>
                <div className="mt-1 text-sm text-slate-500">{section.summary || "依据 Costco 供应商行为准则整理"}</div>
              </div>
              {sectionEval && (
                <div className={cn("rounded-full border px-3 py-1.5 text-xs font-medium", statusMeta[sectionEval.traffic].soft, statusMeta[sectionEval.traffic].text)}>
                  {sectionEval.percent}% · {statusMeta[sectionEval.traffic].label}
                </div>
              )}
            </div>

            <div className="mt-5 space-y-3">
              {section.items.map((item) => {
                const value = audit[item.id] || "pending";
                return (
                  <div key={item.id} className="rounded-[24px] border border-stone-200 p-4">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="text-sm font-medium text-slate-900">{item.label}</div>
                          {item.critical && <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[11px] font-medium text-white">关键项</span>}
                          {item.hardFail && <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-medium text-rose-700">红线项</span>}
                        </div>
                        <div className="mt-2 text-sm leading-6 text-slate-500">{item.description}</div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <ButtonPill active={value === "yes"} onClick={() => setAnswer(item.id, "yes")}>符合</ButtonPill>
                        <ButtonPill active={value === "pending"} tone="warning" onClick={() => setAnswer(item.id, "pending")}>待确认</ButtonPill>
                        <ButtonPill active={value === "no"} tone="danger" onClick={() => setAnswer(item.id, "no")}>不符合</ButtonPill>
                        <ButtonPill active={value === "na"} onClick={() => setAnswer(item.id, "na")}>不适用</ButtonPill>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default function CostcoAuditWorkbench() {
  const [products, setProducts] = useState([]);
  const [factories, setFactories] = useState([]);
  const [view, setView] = useState("home");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedFactoryId, setSelectedFactoryId] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("status");
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteProductDialogOpen, setIsDeleteProductDialogOpen] = useState(false);
  const [draftProduct, setDraftProduct] = useState(productSeed[0]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [isCloudConnected, setIsCloudConnected] = useState(false);

  useEffect(() => {
    async function loadCloudData() {
      const urlNotConfigured = !GAS_WEB_APP_URL || GAS_WEB_APP_URL.includes("PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE");

      if (urlNotConfigured) {
        const seededProducts = productSeed.map(normalizeProduct);
        const seededFactories = factorySeed.map((item) => normalizeFactory(item, seededProducts));
        setProducts(seededProducts);
        setFactories(seededFactories);
        setSelectedProductId(seededProducts[0]?.id || "");
        setSaveError("请先把 GAS_WEB_APP_URL 替换成你的 Apps Script Web App URL。");
        setIsHydrated(true);
        return;
      }

      try {
        const res = await fetch(`${GAS_WEB_APP_URL}?action=init`);
        const json = await res.json();

        const cloudProductsRaw = Array.isArray(json?.data?.products) ? json.data.products : [];
        const cloudFactoriesRaw = Array.isArray(json?.data?.factories) ? json.data.factories : [];

        const nextProductsBase = cloudProductsRaw.length ? cloudProductsRaw : productSeed;
        const normalizedProducts = nextProductsBase.map(normalizeProduct);
        const nextFactoriesBase = cloudFactoriesRaw.length ? cloudFactoriesRaw : factorySeed;
        const normalizedFactories = nextFactoriesBase.map((item) => normalizeFactory(item, normalizedProducts));

        setProducts(normalizedProducts);
        setFactories(normalizedFactories);
        setSelectedProductId(normalizedProducts[0]?.id || "");
        setIsCloudConnected(true);
        setSaveError("");
      } catch (error) {
        console.error("加载云端数据失败", error);
        const seededProducts = productSeed.map(normalizeProduct);
        const seededFactories = factorySeed.map((item) => normalizeFactory(item, seededProducts));
        setProducts(seededProducts);
        setFactories(seededFactories);
        setSelectedProductId(seededProducts[0]?.id || "");
        setSaveError("云端读取失败，当前先使用示例数据。请检查 Web App URL 和部署权限。");
      } finally {
        setIsHydrated(true);
      }
    }

    loadCloudData();
  }, []);

  useEffect(() => {
    const urlNotConfigured = !GAS_WEB_APP_URL || GAS_WEB_APP_URL.includes("PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE");
    if (!isHydrated || urlNotConfigured) return;

    const timer = setTimeout(async () => {
      try {
        setIsSaving(true);
        setSaveError("");

        const res = await fetch(GAS_WEB_APP_URL, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify({
            action: "saveAll",
            payload: {
              products,
              factories,
            },
          }),
        });

        const json = await res.json();
        if (!json?.ok) {
          throw new Error(json?.error || "保存失败");
        }

        setIsCloudConnected(true);
      } catch (error) {
        console.error("保存到云端失败", error);
        setSaveError("保存失败，请检查 Apps Script Web App 是否重新部署，并确认当前网址可访问。");
      } finally {
        setIsSaving(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [products, factories, isHydrated]);

  const currentProduct = products.find((item) => item.id === selectedProductId) || products[0] || null;
  const productFactories = useMemo(() => factories.filter((item) => item.productId === selectedProductId), [factories, selectedProductId]);

  useEffect(() => {
    if (!productFactories.length) {
      setSelectedFactoryId("");
      return;
    }
    if (!productFactories.some((item) => item.id === selectedFactoryId)) {
      setSelectedFactoryId(productFactories[0].id);
    }
  }, [productFactories, selectedFactoryId]);

  const filteredFactories = useMemo(() => {
    const mapped = productFactories.map((factory) => ({ factory, evaluation: evaluateFactory(factory) }));
    const keyword = search.trim().toLowerCase();
    const filtered = mapped.filter(({ factory, evaluation }) => {
      const matchesKeyword = !keyword || [factory.name, factory.city, factory.country].join(" ").toLowerCase().includes(keyword);
      const matchesStatus = statusFilter === "all" ? true : evaluation.status === statusFilter;
      return matchesKeyword && matchesStatus;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "price") return calcTotalQuote(a.factory.quote) - calcTotalQuote(b.factory.quote);
      if (sortBy === "area") return Number(b.factory.areaSqm || 0) - Number(a.factory.areaSqm || 0);
      if (sortBy === "score") return b.evaluation.score - a.evaluation.score;
      const order = { green: 0, yellow: 1, red: 2 };
      return order[a.evaluation.status] - order[b.evaluation.status];
    });
  }, [productFactories, search, statusFilter, sortBy]);

  const summary = useMemo(() => {
    const evaluations = productFactories.map((item) => evaluateFactory(item));
    const green = evaluations.filter((item) => item.status === "green").length;
    const yellow = evaluations.filter((item) => item.status === "yellow").length;
    const red = evaluations.filter((item) => item.status === "red").length;
    const bestQuote = productFactories.length ? Math.min(...productFactories.map((item) => calcTotalQuote(item.quote))) : 0;
    return { total: productFactories.length, green, yellow, red, bestQuote };
  }, [productFactories]);

  const selectedFactory = factories.find((item) => item.id === selectedFactoryId) || null;
  const selectedEvaluation = selectedFactory ? evaluateFactory(selectedFactory) : null;

  const updateFactory = (nextFactory) => {
    setFactories((prev) => prev.map((item) => (item.id === nextFactory.id ? nextFactory : item)));
  };

  const createFactory = () => {
    if (!currentProduct) return;
    const newFactory = {
      id: uid("factory"),
      productId: currentProduct.id,
      name: `新工厂 ${productFactories.length + 1}`,
      country: "中国",
      city: "",
      areaSqm: 0,
      lastAuditDate: new Date().toISOString().slice(0, 10),
      notes: "",
      findings: "",
      quote: buildDefaultQuote(currentProduct),
      audit: buildDefaultAudit(),
    };
    setFactories((prev) => [newFactory, ...prev]);
    setSelectedFactoryId(newFactory.id);
    setView("detail");
  };

  const deleteFactory = (factoryId) => {
    setFactories((prev) => prev.filter((item) => item.id !== factoryId));
    setView("home");
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setIsDeleteProductDialogOpen(false);
    setIsCreatingProduct(false);
    if (currentProduct) setDraftProduct(currentProduct);
  };

  const handleSaveProduct = () => {
    if (!draftProduct.name.trim()) return;
    if (isCreatingProduct) {
      const newProduct = { ...draftProduct, id: uid("product") };
      setProducts((prev) => [newProduct, ...prev]);
      setSelectedProductId(newProduct.id);
      setDraftProduct(newProduct);
      setIsCreatingProduct(false);
      setIsProductModalOpen(false);
      return;
    }
    setProducts((prev) => prev.map((item) => (item.id === draftProduct.id ? draftProduct : item)));
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = () => {
    if (!currentProduct) return;
    const remainProducts = products.filter((item) => item.id !== currentProduct.id);
    setProducts(remainProducts);
    setFactories((prev) => prev.filter((item) => item.productId !== currentProduct.id));
    setSelectedProductId(remainProducts[0]?.id || "");
    setView("home");
    setIsDeleteProductDialogOpen(false);
    setIsProductModalOpen(false);
    setIsCreatingProduct(false);
  };

  useEffect(() => {
    if (currentProduct) {
      setDraftProduct(currentProduct);
      setIsCreatingProduct(false);
      setIsDeleteProductDialogOpen(false);
    }
  }, [selectedProductId]);

  const openFactory = (id) => {
    setSelectedFactoryId(id);
    setView("detail");
  };

  return (
    <div className="min-h-screen bg-[#f6f3ee] text-slate-900">
      <div className="mx-auto max-w-[1680px] px-4 py-4 lg:px-6 lg:py-6">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[330px_minmax(0,1fr)]">
          <aside className="rounded-[36px] border border-stone-200 bg-[#fbfaf7] p-5 shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
            <div className="flex items-center gap-3">
              <div className="rounded-[24px] border border-stone-200 bg-white p-3 text-slate-900 shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-400">Costco Audit</div>
                <div className="mt-1 text-xl font-semibold text-slate-950">审厂与报价工作台</div>
              </div>
            </div>

            <div className="mt-6 rounded-[30px] border border-stone-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Sparkles className="h-4 w-4" />
                当前产品
              </div>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="mt-3 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-stone-400"
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>

              {currentProduct && (
                <div className="mt-4 rounded-[26px] border border-stone-200 bg-stone-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Package className="h-4 w-4" />
                    {currentProduct.sku || "未设置 SKU"}
                  </div>
                  <div className="mt-2 text-lg font-semibold text-slate-900">{currentProduct.category || "未设置分类"}</div>
                  <div className="mt-3 text-sm leading-6 text-slate-500">{currentProduct.description || "暂无说明"}</div>
                  <div className="mt-4 text-sm text-slate-500">目标数量 {Number(currentProduct.targetQty || 0).toLocaleString()} pcs</div>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingProduct(true);
                    setDraftProduct({ id: uid("draft"), name: "", sku: "", category: "", targetQty: 0, description: "", fabricsRequired: [] });
                    setIsProductModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 rounded-full border border-stone-300 bg-stone-50 px-3 py-2 text-sm font-medium text-slate-800"
                >
                  <Plus className="h-4 w-4" />
                  新增产品
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!currentProduct) return;
                    setIsCreatingProduct(false);
                    setDraftProduct(currentProduct);
                    setIsProductModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 rounded-full border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-slate-700"
                >
                  <Pencil className="h-4 w-4" />
                  编辑
                </button>
              </div>
            </div>

            <div className="mt-6 rounded-[30px] border border-stone-200 bg-white p-4 shadow-sm">
              <div className="text-sm font-medium text-slate-700">产品用料</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(currentProduct?.fabricsRequired || []).map((fabric) => (
                  <span key={fabric} className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-slate-600">
                    {fabric}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-[30px] border border-stone-200 bg-white p-4 shadow-sm">
              <div className="text-sm font-medium text-slate-700">判定逻辑</div>
              <div className="mt-3 space-y-2 text-sm leading-6 text-slate-500">
                <div>• 红线项不符合，直接红灯。</div>
                <div>• 关键项待确认或不符合，通常至少黄灯。</div>
                <div>• 系统基于 Costco 条款自动给出通过 / 整改 / 不通过。</div>
              </div>
            </div>
          </aside>

          <main className="space-y-6">
            <div className="rounded-[24px] border border-stone-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
              {isSaving
                ? "正在保存到 Google Sheets..."
                : saveError
                  ? saveError
                  : isCloudConnected
                    ? "已连接 Google Sheets"
                    : "正在准备云端连接..."}
            </div>
            {view === "home" ? (
              <>
                <div className="rounded-[36px] border border-stone-200 bg-[#fbfaf7] px-6 py-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                      <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{currentProduct?.name || "未选择产品"} 工厂列表</h1>
                      <div className="mt-2 text-sm text-slate-500">每家工厂直接进入审核录入页，按 Costco 条款逐项判断。</div>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <div className="relative min-w-[260px]">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="搜索工厂名称 / 城市"
                          className="w-full rounded-2xl border border-stone-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-stone-400"
                        />
                      </div>
                      <div className="flex gap-3">
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-stone-400">
                          <option value="all">全部灯号</option>
                          <option value="green">绿灯</option>
                          <option value="yellow">黄灯</option>
                          <option value="red">红灯</option>
                        </select>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-stone-400">
                          <option value="status">按灯号</option>
                          <option value="score">按准备度</option>
                          <option value="price">按总报价</option>
                          <option value="area">按工厂面积</option>
                        </select>
                        <button type="button" onClick={createFactory} className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white">
                          <Plus className="h-4 w-4" />
                          新增工厂
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <KpiCard title="参与工厂" value={summary.total} hint="当前产品工厂数量" icon={<Factory className="h-5 w-5" />} />
                  <KpiCard title="已通过" value={summary.green} hint="绿灯工厂" icon={<CheckCircle2 className="h-5 w-5" />} />
                  <KpiCard title="整改中" value={summary.yellow} hint="黄灯工厂" icon={<AlertTriangle className="h-5 w-5" />} />
                  <KpiCard title="最低总报价" value={summary.total ? formatMoney(summary.bestQuote) : "—"} hint="当前产品最低报价" icon={<WalletCards className="h-5 w-5" />} />
                </div>

                <section className="rounded-[36px] border border-stone-200 bg-[#fbfaf7] p-5 shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold text-slate-900">工厂列表</div>
                      <div className="mt-1 text-sm text-slate-500">显示是否过、灯号、面积与报价。</div>
                    </div>
                    <div className="rounded-full bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">{filteredFactories.length} 家工厂</div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
                    {filteredFactories.map(({ factory, evaluation }) => (
                      <FactoryListCard key={factory.id} factory={factory} evaluation={evaluation} onOpen={() => openFactory(factory.id)} />
                    ))}
                  </div>
                </section>
              </>
            ) : selectedFactory && selectedEvaluation ? (
              <>
                <div className="rounded-[36px] border border-stone-200 bg-[#fbfaf7] px-6 py-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                      <button type="button" onClick={() => setView("home")} className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-slate-700">
                        <ArrowLeft className="h-4 w-4" />
                        返回工厂列表
                      </button>
                      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">{selectedFactory.name}</h1>
                      <div className="mt-2 text-sm text-slate-500">
                        {selectedFactory.country} · {selectedFactory.city || "未填写城市"} · {formatArea(selectedFactory.areaSqm)} · 最后更新 {selectedFactory.lastAuditDate || "未填写"}
                      </div>
                    </div>
                    <div className={cn("rounded-[28px] border px-5 py-4", statusMeta[selectedEvaluation.status].soft)}>
                      <div className={cn("text-sm font-medium", statusMeta[selectedEvaluation.status].text)}>{statusMeta[selectedEvaluation.status].label}</div>
                      <div className="mt-1 text-3xl font-semibold text-slate-950">{selectedEvaluation.score}</div>
                      <div className="mt-1 text-sm text-slate-500">{selectedEvaluation.verdict}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                  <KpiCard title="是否过" value={statusMeta[selectedEvaluation.status].passLabel} hint="系统自动判定" icon={selectedEvaluation.status === "green" ? <ShieldCheck className="h-5 w-5" /> : selectedEvaluation.status === "yellow" ? <ShieldAlert className="h-5 w-5" /> : <ShieldX className="h-5 w-5" />} />
                  <KpiCard title="准备度" value={`${selectedEvaluation.score}`} hint="按条款自动加权" icon={<ClipboardCheck className="h-5 w-5" />} />
                  <KpiCard title="录入完成度" value={`${selectedEvaluation.completion}%`} hint="待确认项越少越好" icon={<FileText className="h-5 w-5" />} />
                  <KpiCard title="工厂面积" value={formatArea(selectedFactory.areaSqm)} hint="可直接编辑" icon={<Factory className="h-5 w-5" />} />
                  <KpiCard title="总报价" value={formatMoney(calcTotalQuote(selectedFactory.quote))} hint="报价与审厂同页维护" icon={<WalletCards className="h-5 w-5" />} />
                </div>

                <section className="rounded-[36px] border border-stone-200 bg-[#fbfaf7] p-5 shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-[30px] border border-stone-200 bg-white p-5 shadow-sm">
                      <div className="text-lg font-semibold text-slate-900">工厂基础信息</div>
                      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                        <input value={selectedFactory.name} onChange={(e) => updateFactory({ ...selectedFactory, name: e.target.value })} placeholder="工厂名称" className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-400" />
                        <input value={selectedFactory.country} onChange={(e) => updateFactory({ ...selectedFactory, country: e.target.value })} placeholder="国家" className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-400" />
                        <input value={selectedFactory.city} onChange={(e) => updateFactory({ ...selectedFactory, city: e.target.value })} placeholder="城市" className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-400" />
                        <input value={selectedFactory.areaSqm} type="number" onChange={(e) => updateFactory({ ...selectedFactory, areaSqm: Number(e.target.value || 0) })} placeholder="工厂面积（㎡）" className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-400" />
                        <input value={selectedFactory.lastAuditDate || ""} type="date" onChange={(e) => updateFactory({ ...selectedFactory, lastAuditDate: e.target.value })} className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-400" />
                        <input value={selectedFactory.notes || ""} onChange={(e) => updateFactory({ ...selectedFactory, notes: e.target.value })} placeholder="工厂备注" className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-400" />
                      </div>
                      <textarea value={selectedFactory.findings || ""} onChange={(e) => updateFactory({ ...selectedFactory, findings: e.target.value })} rows={3} placeholder="审核备注 / 现场发现" className="mt-4 w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-400" />
                      <div className="mt-4 flex gap-2">
                        <button type="button" onClick={() => deleteFactory(selectedFactory.id)} className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700">
                          <Trash2 className="h-4 w-4" />
                          删除工厂
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-[30px] border border-stone-200 bg-white p-5 shadow-sm">
                        <div className="text-lg font-semibold text-slate-900">自动判断结果</div>
                        <div className="mt-4 space-y-3">
                          {selectedEvaluation.recommendations.map((item) => (
                            <div key={item} className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-slate-700">
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {selectedEvaluation.sections.map((section) => (
                          <SectionProgress key={section.id} {...section} />
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <AuditChecklist factory={selectedFactory} onFactoryChange={updateFactory} />

                <QuoteTable factory={selectedFactory} onFactoryChange={updateFactory} />
              </>
            ) : null}
          </main>
        </div>

        {isProductModalOpen && (
          <ProductEditor
            product={draftProduct}
            onChange={setDraftProduct}
            onSave={handleSaveProduct}
            onDelete={() => setIsDeleteProductDialogOpen(true)}
            onClose={closeProductModal}
            isNew={isCreatingProduct}
          />
        )}

        {isDeleteProductDialogOpen && !isCreatingProduct && currentProduct && (
          <ConfirmDialog
            title="删除当前产品"
            description={`删除“${currentProduct.name}”后，关联工厂数据也会一起删除。此操作不可撤回。`}
            confirmText="确认删除"
            tone="danger"
            onCancel={() => setIsDeleteProductDialogOpen(false)}
            onConfirm={handleDeleteProduct}
          />
        )}
      </div>
    </div>
  );
}
