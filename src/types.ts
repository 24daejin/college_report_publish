export type TrackType = "인문" | "자연";

export type AdmissionType = "교과+종합" | "교과" | "종합";

export type SortType = "applications" | "rate";

export interface GradeStat {
  gyo: [number, number, number]; // [지원, 합격, 합격률]
  jong: [number, number, number];
  non: [number, number, number];
  sil: [number, number, number];
}

export type UniversityRecord = [string, number, number, number]; // [대학명, 지원, 합격, 합격률]

export interface MajorRecord {
  university: string;
  major: string;
  applications: number;
  accepted: number;
  rate: number;
  fail_1st: number;
  fail_min: number;
  fail_final: number;
  fail_miss: number;
}

export interface TrackData {
  통계: Record<string, GradeStat>;
  "교과+종합": Record<string, UniversityRecord[]>;
  교과: Record<string, UniversityRecord[]>;
  종합: Record<string, UniversityRecord[]>;
}

export type RawDataType = Record<TrackType, TrackData>;

export type MajorPreferenceDataType = Record<
  AdmissionType,
  Record<TrackType, Record<string, MajorRecord[]>>
>;

export const gradeIntervals = [
  "1.0~1.5",
  "1.5~2.0",
  "2.0~2.5",
  "2.5~3.0",
  "3.0~3.5",
  "3.5~4.0",
  "4.0~4.5",
  "4.5~5.0",
  "5.0~5.5",
  "5.5~6.0",
  "6.0~6.5",
  "6.5~7.0",
  "7.0~7.5",
  "7.5~8.0",
  "8.0~9.0"
];

