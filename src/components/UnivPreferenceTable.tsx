import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { UniversityRecord } from "../types";
import { School, TrendingUp, BarChart2 } from "lucide-react";

interface UnivPreferenceTableProps {
  list: UniversityRecord[];
}

export const UnivPreferenceTable: React.FC<UnivPreferenceTableProps> = ({ list }) => {
  const getProgressColor = (rate: number) => {
    if (rate >= 70) return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]";
    if (rate >= 30) return "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]";
    return "bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]";
  };

  const getTextColor = (rate: number) => {
    if (rate >= 70) return "text-emerald-600";
    if (rate >= 30) return "text-amber-600";
    return "text-rose-600";
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" id="univ-pref-card">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <School size={18} className="text-indigo-600" />
          구간별 지원 대학교 선호도 TOP 10
        </h3>
        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full flex items-center gap-1">
          <TrendingUp size={12} />
          선택그룹 분석
        </span>
      </div>

      {list.length === 0 ? (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
          <BarChart2 size={36} className="text-slate-300 stroke-[1.5]" />
          <p className="text-sm font-medium">검색 조건에 부합하는 대학교 데이터가 없습니다.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/20 text-slate-500 text-xs font-semibold">
                  <th className="py-3 px-5 text-center w-16">순위</th>
                  <th className="py-3 px-4">대학교명</th>
                  <th className="py-3 px-4 text-center w-24">지원 건수</th>
                  <th className="py-3 px-4 text-center w-24">합격 건수</th>
                  <th className="py-3 px-4 text-center w-52">합격률 시각화 (Traffic Light)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                <AnimatePresence mode="wait">
                  {list.slice(0, 10).map((item, idx) => {
                    const [univName, jiwon, hap, rate] = item;
                    return (
                      <motion.tr
                        key={univName}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, delay: idx * 0.02 }}
                        className="hover:bg-slate-50/40 transition-colors"
                      >
                        <td className="py-4 px-5 text-center font-bold text-slate-400">
                          {idx === 0 && <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-extrabold">1</span>}
                          {idx === 1 && <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-extrabold">2</span>}
                          {idx === 2 && <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs font-extrabold">3</span>}
                          {idx > 2 && <span className="text-slate-500 font-mono text-xs">{idx + 1}</span>}
                        </td>
                        <td className="py-4 px-4 font-bold text-slate-800">{univName}</td>
                        <td className="py-4 px-4 text-center text-slate-600 font-mono font-medium">{jiwon}건</td>
                        <td className="py-4 px-4 text-center text-slate-600 font-mono font-medium">{hap}건</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${rate}%` }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className={`h-full rounded-full ${getProgressColor(rate)}`}
                              />
                            </div>
                            <span className={`text-xs font-bold font-mono w-12 text-right ${getTextColor(rate)}`}>
                              {rate.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile Grid/Card View */}
          <div className="block md:hidden divide-y divide-slate-100">
            <AnimatePresence mode="wait">
              {list.slice(0, 10).map((item, idx) => {
                const [univName, jiwon, hap, rate] = item;
                return (
                  <motion.div
                    key={`${univName}-mobile`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 flex flex-col gap-2 hover:bg-slate-50/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {idx === 0 && <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-extrabold">1</span>}
                        {idx === 1 && <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-extrabold">2</span>}
                        {idx === 2 && <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-extrabold">3</span>}
                        {idx > 2 && <span className="text-slate-400 font-mono font-bold text-xs">#{idx + 1}</span>}
                        <span className="font-bold text-slate-800 text-sm">{univName}</span>
                      </div>
                      <span className={`text-xs font-extrabold font-mono ${getTextColor(rate)}`}>
                        {rate.toFixed(1)}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <div>
                        지원: <strong className="text-slate-700 font-mono font-semibold">{jiwon}건</strong>
                        <span className="mx-1.5">|</span>
                        합격: <strong className="text-slate-700 font-mono font-semibold">{hap}건</strong>
                      </div>
                    </div>

                    {/* Simple progress bar */}
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${rate}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className={`h-full rounded-full ${getProgressColor(rate)}`}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
};
