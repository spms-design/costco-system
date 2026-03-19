import React, { useState, useMemo } from 'react';
import { 
  Building2, ClipboardCheck, BadgeDollarSign, LayoutDashboard, Plus, Trash2, 
  CheckCircle2, XCircle, AlertTriangle, PackageSearch, ChevronRight,
  TrendingDown, ShieldCheck, ShieldAlert, FileQuestion, Calculator, Save
} from 'lucide-react';

// --- Costco 审核标准配置字典 ---
const AUDIT_CATEGORIES = [
  { id: 'supply_chain_disclosure', name: '供应链透明度 (Supply Chain Disclosure)', weight: 8, critical: true },
  { id: 'documentation_integrity', name: '文件完整性 (Documentation Integrity)', weight: 8, critical: true },
  { id: 'child_labor_young_workers', name: '童工与未成年工 (Child Labor)', weight: 10, critical: true },
  { id: 'forced_labor_recruitment_id_control', name: '强迫劳动与招聘 (Forced Labor)', weight: 15, critical: true },
  { id: 'wages_benefits_payroll', name: '薪资福利与工资单 (Wages & Benefits)', weight: 15, critical: true },
  { id: 'working_hours_overtime_rest', name: '工时与休息 (Working Hours)', weight: 10, critical: true },
  { id: 'health_safety_fire_ppe_housing', name: '健康安全消防与宿舍 (H&S, Fire)', weight: 18, critical: true },
  { id: 'grievance_nonretaliation_nondiscrimination_foa', name: '申诉与反歧视 (Grievance & FOA)', weight: 6, critical: false },
  { id: 'environment', name: '环境保护 (Environment)', weight: 5, critical: false },
  { id: 'audit_integrity_antibribery_cap', name: '审核诚信与反贿赂 (Audit Integrity)', weight: 5, critical: true },
];

const HARD_FAIL_RULES = [
  { id: 'illegal_child_labor', name: '非法使用童工' },
  { id: 'forced_or_bonded_or_prison_labor', name: '强迫/契约/监狱劳动' },
  { id: 'human_trafficking', name: '人口贩卖' },
  { id: 'physical_or_sexual_or_verbal_or_mental_abuse', name: '身体/性/语言/精神虐待' },
  { id: 'bribery_or_attempted_bribery', name: '贿赂或企图贿赂审核员' },
  { id: 'immediate_risk_to_life_or_limb', name: '直接危及生命或肢体安全的风险' },
  { id: 'corruption_or_deception_or_falsified_records', name: '腐败、欺骗或伪造记录' },
  { id: 'auditor_denied_timely_entry', name: '拒绝审核员及时进入' },
  { id: 'unauthorized_subcontracting', name: '未经授权的外发分包' },
  { id: 'retaliation_against_worker_or_auditor', name: '对工人或审核员进行报复' },
  { id: 'systemic_minimum_wage_or_overtime_or_rest_day_violation', name: '系统性违反最低工资/加班/休息日规定' },
  { id: 'korea_gratuity_or_economic_benefit_to_costco', name: '向Costco提供小费或经济利益 (韩国特别条款)' },
];

const INITIAL_PRODUCTS = [
  { id: 'p1', name: '2026款户外防水冲锋衣 (SKU: JK-2026-WP)' },
  { id: 'p2', name: '全棉加厚针织卫衣 (SKU: HD-001-CO)' }
];

const INITIAL_FACTORIES = [
  { id: 'f1', name: '杭州鑫源服装制作有限公司', audit: { light: 'green', score: 92, date: '2025-11-15', note: '社会责任与质量均达标' }},
  { id: 'f2', name: '宁波恒泰制衣厂', audit: { light: 'red', score: 65, date: '2025-10-02', note: '消防通道不合规 (得分<70)' }},
  { id: 'f3', name: '温州卓越服饰有限公司', audit: { light: 'gray', score: 0, date: '2025-12-01', note: '文件完整度不足80%，无法核实' }},
  { id: 'f4', name: '苏州锦绣纺织加工厂', audit: { light: 'yellow', score: 82, date: '2026-01-20', note: '工时部分存在轻微瑕疵' }}
];

const INITIAL_QUOTES = [
  { id: 'q1', productId: 'p1', factoryId: 'f1', fabrics: [{ name: 'GORE-TEX 防水主面料', cost: 45.5 }, { name: '透气网眼内衬', cost: 12.0 }], laborCost: 35.0, accessoryCost: 8.5, packaging: { cost: 5.0, type: 'factory' } },
  { id: 'q2', productId: 'p1', factoryId: 'f2', fabrics: [{ name: '国产防水复合面料', cost: 28.0 }, { name: '普通内衬', cost: 8.0 }], laborCost: 25.0, accessoryCost: 6.0, packaging: { cost: 4.0, type: 'factory' } },
  { id: 'q3', productId: 'p1', factoryId: 'f4', fabrics: [{ name: '高阶防水涂层主面料', cost: 40.0 }, { name: '抗菌内衬', cost: 15.0 }], laborCost: 32.0, accessoryCost: 9.0, packaging: { cost: 6.5, type: 'external' } }
];

const calculateTotal = (quote) => {
  const fabricTotal = quote.fabrics.reduce((sum, f) => sum + (Number(f.cost) || 0), 0);
  return fabricTotal + Number(quote.laborCost || 0) + Number(quote.accessoryCost || 0) + Number(quote.packaging.cost || 0);
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProductId, setSelectedProductId] = useState(INITIAL_PRODUCTS[0].id);
  const [products] = useState(INITIAL_PRODUCTS);
  const [factories, setFactories] = useState(INITIAL_FACTORIES);
  const [quotes, setQuotes] = useState(INITIAL_QUOTES);

  const DashboardView = () => {
    const relevantQuotes = quotes.filter(q => q.productId === selectedProductId);
    const tableData = relevantQuotes.map(quote => {
      const factory = factories.find(f => f.id === quote.factoryId);
      const totalCost = calculateTotal(quote);
      const fabricTotal = quote.fabrics.reduce((sum, f) => sum + Number(f.cost), 0);
      const laborTotal = Number(quote.laborCost) + Number(quote.accessoryCost);
      const pkgTotal = Number(quote.packaging.cost);
      return { ...quote, factory, totalCost, fabricTotal, laborTotal, pkgTotal, fabricPct: (fabricTotal/totalCost)*100, laborPct: (laborTotal/totalCost)*100, pkgPct: (pkgTotal/totalCost)*100 };
    }).sort((a, b) => a.totalCost - b.totalCost);

    const greenFactoriesCount = factories.filter(f => f.audit?.light === 'green').length;
    const avgCost = tableData.length > 0 ? tableData.reduce((s, r) => s + r.totalCost, 0) / tableData.length : 0;
    const lowestCost = tableData.length > 0 ? tableData[0].totalCost : 0;

    return (
      <div className="space-y-6 animate-in fade-in duration-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">产品寻源评估中心</h2>
            <p className="text-sm text-slate-500 mt-1">一览各工厂报价明细及 Costco 审厂合规资质</p>
          </div>
          <div className="mt-4 sm:mt-0 w-full sm:w-80">
            <select className="w-full bg-slate-50 border-slate-200 text-slate-700 font-medium rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5" value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)}>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20">
            <div className="flex justify-between items-start">
              <div><p className="text-emerald-100 font-medium text-sm">绿灯/优选工厂数</p><h3 className="text-4xl font-extrabold mt-2">{greenFactoriesCount} <span className="text-lg font-medium opacity-80">家</span></h3></div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"><ShieldCheck className="w-6 h-6 text-white" /></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div><p className="text-slate-500 font-medium text-sm">当前最低单价</p><h3 className="text-3xl font-extrabold text-slate-800 mt-2">¥{lowestCost.toFixed(2)}</h3></div>
              <div className="p-3 bg-indigo-50 rounded-xl"><TrendingDown className="w-6 h-6 text-indigo-600" /></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div><p className="text-slate-500 font-medium text-sm">品类平均成本</p><h3 className="text-3xl font-extrabold text-slate-800 mt-2">¥{avgCost.toFixed(2)}</h3></div>
              <div className="p-3 bg-blue-50 rounded-xl"><Calculator className="w-6 h-6 text-blue-600" /></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/80 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">代工厂名称 & 状态</th>
                  <th className="px-6 py-5 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Costco 验厂评级</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">成本结构可视化 (¥)</th>
                  <th className="px-6 py-5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">总单价</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tableData.map((row, index) => {
                  const l = row.factory.audit?.light || 'gray';
                  const lightConfig = {
                    green: { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: ShieldCheck, label: '绿灯通过' },
                    yellow: { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertTriangle, label: '黄灯有条件' },
                    red: { color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', icon: ShieldAlert, label: '红灯否决' },
                    gray: { color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-200', icon: FileQuestion, label: '灰灯不可查' },
                  }[l];
                  const Icon = lightConfig.icon;
                  const isOptimal = index === 0 && (l === 'green' || l === 'yellow');

                  return (
                    <tr key={row.id} className={isOptimal ? 'bg-indigo-50/30' : ''}>
                      <td className="px-6 py-5">
                        <div className="text-sm font-bold text-slate-900">{row.factory.name}</div>
                        {isOptimal && <div className="text-xs font-medium text-indigo-600 mt-1">综合优选建议</div>}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold ${lightConfig.bg} ${lightConfig.color} border ${lightConfig.border}`}>
                          <Icon className="w-4 h-4 mr-1.5" /> {lightConfig.label} ({row.factory.audit.score}分)
                        </div>
                      </td>
                      <td className="px-6 py-5 w-1/3">
                         <div className="flex h-3 w-full rounded-full overflow-hidden bg-slate-100">
                           <div style={{ width: `${row.fabricPct}%` }} className="bg-indigo-500"></div>
                           <div style={{ width: `${row.laborPct}%` }} className="bg-amber-400"></div>
                           <div style={{ width: `${row.pkgPct}%` }} className="bg-rose-400"></div>
                         </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="text-2xl font-black text-slate-900">¥{row.totalCost.toFixed(2)}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const AuditEvaluationView = () => {
    const [selectedFactoryId, setSelectedFactoryId] = useState(factories[0]?.id || '');
    const [hardFails, setHardFails] = useState([]);
    const [categoryScores, setCategoryScores] = useState(AUDIT_CATEGORIES.reduce((acc, cat) => ({...acc, [cat.id]: 1.0}), {}));
    const [docCompleteness, setDocCompleteness] = useState(100);
    const [hasMajorCAP, setHasMajorCAP] = useState(false);
    const [isDataVerifiable, setIsDataVerifiable] = useState(true);
    
    const calculateResult = () => {
      let totalScore = 0;
      let minCriticalScore = 100;
      AUDIT_CATEGORIES.forEach(cat => {
        const score = cat.weight * categoryScores[cat.id];
        totalScore += score;
        if (cat.critical && (categoryScores[cat.id]*100) < minCriticalScore) minCriticalScore = categoryScores[cat.id]*100;
      });

      let light = 'green', reason = '';
      if (!isDataVerifiable) { light = 'gray'; reason = '数据无法核实'; }
      else if (docCompleteness < 80) { light = 'gray'; reason = '文件完整度低于80%'; }
      else if (hardFails.length > 0) { light = 'red'; reason = '触发一票否决项'; }
      else if (totalScore < 70) { light = 'red'; reason = '总分低于70分'; }
      else if (minCriticalScore < 60) { light = 'red'; reason = '关键项低于60分'; }
      else if (totalScore >= 85 && minCriticalScore >= 80 && docCompleteness >= 95 && !hasMajorCAP) { light = 'green'; reason = '符合 Costco 绿灯要求'; }
      else { light = 'yellow'; reason = '需制定改善计划 (CAP)'; }
      return { totalScore: Number(totalScore.toFixed(1)), light, reason };
    };

    const result = calculateResult();

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="bg-slate-900 px-6 py-5 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Costco V1.0 审厂自动评估引擎</h2>
            <select className="w-64 bg-slate-800 text-white rounded-xl" value={selectedFactoryId} onChange={e => setSelectedFactoryId(e.target.value)}>
              {factories.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="col-span-2 space-y-8">
              <section>
                <h3 className="text-base font-bold text-rose-600 mb-4">一票否决项 (Hard Fail)</h3>
                <div className="grid grid-cols-2 gap-3">
                  {HARD_FAIL_RULES.map(rule => (
                    <label key={rule.id} className="flex items-start p-3 bg-slate-50 border rounded-xl">
                      <input type="checkbox" className="mt-1" checked={hardFails.includes(rule.id)} onChange={e => setHardFails(e.target.checked ? [...hardFails, rule.id] : hardFails.filter(id => id !== rule.id))}/>
                      <span className="ml-3 text-sm">{rule.name}</span>
                    </label>
                  ))}
                </div>
              </section>
              <section>
                <h3 className="text-base font-bold text-slate-800 mb-4">核心类别评分</h3>
                {AUDIT_CATEGORIES.map(cat => (
                  <div key={cat.id} className="flex justify-between p-3 bg-slate-50 border-b">
                    <span className="text-sm font-bold">{cat.name}</span>
                    <select className="text-sm border-slate-300 rounded-lg" value={categoryScores[cat.id]} onChange={e => setCategoryScores({...categoryScores, [cat.id]: Number(e.target.value)})}>
                      <option value={1.0}>完全符合 (100%)</option><option value={0.75}>轻微缺失 (75%)</option>
                      <option value={0.4}>重大缺失 (40%)</option><option value={0}>不符合 (0)</option>
                    </select>
                  </div>
                ))}
              </section>
            </div>
            <div className="col-span-1 bg-slate-50 rounded-2xl p-6 text-center">
              <h4 className="text-2xl font-black text-slate-800 mt-4 capitalize">{result.light} 灯评级</h4>
              <div className="text-4xl font-black text-indigo-600 mt-2">{result.totalScore}<span className="text-lg text-slate-400">/100</span></div>
              <div className="mt-4 font-bold text-slate-600">{result.reason}</div>
            </div>
          </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <nav className="bg-white border-b sticky top-0 z-10 p-4">
        <div className="flex items-center max-w-7xl mx-auto"><Building2 className="w-8 h-8 text-indigo-600" /><span className="ml-3 text-2xl font-black">SupplyChainPro</span></div>
      </nav>
      <div className="max-w-7xl mx-auto py-8 flex gap-8">
        <aside className="w-64 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left px-4 py-3 font-bold rounded-xl ${activeTab==='dashboard'?'bg-indigo-600 text-white':'text-slate-600'}`}>高管数据看版</button>
          <button onClick={() => setActiveTab('audit')} className={`w-full text-left px-4 py-3 font-bold rounded-xl ${activeTab==='audit'?'bg-indigo-600 text-white':'text-slate-600'}`}>Costco 审厂引擎</button>
        </aside>
        <main className="flex-1">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'audit' && <AuditEvaluationView />}
        </main>
      </div>
    </div>
  );
}
