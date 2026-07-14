import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UnivPreferenceTable } from "./components/UnivPreferenceTable";
import { MajorDetailTable } from "./components/MajorDetailTable";
import { TrackType, AdmissionType, SortType, RawDataType, MajorPreferenceDataType, gradeIntervals } from "./types";
import { StatsPanel as StatsPanelComponent } from "./components/StatsPanel";
import CryptoJS from "crypto-js";
import encryptedPayload from "./assets/encryptedData.json";
import { 
  GraduationCap, 
  Search, 
  SlidersHorizontal, 
  BookOpen, 
  Atom, 
  TrendingUp, 
  Sparkles,
  X,
  Compass,
  ChevronDown,
  Lock,
  Unlock
} from "lucide-react";

export default function App() {
  // Authentication & Decrypted Data State
  const [decryptedData, setDecryptedData] = useState<{
    RawData: RawDataType;
    MajorPreferenceData: MajorPreferenceDataType;
  } | null>(null);

  const [passwordInput, setPasswordInput] = useState("");
  const [isError, setIsError] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);

  // Filter States
  const [track, setTrack] = useState<TrackType>("인문");
  const [grade, setGrade] = useState<string>("1.5~2.0");
  const [admissionType, setAdmissionType] = useState<AdmissionType>("교과+종합");
  const [sortBy, setSortBy] = useState<SortType>("applications");
  const [actualSearch, setActualSearch] = useState<string>("");

  // Attempt to restore session auth on mount
  useEffect(() => {
    const savedPass = sessionStorage.getItem("sungui_auth_pass");
    if (savedPass) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedPayload.data, savedPass);
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
        if (decryptedText) {
          const parsed = JSON.parse(decryptedText);
          if (parsed.RawData && parsed.MajorPreferenceData) {
            setDecryptedData(parsed);
          }
        }
      } catch (e) {
        sessionStorage.removeItem("sungui_auth_pass");
      }
    }
  }, []);

  // Handle Decryption
  const handleDecrypt = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDecrypting(true);
    setIsError(false);

    // Minor delay for loading visualization UX
    setTimeout(() => {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedPayload.data, passwordInput);
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
        if (!decryptedText) {
          throw new Error("Invalid password");
        }
        const parsed = JSON.parse(decryptedText);
        if (parsed.RawData && parsed.MajorPreferenceData) {
          setDecryptedData(parsed);
          sessionStorage.setItem("sungui_auth_pass", passwordInput);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err) {
        setIsError(true);
      } finally {
        setIsDecrypting(false);
      }
    }, 400);
  };

  // Derive Current Statistics for active track & grade
  const statData = useMemo(() => {
    if (!decryptedData) return undefined;
    return decryptedData.RawData[track]?.["통계"]?.[grade];
  }, [track, grade, decryptedData]);

  // Derive and Filter University Preference Data
  const filteredUnivList = useMemo(() => {
    if (!decryptedData) return [];
    const rawList = decryptedData.RawData[track]?.[admissionType]?.[grade] || [];
    
    // Filter by search query
    const filtered = rawList.filter(([univName]) => 
      univName.toLowerCase().includes(actualSearch.trim().toLowerCase())
    );

    // Sort
    return [...filtered].sort((a, b) => {
      if (sortBy === "applications") {
        return b[1] - a[1];
      } else {
        if (b[3] !== a[3]) {
          return b[3] - a[3];
        }
        return b[1] - a[1];
      }
    });
  }, [track, admissionType, grade, actualSearch, sortBy, decryptedData]);

  // Derive and Filter Major Detail Data
  const filteredMajorList = useMemo(() => {
    if (!decryptedData) return [];
    const rawList = decryptedData.MajorPreferenceData[admissionType]?.[track]?.[grade] || [];

    // Filter by search query (university name or major name)
    const filtered = rawList.filter((item) => {
      const targetStr = `${item.university} ${item.major}`.toLowerCase();
      return targetStr.includes(actualSearch.trim().toLowerCase());
    });

    // Sort
    return [...filtered].sort((a, b) => {
      if (sortBy === "applications") {
        return b.applications - a.accepted;
      } else {
        if (b.rate !== a.rate) {
          return b.rate - a.rate;
        }
        return b.applications - a.applications;
      }
    });
  }, [admissionType, track, grade, actualSearch, sortBy, decryptedData]);

  const handleResetFilters = () => {
    setTrack("인문");
    setGrade("1.5~2.0");
    setAdmissionType("교과+종합");
    setActualSearch("");
    setSortBy("applications");
  };

  // 🔒 Render lock screen if not authenticated
  if (!decryptedData) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans">
        {/* Glow grid backdrops */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.15),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(30,58,138,0.3),transparent_60%)] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-slate-950/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative z-10"
        >
          <div className="flex flex-col items-center text-center space-y-5">
            {/* Animated Lock Icon */}
            <div className="h-16 w-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 relative">
              <Lock size={28} className="absolute" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
                <GraduationCap className="text-indigo-400 h-6 w-6" />
                성의고 수시 대입 결과 분석
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                본 대시보드는 실제 졸업생들의 민감한 대입 통계 자료를 포함하고 있어 **비밀번호 보호** 상태로 제공됩니다.
              </p>
            </div>

            <form onSubmit={handleDecrypt} className="w-full space-y-4 pt-2">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold text-slate-500 block pl-1">접속 비밀번호</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="비밀번호를 입력하세요..."
                  disabled={isDecrypting}
                  className="w-full bg-slate-900 border border-slate-800 text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all font-mono"
                />
              </div>

              <AnimatePresence mode="wait">
                {isError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xs text-rose-400 font-bold flex items-center justify-center gap-1.5 pl-1"
                  >
                    ❌ 올바르지 않은 비밀번호입니다.
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isDecrypting}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDecrypting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Unlock size={14} />
                    <span>데이터 분석 시작</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>

        <p className="text-[10px] text-slate-600 font-semibold mt-8 relative z-10">
          © 2026 성의고등학교 수시 지원전략 분석 연구소. All Rights Reserved.
        </p>
      </div>
    );
  }

  // 🔓 Authenticated: Render Main Dashboard View
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* TOP PREMIUM HEADER */}
      <header className="bg-slate-900 text-white relative overflow-hidden border-b border-slate-800" id="app-header">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.15),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(30,58,138,0.3),transparent_60%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold tracking-wider uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                  <Sparkles size={12} className="text-indigo-400 animate-pulse" />
                  2026학년도 수시 예측 가이드
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-slate-300 bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded-full">
                  성의고등학교 전용 솔루션 (보안 모드)
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <GraduationCap className="text-indigo-400 h-7 w-7 sm:h-8 sm:w-8" />
                성의고등학교 수시 대입 결과 분석 시스템
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                축적된 실제 선배들의 입시 데이터(내신 등급별 모집단위 및 전형 결과)를 통해, 수능 최저 미충족 여부와 상세 불합격 사유를 입체적으로 비교·분석합니다.
              </p>
            </div>
            
            <div className="hidden lg:flex items-center gap-3 bg-slate-800/80 border border-slate-700 rounded-2xl p-3.5 backdrop-blur-sm self-start md:self-auto">
              <div className="h-10 w-10 rounded-xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-mono font-bold text-sm">
                {grade}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200">현재 분석 필터 그룹</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {track}계열 · {admissionType} 전형
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* LEFT SIDEBAR: Sticky Filters Panel */}
          <aside className="lg:col-span-4 lg:sticky lg:top-6 space-y-6" id="sticky-filter-panel">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm sm:text-base">
                  <SlidersHorizontal size={18} className="text-indigo-600" />
                  맞춤형 대입 조건 설정
                </h2>
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  초기화
                </button>
              </div>

              {/* 1) 계열 선택 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 block">모집 계열군</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setTrack("인문")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      track === "인문"
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <BookOpen size={14} />
                    인문계열
                  </button>
                  <button
                    onClick={() => setTrack("자연")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      track === "자연"
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Atom size={14} />
                    자연/공학계열
                  </button>
                </div>
              </div>

              {/* 2) 내신 등급 구간 선택 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 block">성의고 내신 등급 구간</label>
                <div className="relative">
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                  >
                    {gradeIntervals.map((interval) => (
                      <option key={interval} value={interval} className="font-sans font-medium text-slate-800">
                        {interval} 등급 구간 ({interval === "8.0~9.0" ? "하위 전체" : "선택 분석"})
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                    <ChevronDown size={14} />
                  </div>
                </div>
              </div>

              {/* 3) 지원 전형 유형 선택 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 block">수시 모집 전형</label>
                <div className="relative">
                  <select
                    value={admissionType}
                    onChange={(e) => setAdmissionType(e.target.value as AdmissionType)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="교과+종합" className="font-semibold text-slate-800">전체 전형 (교과 + 종합 통합)</option>
                    <option value="교과" className="font-semibold text-slate-800">학생부교과 전형</option>
                    <option value="종합" className="font-semibold text-slate-800">학생부종합 전형</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                    <ChevronDown size={14} />
                  </div>
                </div>
              </div>

              {/* 4) 대학교 및 학과 검색창 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 block">대학 및 모집단위 검색</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <Search size={14} />
                  </span>
                  <input
                    type="text"
                    value={actualSearch}
                    onChange={(e) => setActualSearch(e.target.value)}
                    placeholder="대학명 또는 학과명 입력..."
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl pl-9 pr-8 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                  {actualSearch && (
                    <button
                      onClick={() => setActualSearch("")}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* 5) 정렬 기준 선택 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 block">데이터 정렬 기준</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
                  <button
                    onClick={() => setSortBy("applications")}
                    className={`py-1.5 px-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                      sortBy === "applications"
                        ? "bg-white text-indigo-600 shadow-sm border border-slate-200"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    지원 많은 순
                  </button>
                  <button
                    onClick={() => setSortBy("rate")}
                    className={`py-1.5 px-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                      sortBy === "rate"
                        ? "bg-white text-indigo-600 shadow-sm border border-slate-200"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    합격률 높은 순
                  </button>
                </div>
              </div>

            </div>

            {/* Quick Informational Tip Card */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 border border-slate-800 shadow-sm relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 pointer-events-none">
                <Compass size={140} />
              </div>
              <h4 className="text-xs font-extrabold text-indigo-300 tracking-wider uppercase mb-1.5 flex items-center gap-1">
                <TrendingUp size={12} />
                입시 전략 가이드
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                성의고등학교의 특정 등급구간 선배들은 해당 전형에서 수능 최저기준 통과 여부 및 최종 합격 배수가 합불에 중대한 영향을 미쳤습니다. 불합격 사유를 세밀히 살피어 수시 상향 및 안정 전략을 조합하십시오.
              </p>
            </div>
          </aside>

          {/* RIGHT MAIN WORKSPACE */}
          <section className="lg:col-span-8 space-y-6 sm:space-y-8">
            
            {/* A. Statistics Overview Panel */}
            <StatsPanelComponent grade={grade} statData={statData} />

            {/* Active Filters Summary Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-500">현재 조건:</span>
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 font-bold text-indigo-700">
                  {track}계열
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 font-bold text-indigo-700">
                  {grade} 등급 구간
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 font-bold text-indigo-700">
                  {admissionType} 전형
                </span>
                {actualSearch && (
                  <span className="px-2.5 py-0.5 rounded-md bg-rose-50 border border-rose-100 font-bold text-rose-700 flex items-center gap-1">
                    키워드: "{actualSearch}"
                    <button onClick={() => setActualSearch("")} className="hover:text-rose-900 font-extrabold cursor-pointer">×</button>
                  </span>
                )}
              </div>
              
              <div className="text-slate-400 font-semibold font-mono text-[11px]">
                검색 결과: 대학 {filteredUnivList.length}건 / 학과 {filteredMajorList.length}건
              </div>
            </div>

            {/* B. Preferred University Top 10 Card */}
            <UnivPreferenceTable list={filteredUnivList} />

            {/* C. Major Specific Outcome Breakdown Card */}
            <MajorDetailTable list={filteredMajorList} />

          </section>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-6" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-semibold">
          <div>
            © 2026 성의고등학교 수시 지원전략 분석 연구소. All Rights Reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-indigo-500">대입 실지원 통계 솔루션</span>
            <span>데이터 무단 수집 및 배포 금지</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
