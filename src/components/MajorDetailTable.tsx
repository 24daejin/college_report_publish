import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MajorRecord } from "../types";
import { Target, Info, AlertTriangle, CheckCircle, HelpCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";

interface MajorDetailTableProps {
  list: MajorRecord[];
}

export const MajorDetailTable: React.FC<MajorDetailTableProps> = ({ list }) => {
  // Modal state for selected major failure reasons (for mobile / click support)
  const [selectedMajorForFailDetail, setSelectedMajorForFailDetail] = useState<MajorRecord | null>(null);

  // Accordion expanded list (for expanded rows)
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getFailureTooltipContent = (item: MajorRecord) => {
    return [
      { label: "1단계 서류 불합격", value: item.fail_1st },
      { label: "수능 최저기준 미충족", value: item.fail_min },
      { label: "최종 면접/고사 불합격", value: item.fail_final },
      { label: "면접 불참 / 미응시", value: item.fail_miss },
    ];
  };

  const getRateBadgeStyle = (rate: number) => {
    if (rate >= 70) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (rate >= 30) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-rose-50 text-rose-700 border-rose-200";
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" id="major-detail-card">
      {/* Card Header */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Target size={18} className="text-indigo-600" />
            모집단위별 상세 입시결과분석 현황
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            각 학과별 실지원 건수와 수능 최저 미충족 등 불합격 사유를 정밀 분석합니다.
          </p>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-1.5 self-start sm:self-center">
          <Info size={14} className="text-indigo-500" />
          <span>불합격 클릭 시 상세 사유 팝업</span>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
          <HelpCircle size={36} className="text-slate-300 stroke-[1.5]" />
          <p className="text-sm font-medium">검색 조건에 부합하는 학과 데이터가 없습니다.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/20 text-slate-500 text-xs font-semibold">
                  <th className="py-3 px-5 text-center w-16">순위</th>
                  <th className="py-3 px-4">대학 및 모집단위(학과)</th>
                  <th className="py-3 px-4 text-center w-24">지원</th>
                  <th className="py-3 px-4 text-center w-24">합격</th>
                  <th className="py-3 px-4 text-center w-40">불합격 사유 현황</th>
                  <th className="py-3 px-4 text-center w-28">최종 합격률</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                <AnimatePresence mode="wait">
                  {list.map((item, idx) => {
                    const rowId = `${item.university}-${item.major}`;
                    const totalFail = item.applications - item.accepted;

                    return (
                      <motion.tr
                        key={rowId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, delay: idx * 0.01 }}
                        className="hover:bg-slate-50/40 transition-colors group"
                      >
                        <td className="py-4 px-5 text-center font-semibold text-slate-400 font-mono">
                          {idx + 1}
                        </td>
                        <td className="py-4 px-4 text-left">
                          <div className="font-bold text-slate-800">{item.university}</div>
                          <div className="text-xs text-slate-500 font-medium mt-0.5">{item.major}</div>
                        </td>
                        <td className="py-4 px-4 text-center text-slate-600 font-mono font-semibold">
                          {item.applications}건
                        </td>
                        <td className="py-4 px-4 text-center text-slate-600 font-mono font-semibold">
                          <span className={item.accepted > 0 ? "text-emerald-600" : "text-slate-400"}>
                            {item.accepted}건
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {totalFail > 0 ? (
                            <div className="relative inline-block group/tooltip">
                              {/* Trigger Button */}
                              <button
                                onClick={() => setSelectedMajorForFailDetail(item)}
                                className="px-3 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold border border-rose-200 flex items-center gap-1 mx-auto cursor-pointer transition-colors"
                              >
                                <AlertTriangle size={12} />
                                {totalFail}건 불합격
                              </button>

                              {/* Desktop Hover Tooltip */}
                              <div className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none">
                                <p className="font-bold border-b border-slate-700 pb-1.5 mb-1.5 text-slate-300">
                                  세부 불합격 사유
                                </p>
                                <div className="space-y-1">
                                  {getFailureTooltipContent(item).map((f, i) => (
                                    <div key={i} className="flex justify-between items-center text-[11px]">
                                      <span className="text-slate-400">{f.label}</span>
                                      <span className="font-bold font-mono">{f.value}건</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                              </div>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                              <CheckCircle size={12} />
                              전원 합격
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full border text-xs font-extrabold font-mono ${getRateBadgeStyle(item.rate)}`}>
                            {item.rate.toFixed(1)}%
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile Collapsible Card View */}
          <div className="block md:hidden divide-y divide-slate-100">
            {list.map((item, idx) => {
              const rowId = `${item.university}-${item.major}-mobile`;
              const isExpanded = !!expandedRows[rowId];
              const totalFail = item.applications - item.accepted;

              return (
                <div key={rowId} className="p-4 flex flex-col gap-2.5 hover:bg-slate-50/20 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-bold text-slate-400 font-mono mt-0.5">
                        #{idx + 1}
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{item.university}</h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{item.major}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full border text-[11px] font-extrabold font-mono ${getRateBadgeStyle(item.rate)}`}>
                      {item.rate.toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50/60 p-2 rounded-lg border border-slate-100">
                    <div>
                      지원: <strong className="text-slate-800 font-mono font-bold">{item.applications}건</strong>
                      <span className="mx-2 text-slate-300">|</span>
                      합격: <strong className="text-emerald-600 font-mono font-bold">{item.accepted}건</strong>
                    </div>

                    <button
                      onClick={() => toggleRow(rowId)}
                      className="text-indigo-600 font-semibold flex items-center gap-0.5 hover:text-indigo-700 transition-colors cursor-pointer"
                    >
                      {totalFail > 0 ? (
                        <>
                          <span>사유 분석</span>
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </>
                      ) : (
                        <span className="text-emerald-600 text-[10px] font-bold">100% 합격</span>
                      )}
                    </button>
                  </div>

                  {/* Accordin expansion for failure stats */}
                  <AnimatePresence initial={false}>
                    {isExpanded && totalFail > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
                      >
                        <p className="font-bold text-slate-700 mb-2 border-b border-slate-200 pb-1 flex items-center gap-1.5">
                          <AlertTriangle size={13} className="text-rose-500" />
                          세부 불합격 정보 (총 {totalFail}건)
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {getFailureTooltipContent(item).map((f, i) => (
                            <div key={i} className="flex flex-col p-1.5 bg-white rounded-lg border border-slate-100">
                              <span className="text-[10px] text-slate-400 font-medium">{f.label}</span>
                              <span className="font-extrabold text-slate-800 font-mono text-xs mt-0.5">{f.value}건</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Failure Reason Modal Dialog (Acts as dynamic popup for both mobile and desktop on tap) */}
      <AnimatePresence>
        {selectedMajorForFailDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMajorForFailDetail(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 p-6 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-rose-500" />

              <div className="flex items-start justify-between gap-4 mt-2 mb-4">
                <div>
                  <span className="text-[10px] text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full font-bold">
                    실데이터 불합격 정밀분석
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-lg mt-1.5">
                    {selectedMajorForFailDetail.university}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedMajorForFailDetail.major}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedMajorForFailDetail(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                >
                  <span className="sr-only">닫기</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-100 mb-5">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
                  <span className="font-semibold text-slate-500">총 지원</span>
                  <span className="font-extrabold text-slate-800 font-mono">{selectedMajorForFailDetail.applications}건</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
                  <span className="font-semibold text-slate-500">합격 건수</span>
                  <span className="font-extrabold text-emerald-600 font-mono">{selectedMajorForFailDetail.accepted}건</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500">최종 불합격</span>
                  <span className="font-extrabold text-rose-600 font-mono">
                    {selectedMajorForFailDetail.applications - selectedMajorForFailDetail.accepted}건
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                <p className="text-xs font-bold text-slate-800">세부 불합격 사유 분포</p>
                <div className="grid grid-cols-1 gap-2">
                  {getFailureTooltipContent(selectedMajorForFailDetail).map((f, i) => {
                    const failTotal = selectedMajorForFailDetail.applications - selectedMajorForFailDetail.accepted;
                    const ratio = failTotal > 0 ? (f.value / failTotal) * 100 : 0;

                    return (
                      <div key={i} className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-[11px] font-bold text-slate-700">{f.label}</p>
                          <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-rose-500 rounded-full" style={{ width: `${ratio}%` }} />
                          </div>
                        </div>
                        <span className="font-extrabold text-rose-600 font-mono text-xs">{f.value}건</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => setSelectedMajorForFailDetail(null)}
                className="w-full mt-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 active:bg-slate-950 transition-colors cursor-pointer"
              >
                닫기
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
