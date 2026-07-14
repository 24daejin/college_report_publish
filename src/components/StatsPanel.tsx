import React from "react";
import { motion } from "motion/react";
import { GradeStat } from "../types";
import { Award, CheckCircle2, XCircle, HelpCircle } from "lucide-react";

interface StatsPanelProps {
  grade: string;
  statData: GradeStat | undefined;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ grade, statData }) => {
  if (!statData) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center text-slate-400">
        데이터가 없습니다.
      </div>
    );
  }

  const { gyo, jong, non, sil } = statData;

  // Global calculations for the chosen grade interval
  const totalApps = gyo[0] + jong[0] + non[0] + sil[0];
  const totalPass = gyo[1] + jong[1] + non[1] + sil[1];
  const avgRate = totalApps > 0 ? (totalPass / totalApps) * 100 : 0;

  const categories = [
    { label: "학생부교과", data: gyo, color: "from-blue-500 to-indigo-600", bg: "bg-blue-50" },
    { label: "학생부종합", data: jong, color: "from-purple-500 to-pink-600", bg: "bg-purple-50" },
    { label: "논술전형", data: non, color: "from-amber-500 to-orange-600", bg: "bg-amber-50" },
    { label: "실기/기타", data: sil, color: "from-teal-500 to-emerald-600", bg: "bg-teal-50" },
  ];

  const getRateColor = (rate: number) => {
    if (rate >= 70) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (rate >= 30) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-rose-600 bg-rose-50 border-rose-200";
  };

  return (
    <div className="space-y-6">
      {/* Overview stats cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden"
          id="stat-card-total"
        >
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.03] pointer-events-none">
            <Award size={120} className="text-slate-900" />
          </div>
          <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase mb-1">총 지원 건수</p>
          <h3 className="text-2xl font-bold text-slate-900 font-mono">{totalApps} <span className="text-sm font-medium text-slate-400">건</span></h3>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span>선택 등급 구간 지원 규모</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden"
          id="stat-card-rate"
        >
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.03] pointer-events-none">
            <HelpCircle size={120} className="text-slate-900" />
          </div>
          <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase mb-1">평균 합격률</p>
          <h3 className="text-2xl font-bold text-indigo-600 font-mono">
            {avgRate.toFixed(1)}<span className="text-sm font-medium text-indigo-400">%</span>
          </h3>
          <div className="mt-2 flex items-center gap-1">
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${avgRate}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full bg-indigo-600 rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detailed distribution card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
        id="stat-card-distribution"
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
            전형별 상세 수시 통계 ({grade} 등급)
          </h4>
        </div>

        <div className="space-y-4">
          {categories.map((cat, idx) => {
            const [jiwon, hap, rate] = cat.data;
            const percentage = totalApps > 0 ? (jiwon / totalApps) * 100 : 0;

            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{cat.label}</span>
                  <div className="flex items-center gap-2 text-slate-500">
                    <span>지원 <strong className="text-slate-800 font-mono">{jiwon}</strong>건</span>
                    <span>·</span>
                    <span>합격 <strong className="text-slate-800 font-mono">{hap}</strong>건</span>
                    <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${getRateColor(rate)}`}>
                      {rate.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {jiwon > 0 ? (
                  <div className="space-y-1">
                    {/* Distribution Bar */}
                    <div className="w-full h-3 bg-slate-100 rounded-lg overflow-hidden flex">
                      {/* Pass ratio */}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(hap / jiwon) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className={`h-full bg-gradient-to-r ${cat.color}`}
                      />
                      {/* Fail ratio */}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((jiwon - hap) / jiwon) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="h-full bg-slate-200"
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-400">
                      <span>합격 {hap}건 ({(rate).toFixed(0)}%)</span>
                      <span>불합격 {jiwon - hap}건</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-3 bg-slate-50 border border-dashed border-slate-200 rounded-lg flex items-center justify-center">
                    <span className="text-[10px] text-slate-400">지원 데이터 없음</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
