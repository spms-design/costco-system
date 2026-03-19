import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Factory,
  FileText,
  Filter,
  Package,
  Search,
  ShieldCheck,
  ShieldX,
  Sparkles,
  WalletCards,
} from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const products = [
  {
    id: "p1",
    name: "防晒冰袖 Pro",
    sku: "UV-ARM-2026-001",
    category: "防紫外线配件",
    targetQty: 50000,
    fabricsRequired: ["冰丝主布", "弹力网眼布", "防滑硅胶带"],
    description:
      "用于韩国及美国渠道的高标准防晒配件，系统将同时比较工厂是否满足 Costco 审厂标准，以及这款产品的完整加工报价。",
    auditFocus: ["分包透明度", "工资工时", "消防与健康安全", "资料完整率", "报价竞争力"],
  },
  {
    id: "p2",
    name: "运动面罩 Lite",
    sku: "UV-MASK-2026-002",
    category: "户外防晒",
    targetQty: 80000,
    fabricsRequired: ["凉感针织布", "透气网布"],
    description:
      "轻量型户外防晒产品，适合做第二产品线储备工厂比较，重点看交期、工时合规和整体报价结构。",
    auditFocus: ["工时与休息日", "外协与分包", "文件记录", "交期稳定性"],
  },
];

const factoriesSeed = [
  {
    id: "f1",
    name: "青岛华腾工厂",
    city: "青岛",
    country: "中国",
    product: "p1",
    status: "green",
    totalScore: 91,
    hardFail: false,
    hardFailReasons: [],
    mandatoryDocsRate: 98,
    followUpRequired: false,
    lastAuditDate: "2026-02-11",
    leadTimeDays: 28,
    modules: {
      supplyChain: 90,
      documentation: 94,
      childLabor: 100,
      forcedLabor: 95,
      wagesHours: 88,
      healthSafety: 92,
      grievance: 86,
      environment: 89,
      auditEthics: 93,
    },
    quote: {
      fabrics: [
        { name: "冰丝主布", spec: "160cm / 230gsm", unitCost: 12.8, usage: 0.26 },
        { name: "弹力网眼布", spec: "155cm / 120gsm", unitCost: 9.4, usage: 0.11 },
        { name: "防滑硅胶带", spec: "定制", unitCost: 0.72, usage: 1 },
      ],
      laborCost: 2.15,
      accessoriesCost: 0.68,
      packagingMode: "factory",
      packagingCost: 0.92,
      remarks: "已有同类防晒品经验，交期稳定。",
    },
  },
  {
    id: "f2",
    name: "绍兴锦耀工厂",
    city: "绍兴",
    country: "中国",
    product: "p1",
    status: "yellow",
    totalScore: 78,
    hardFail: false,
    hardFailReasons: [],
    mandatoryDocsRate: 87,
    followUpRequired: true,
    lastAuditDate: "2026-01-28",
    leadTimeDays: 24,
    modules: {
      supplyChain: 76,
      documentation: 81,
      childLabor: 100,
      forcedLabor: 88,
      wagesHours: 67,
      healthSafety: 72,
      grievance: 71,
      environment: 75,
      auditEthics: 80,
    },
    quote: {
      fabrics: [
        { name: "冰丝主布", spec: "160cm / 230gsm", unitCost: 12.1, usage: 0.26 },
        { name: "弹力网眼布", spec: "155cm / 120gsm", unitCost: 8.9, usage: 0.11 },
        { name: "防滑硅胶带", spec: "定制", unitCost: 0.63, usage: 1 },
      ],
      laborCost: 1.9,
      accessoriesCost: 0.61,
      packagingMode: "external",
      packagingCost: 0.54,
      remarks: "报价低，但工时与消防模块需整改。",
    },
  },
  {
    id: "f3",
    name: "义乌盛宏工厂",
    city: "义乌",
    country: "中国",
    product: "p1",
    status: "red",
    totalScore: 58,
    hardFail: true,
    hardFailReasons: ["发现未授权分包", "工资与考勤记录不一致"],
    mandatoryDocsRate: 73,
    followUpRequired: true,
    lastAuditDate: "2026-02-05",
    leadTimeDays: 19,
    modules: {
      supplyChain: 35,
      documentation: 49,
      childLabor: 100,
      forcedLabor: 71,
      wagesHours: 52,
      healthSafety: 64,
      grievance: 58,
      environment: 66,
      auditEthics: 44,
    },
    quote: {
      fabrics: [
        { name: "冰丝主布", spec: "160cm / 230gsm", unitCost: 11.7, usage: 0.26 },
        { name: "弹力网眼布", spec: "155cm / 120gsm", unitCost: 8.6, usage: 0.11 },
        { name: "防滑硅胶带", spec: "定制", unitCost: 0.58, usage: 1 },
      ],
      laborCost: 1.74,
      accessoriesCost: 0.56,
      packagingMode: "factory",
      packagingCost: 0.86,
      remarks: "价格最低，但存在关键审核风险，不建议推进。",
    },
  },
  {
    id: "f4",
    name: "釜山协力工厂",
    city: "釜山",
    country: "韩国",
    product: "p1",
    status: "green",
    totalScore: 88,
    hardFail: false,
    hardFailReasons: [],
    mandatoryDocsRate: 96,
    followUpRequired: false,
    lastAuditDate: "2026-02-18",
    leadTimeDays: 31,
    modules: {
      supplyChain: 86,
      documentation: 88,
      childLabor: 100,
      forcedLabor: 92,
      wagesHours: 84,
      healthSafety: 90,
      grievance: 83,
      environment: 85,
      auditEthics: 91,
    },
    quote: {
      fabrics: [
        { name: "冰丝主布", spec: "160cm / 230gsm", unitCost: 13.5, usage: 0.26 },
        { name: "弹力网眼布", spec: "155cm / 120gsm", unitCost: 9.9, usage: 0.11 },
        { name: "防滑硅胶带", spec: "定制", unitCost: 0.8, usage: 1 },
      ],
      laborCost: 2.42,
      accessoriesCost: 0.78,
      packagingMode: "factory",
      packagingCost: 1.08,
      remarks: "审核表现稳定，报价略高，适合高标准客户。",
    },
  },
  {
    id: "f5",
    name: "南通锐达工厂",
    city: "南通",
    country: "中国",
    product: "p2",
    status: "yellow",
    totalScore: 82,
    hardFail: false,
    hardFailReasons: [],
    mandatoryDocsRate: 90,
    followUpRequired: true,
    lastAuditDate: "2026-02-02",
    leadTimeDays: 26,
    modules: {
      supplyChain: 80,
      documentation: 84,
      childLabor: 100,
      forcedLabor: 91,
      wagesHours: 76,
      healthSafety: 77,
      grievance: 78,
      environment: 79,
      auditEthics: 86,
    },
    quote: {
      fabrics: [
        { name: "凉感针织布", spec: "165cm / 210gsm", unitCost: 11.1, usage: 0.2 },
        { name: "透气网布", spec: "150cm / 110gsm", unitCost: 7.9, usage: 0.08 },
      ],
      laborCost: 1.68,
      accessoriesCost: 0.44,
      packagingMode: "external",
      packagingCost: 0.49,
      remarks: "可作为第二产品线候选。",
    },
  },
];

const statusMeta = {
  green: {
    label: "绿灯 / 可推进",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50/90 text-emerald-700 border-emerald-200",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  yellow: {
    label: "黄灯 / 需整改",
    dot: "bg-amber-500",
    badge: "bg-amber-50/90 text-amber-700 border-amber-200",
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  red: {
    label: "红灯 / 不建议",
    dot: "bg-rose-500",
    badge: "bg-rose-50/90 text-rose-700 border-rose-200",
    icon: <ShieldX className="h-4 w-4" />,
  },
  gray: {
    label: "灰灯 / 待补证",
    dot: "bg-slate-400",
    badge: "bg-slate-100/90 text-slate-700 border-slate-200",
    icon: <FileText className="h-4 w-4" />,
  },
};

const moduleLabels = [
  { key: "supplyChain", label: "供应链披露" },
  { key: "documentation", label: "文件记录" },
  { key: "childLabor", label: "童工与未成年工" },
  { key: "forcedLabor", label: "强迫劳动" },
  { key: "wagesHours", label: "工资工时" },
  { key: "healthSafety", label: "健康安全" },
  { key: "grievance", label: "申诉机制" },
  { key: "environment", label: "环境管理" },
  { key: "auditEthics", label: "审计伦理" },
];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function formatMoney(value) {
  return `¥${value.toFixed(2)}`;
}

function calcFabricCost(quote) {
  return quote.fabrics.reduce((sum, item) => sum + item.unitCost * item.usage, 0);
}

function calcTotalQuote(quote) {
  return calcFabricCost(quote) + quote.laborCost + quote.accessoriesCost + quote.packagingCost;
}

function getModuleStatus(score) {
  if (score >= 85) return "green";
  if (score >= 70) return "yellow";
  return "red";
}

function ScoreRing({ value, status }) {
  const color =
    status === "green"
      ? "stroke-emerald-500"
      : status === "yellow"
        ? "stroke-amber-500"
        : status === "red"
          ? "stroke-rose-500"
          : "stroke-slate-400";

  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative h-28 w-28">
      <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90">
        <circle cx="50" cy="50" r="42" className="fill-none stroke-slate-200/80" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r="42"
          className={cn("fill-none transition-all duration-500", color)}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-semibold text-slate-900">{value}</div>
        <div className="text-xs text-slate-500">综合评分</div>
      </div>
    </div>
  );
}

function KPI({ title, value, hint, icon }) {
  return (
    <div className="rounded-[28px] border border-white/70 bg-white/78 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-slate-500">{title}</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{value}</div>
          <div className="mt-2 text-sm text-slate-500">{hint}</div>
        </div>
        <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">{icon}</div>
      </div>
    </div>
  );
}

function FactoryCard({ item, onOpen }) {
  const meta = statusMeta[item.status];
  const total = calcTotalQuote(item.quote);

  return (
    <div className="rounded-[28px] border border-white/80 bg-white/82 p-5 shadow-[0_12px_36px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className={cn("h-2.5 w-2.5 rounded-full", meta.dot)} />
            <div className="text-lg font-semibold text-slate-900">{item.name}</div>
          </div>
          <div className="mt-1 text-sm text-slate-500">
            {item.country} · {item.city}
          </div>
        </div>
        <div className={cn("inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium", meta.badge)}>
          {meta.icon}
          {meta.label}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-slate-50/90 p-3">
          <div className="text-xs text-slate-500">审核评分</div>
          <div className="mt-1 text-xl font-semibold text-slate-900">{item.totalScore}</div>
        </div>
        <div className="rounded-2xl bg-slate-50/90 p-3">
          <div className="text-xs text-slate-500">总报价</div>
          <div className="mt-1 text-xl font-semibold text-slate-900">{formatMoney(total)}</div>
        </div>
        <div className="rounded-2xl bg-slate-50/90 p-3">
          <div className="text-xs text-slate-500">交期</div>
          <div className="mt-1 text-xl font-semibold text-slate-900">{item.leadTimeDays}天</div>
        </div>
      </div>

      {item.hardFail && (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          关键问题：{item.hardFailReasons.join("；")}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-sm text-slate-500">资料完整率 {item.mandatoryDocsRate}%</span>
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
        >
          进入详情
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function CostcoFactoryScoringQuoteDashboard() {
  const [viewMode, setViewMode] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(products[0].id);
  const [selectedFactoryId, setSelectedFactoryId] = useState(() => factoriesSeed.find((i) => i.product === products[0].id)?.id ?? "");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("score");

  const currentProduct = products.find((p) => p.id === selectedProduct) ?? products[0];

  const productFactories = useMemo(() => factoriesSeed.filter((item) => item.product === selectedProduct), [selectedProduct]);

  const filteredFactories = useMemo(() => {
    const list = productFactories
      .filter((item) => (statusFilter === "all" ? true : item.status === statusFilter))
      .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()) || item.city.includes(search));

    return [...list].sort((a, b) => {
      if (sortBy === "score") return b.totalScore - a.totalScore;
      if (sortBy === "leadTime") return a.leadTimeDays - b.leadTimeDays;
      return calcTotalQuote(a.quote) - calcTotalQuote(b.quote);
    });
  }, [productFactories, search, statusFilter, sortBy]);

  const selectedFactory = useMemo(() => {
    return productFactories.find((item) => item.id === selectedFactoryId) ?? productFactories[0] ?? null;
  }, [productFactories, selectedFactoryId]);

  const summary = useMemo(() => {
    const green = productFactories.filter((i) => i.status === "green").length;
    const yellow = productFactories.filter((i) => i.status === "yellow").length;
    const red = productFactories.filter((i) => i.status === "red").length;
    const bestQuote = productFactories.length ? Math.min(...productFactories.map((i) => calcTotalQuote(i.quote))) : 0;
    return { green, yellow, red, total: productFactories.length, bestQuote };
  }, [productFactories]);

  const radarData = selectedFactory
    ? [
        { subject: "供应链", value: selectedFactory.modules.supplyChain },
        { subject: "文件", value: selectedFactory.modules.documentation },
        { subject: "童工", value: selectedFactory.modules.childLabor },
        { subject: "强迫劳动", value: selectedFactory.modules.forcedLabor },
        { subject: "工资工时", value: selectedFactory.modules.wagesHours },
        { subject: "健康安全", value: selectedFactory.modules.healthSafety },
        { subject: "申诉", value: selectedFactory.modules.grievance },
        { subject: "环境", value: selectedFactory.modules.environment },
        { subject: "审计伦理", value: selectedFactory.modules.auditEthics },
      ]
    : [];

  const moduleScoreCards = selectedFactory
    ? moduleLabels.map((module) => ({
        label: module.label,
        score: selectedFactory.modules[module.key],
        status: getModuleStatus(selectedFactory.modules[module.key]),
      }))
    : [];

  const selectedQuoteBreakdown = selectedFactory
    ? [
        { name: "面料成本", value: Number(calcFabricCost(selectedFactory.quote).toFixed(2)) },
        { name: "人工费", value: selectedFactory.quote.laborCost },
        { name: "辅料", value: selectedFactory.quote.accessoriesCost },
        { name: "包装", value: selectedFactory.quote.packagingCost },
      ]
    : [];

  const openDetails = (factoryId) => {
    setSelectedFactoryId(factoryId);
    setViewMode("detail");
  };

  const goHome = () => setViewMode("home");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 text-slate-900">
      <div className="mx-auto max-w-[1600px] px-4 py-4 lg:px-6 lg:py-6">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-[34px] border border-white/80 bg-white/76 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
            <div className="flex items-center gap-3">
              <div className="rounded-[22px] bg-gradient-to-br from-sky-500 to-indigo-500 p-3 text-white shadow-lg shadow-sky-200">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">Costco Audit</div>
                <div className="mt-1 text-xl font-semibold text-slate-900">产品审核与报价系统</div>
              </div>
            </div>

            <div className="mt-6 rounded-[28px] border border-slate-100 bg-gradient-to-br from-white to-sky-50 p-4">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Sparkles className="h-4 w-4 text-sky-500" />
                当前产品
              </div>
              <select
                value={selectedProduct}
                onChange={(e) => {
                  setSelectedProduct(e.target.value);
                  const next = factoriesSeed.find((item) => item.product === e.target.value);
                  if (next) setSelectedFactoryId(next.id);
                  setViewMode("home");
                }}
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-300"
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>

              <div className="mt-4 rounded-3xl border border-white/80 bg-white/84 p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Package className="h-4 w-4 text-sky-500" />
                  {currentProduct.sku}
                </div>
                <div className="mt-2 text-lg font-semibold text-slate-900">{currentProduct.category}</div>
                <div className="mt-3 text-sm leading-6 text-slate-500">{currentProduct.description}</div>
                <div className="mt-4 text-sm text-slate-500">目标数量 {currentProduct.targetQty.toLocaleString()} pcs</div>
              </div>
            </div>

            <div className="mt-6 rounded-[28px] border border-white/80 bg-white/84 p-4 shadow-sm">
              <div className="text-sm font-medium text-slate-700">产品用料</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {currentProduct.fabricsRequired.map((fabric) => (
                  <span key={fabric} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                    {fabric}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-[28px] border border-white/80 bg-white/84 p-4 shadow-sm">
              <div className="text-sm font-medium text-slate-700">审核重点</div>
              <div className="mt-3 space-y-2 text-sm text-slate-500">
                {currentProduct.auditFocus.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-sky-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-[28px] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-4">
              <div className="text-sm font-medium text-slate-700">使用方式</div>
              <div className="mt-2 text-sm leading-6 text-slate-500">
                首页只展示工厂列表与报价概览。点击工厂卡片上的“进入详情”，再查看该工厂的审厂模块数据、关键问题和报价结构。
              </div>
            </div>
          </aside>

          <main className="space-y-6">
            {viewMode === "home" ? (
              <>
                <div className="rounded-[34px] border border-white/80 bg-white/76 px-6 py-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl lg:px-7">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                      <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{currentProduct.name} 工厂总览</h1>
                      <div className="mt-2 text-sm text-slate-500">先看哪些工厂可以推进，再进入详情页查看 Costco 审厂模块分数和完整报价。</div>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <div className="relative min-w-[250px]">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="搜索工厂名称或城市"
                          className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm shadow-sm outline-none focus:border-sky-300"
                        />
                      </div>
                      <div className="flex gap-3">
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-sky-300"
                        >
                          <option value="all">全部状态</option>
                          <option value="green">绿灯</option>
                          <option value="yellow">黄灯</option>
                          <option value="red">红灯</option>
                          <option value="gray">灰灯</option>
                        </select>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-sky-300"
                        >
                          <option value="score">按审核评分</option>
                          <option value="price">按总报价</option>
                          <option value="leadTime">按交期</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <KPI title="参与工厂" value={`${summary.total}`} hint="当前产品已录入工厂数" icon={<Factory className="h-5 w-5" />} />
                  <KPI title="可推进工厂" value={`${summary.green}`} hint="绿灯工厂数量" icon={<CheckCircle2 className="h-5 w-5" />} />
                  <KPI title="需整改工厂" value={`${summary.yellow}`} hint="黄灯工厂数量" icon={<AlertTriangle className="h-5 w-5" />} />
                  <KPI title="最低总报价" value={formatMoney(summary.bestQuote)} hint="当前产品最低完整报价" icon={<WalletCards className="h-5 w-5" />} />
                </div>

                <section className="rounded-[34px] border border-white/80 bg-white/76 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold text-slate-900">工厂列表</div>
                      <div className="mt-1 text-sm text-slate-500">首页仅展示工厂概览，不直接展开详情。</div>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-600">
                      <Filter className="h-4 w-4" />
                      {filteredFactories.length} 家工厂
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
                    {filteredFactories.map((item) => (
                      <FactoryCard key={item.id} item={item} onOpen={() => openDetails(item.id)} />
                    ))}
                  </div>
                </section>

                <section className="rounded-[34px] border border-white/80 bg-white/76 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold text-slate-900">报价明细表</div>
                      <div className="mt-1 text-sm text-slate-500">保留首页快速比价能力，详情页再看单个工厂的完整审核数据。</div>
                    </div>
                    <div className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-600">快速比价</div>
                  </div>

                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500">
                          <th className="pb-3 pr-4 font-medium">工厂</th>
                          <th className="pb-3 pr-4 font-medium">面料成本</th>
                          <th className="pb-3 pr-4 font-medium">人工费</th>
                          <th className="pb-3 pr-4 font-medium">辅料</th>
                          <th className="pb-3 pr-4 font-medium">包装</th>
                          <th className="pb-3 pr-4 font-medium">总报价</th>
                          <th className="pb-3 font-medium">审核灯号</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredFactories.map((item) => {
                          const total = calcTotalQuote(item.quote);
                          return (
                            <tr key={item.id} className="border-b border-slate-100 last:border-none">
                              <td className="py-4 pr-4 font-medium text-slate-900">{item.name}</td>
                              <td className="py-4 pr-4 text-slate-700">{formatMoney(calcFabricCost(item.quote))}</td>
                              <td className="py-4 pr-4 text-slate-700">{formatMoney(item.quote.laborCost)}</td>
                              <td className="py-4 pr-4 text-slate-700">{formatMoney(item.quote.accessoriesCost)}</td>
                              <td className="py-4 pr-4 text-slate-700">{formatMoney(item.quote.packagingCost)}</td>
                              <td className="py-4 pr-4 font-semibold text-slate-900">{formatMoney(total)}</td>
                              <td className="py-4">
                                <span className={cn("inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium", statusMeta[item.status].badge)}>
                                  <div className={cn("h-2 w-2 rounded-full", statusMeta[item.status].dot)} />
                                  {statusMeta[item.status].label}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            ) : selectedFactory ? (
              <>
                <div className="rounded-[34px] border border-white/80 bg-white/76 px-6 py-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl lg:px-7">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                      <button
                        type="button"
                        onClick={goHome}
                        className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        返回工厂列表
                      </button>
                      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">{selectedFactory.name} 详情</h1>
                      <div className="mt-2 text-sm text-slate-500">
                        {selectedFactory.country} · {selectedFactory.city} · 最后审核 {selectedFactory.lastAuditDate}
                      </div>
                    </div>
                    <ScoreRing value={selectedFactory.totalScore} status={selectedFactory.status} />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <KPI title="审核状态" value={statusMeta[selectedFactory.status].label.split(" /")[0]} hint="根据 Costco 审厂标准判断" icon={statusMeta[selectedFactory.status].icon} />
                  <KPI title="资料完整率" value={`${selectedFactory.mandatoryDocsRate}%`} hint="必交资料上传与验证比例" icon={<FileText className="h-5 w-5" />} />
                  <KPI title="交期" value={`${selectedFactory.leadTimeDays}天`} hint="当前产品预估交期" icon={<Clock3 className="h-5 w-5" />} />
                </div>

                <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[0.92fr_1.08fr]">
                  <section className="rounded-[34px] border border-white/80 bg-white/76 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold text-slate-900">审厂模块雷达</div>
                      <div className={cn("inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium", statusMeta[selectedFactory.status].badge)}>
                        {statusMeta[selectedFactory.status].icon}
                        {statusMeta[selectedFactory.status].label}
                      </div>
                    </div>
                    <div className="mt-4 h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                          <PolarRadiusAxis domain={[0, 100]} tick={false} />
                          <Radar dataKey="value" fillOpacity={0.3} />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </section>

                  <section className="rounded-[34px] border border-white/80 bg-white/76 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl"
                  >
                    <div className="text-lg font-semibold text-slate-900">符合审厂标准的各项数据</div>
                    <div className="mt-1 text-sm text-slate-500">每个模块分数对应当前工厂的 Costco 审厂准备度。</div>
                    <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                      {moduleScoreCards.map((item) => (
                        <div key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-sm font-medium text-slate-700">{item.label}</div>
                            <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium", statusMeta[item.status].badge)}>
                              <div className={cn("h-2 w-2 rounded-full", statusMeta[item.status].dot)} />
                              {item.score}
                            </span>
                          </div>
                          <div className="mt-3 h-2 rounded-full bg-slate-200">
                            <div
                              className={cn(
                                "h-2 rounded-full",
                                item.status === "green" ? "bg-emerald-500" : item.status === "yellow" ? "bg-amber-500" : "bg-rose-500"
                              )}
                              style={{ width: `${item.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[0.92fr_1.08fr]">
                  <section className="rounded-[34px] border border-white/80 bg-white/76 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
                    <div className="text-lg font-semibold text-slate-900">报价结构</div>
                    <div className="mt-1 text-sm text-slate-500">查看该工厂针对当前产品的完整报价构成。</div>
                    <div className="mt-4 space-y-3">
                      {selectedQuoteBreakdown.map((row) => (
                        <div key={row.name}>
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <span className="text-slate-600">{row.name}</span>
                            <span className="font-medium text-slate-900">{formatMoney(row.value)}</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-200">
                            <div className="h-2 rounded-full bg-sky-500" style={{ width: `${(row.value / calcTotalQuote(selectedFactory.quote)) * 100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 rounded-2xl bg-slate-50/90 p-4">
                      <div className="text-xs text-slate-500">总报价</div>
                      <div className="mt-1 text-2xl font-semibold text-slate-950">{formatMoney(calcTotalQuote(selectedFactory.quote))}</div>
                      <div className="mt-2 text-sm text-slate-500">{selectedFactory.quote.remarks}</div>
                    </div>
                  </section>

                  <section className="rounded-[34px] border border-white/80 bg-white/76 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
                    <div className="text-lg font-semibold text-slate-900">面料与加工明细</div>
                    <div className="mt-1 text-sm text-slate-500">当前产品在该工厂的用料、人工与包装成本拆分。</div>
                    <div className="mt-4 overflow-x-auto">
                      <table className="min-w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500">
                            <th className="pb-3 pr-4 font-medium">面料/项目</th>
                            <th className="pb-3 pr-4 font-medium">规格</th>
                            <th className="pb-3 pr-4 font-medium">单价</th>
                            <th className="pb-3 font-medium">用量</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedFactory.quote.fabrics.map((item) => (
                            <tr key={item.name} className="border-b border-slate-100 last:border-none">
                              <td className="py-4 pr-4 font-medium text-slate-900">{item.name}</td>
                              <td className="py-4 pr-4 text-slate-600">{item.spec}</td>
                              <td className="py-4 pr-4 text-slate-600">{formatMoney(item.unitCost)}</td>
                              <td className="py-4 text-slate-600">{item.usage}</td>
                            </tr>
                          ))}
                          <tr className="border-b border-slate-100">
                            <td className="py-4 pr-4 font-medium text-slate-900">人工费</td>
                            <td className="py-4 pr-4 text-slate-600">含加工</td>
                            <td className="py-4 pr-4 text-slate-600">{formatMoney(selectedFactory.quote.laborCost)}</td>
                            <td className="py-4 text-slate-600">1</td>
                          </tr>
                          <tr className="border-b border-slate-100">
                            <td className="py-4 pr-4 font-medium text-slate-900">辅料</td>
                            <td className="py-4 pr-4 text-slate-600">含辅料与小配件</td>
                            <td className="py-4 pr-4 text-slate-600">{formatMoney(selectedFactory.quote.accessoriesCost)}</td>
                            <td className="py-4 text-slate-600">1</td>
                          </tr>
                          <tr>
                            <td className="py-4 pr-4 font-medium text-slate-900">包装</td>
                            <td className="py-4 pr-4 text-slate-600">{selectedFactory.quote.packagingMode === "factory" ? "工厂提供" : "外部提供"}</td>
                            <td className="py-4 pr-4 text-slate-600">{formatMoney(selectedFactory.quote.packagingCost)}</td>
                            <td className="py-4 text-slate-600">1</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>

                {selectedFactory.hardFail && (
                  <section className="rounded-[34px] border border-rose-200 bg-rose-50 p-5 shadow-[0_18px_60px_rgba(244,63,94,0.08)]">
                    <div className="flex items-center gap-2 text-sm font-semibold text-rose-700">
                      <ShieldX className="h-4 w-4" />
                      关键审核风险
                    </div>
                    <ul className="mt-3 space-y-2 text-sm text-rose-700">
                      {selectedFactory.hardFailReasons.map((reason) => (
                        <li key={reason}>• {reason}</li>
                      ))}
                    </ul>
                  </section>
                )}
              </>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
}
