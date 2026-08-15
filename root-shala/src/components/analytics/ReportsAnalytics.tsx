import React from 'react';
import {
  Download,
  Sparkles,
  TrendingUp,
  Receipt,
  Users,
  Boxes
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';
import { SupplyItem } from '../../types';

interface ReportsAnalyticsProps {
  supplyItems: SupplyItem[];
}

export const ReportsAnalytics: React.FC<ReportsAnalyticsProps> = ({ supplyItems }) => {
  const feeRecoveryCurve = [
    { week: 'W1 Jul', expected: 12.0, actual: 11.8 },
    { week: 'W2 Jul', expected: 18.5, actual: 18.2 },
    { week: 'W3 Jul', expected: 24.0, actual: 23.5 },
    { week: 'W4 Jul', expected: 28.5, actual: 28.5 },
    { week: 'Projected Aug', expected: 35.0, actual: 34.2 }
  ];

  const teacherWorkloadData = [
    { teacher: 'Dr. Alok Nath', lectures: 22, max: 25 },
    { teacher: 'Mrs. Deshmukh', lectures: 24, max: 25 },
    { teacher: 'Prof. Kulkarni', lectures: 20, max: 25 },
    { teacher: 'Ms. Priyamvada', lectures: 18, max: 25 },
    { teacher: 'Mr. David Miller', lectures: 20, max: 25 }
  ];

  return (
    <div className="space-y-6">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Reports & Analytics</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Predictive fee collection curves, faculty load balancing, and inventory forecasting.
          </p>
        </div>

        <button className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-all flex items-center gap-1.5 shadow-2xs self-start sm:self-auto">
          <Download className="w-3.5 h-3.5" />
          <span>Export Executive Board PDF</span>
        </button>
      </div>

      {/* Top KPIs Stripe Style */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Fee Target On-Track</span>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">98.2%</div>
          <div className="text-xs text-slate-400 mt-1">₹28.5L collected in July</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Average Attendance</span>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">92.4%</div>
          <div className="text-xs text-slate-400 mt-1">1,240 active students</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Faculty Utilization</span>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">84.0%</div>
          <div className="text-xs text-slate-400 mt-1">Balanced load across 48 staff</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Inventory Health</span>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">Optimal</div>
          <div className="text-xs text-emerald-600 font-medium mt-1">1 item low stock (A4 paper)</div>
        </div>
      </div>

      {/* Clean Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fee Collection Line Chart */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Fee Recovery Projection (₹ Lakhs)</h3>
            <p className="text-xs text-slate-400">Target vs actual fee collection trajectory</p>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={feeRecoveryCurve}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip />
                <Line type="monotone" dataKey="expected" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="4 4" name="Expected" />
                <Line type="monotone" dataKey="actual" stroke="#066157" strokeWidth={2.5} name="Actual Collected" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Workload Bar Chart */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Teacher Weekly Workload (Lectures)</h3>
            <p className="text-xs text-slate-400">Weekly assigned lectures against 25 max cap</p>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teacherWorkloadData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="teacher" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis domain={[0, 30]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip />
                <Bar dataKey="lectures" fill="#159A8C" radius={[4, 4, 0, 0]} name="Assigned" />
                <Bar dataKey="max" fill="#f1f5f9" radius={[4, 4, 0, 0]} name="Max Cap" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Logistics & Supply Inventory Panel */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Supply Chain & Inventory Forecast</h3>
          <p className="text-xs text-slate-400">Logistics runout prediction and reorder alerts</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {supplyItems.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">{item.category}</span>
                <span
                  className={`px-2 py-0.5 text-[9px] font-semibold rounded ${
                    item.status === 'CRITICAL'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : item.status === 'LOW_STOCK'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="font-semibold text-slate-900 text-xs">{item.itemName}</div>

              <div className="space-y-0.5 text-xs text-slate-500">
                <div className="flex justify-between">
                  <span>Stock:</span>
                  <span className="font-medium text-slate-900">{item.currentStock} {item.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span>Runout:</span>
                  <span className="font-medium text-slate-900">{item.predictedRunoutDays} Days</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

