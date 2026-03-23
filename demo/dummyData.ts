/**
 * Dummy patient rows for demo when no backend is available.
 * Keys match servlet response dataRoot so fetch mock can return them.
 * Generates 200 rows for stress-testing grids and sort/filter.
 */
import type {
  ActiveTeamPatientRecord,
  GopcPatientRecord,
  MoInChargePatientRecord,
  NormalPatientRecord,
  OpPatientRecord,
  UncodedPatientRecord,
} from './types/patient-record';

const ROW_COUNT = 200;

const FAMILY_NAMES = ['Chan', 'Wong', 'Lee', 'Cheung', 'Ng', 'Lam', 'Ho', 'Tsang', 'Chow', 'Leung'];
const GIVEN_NAMES = [
  'Tai Man', 'Siu Ming', 'Mei Ling', 'Kwok Keung', 'Wai Yan', 'Ka Fai', 'Yuk Ling', 'Tin Lok',
  'Hoi Yan', 'Chun Kit', 'Lai Shan', 'Wing Sum', 'Ka Ho', 'Sze Man', 'Lap Kei', 'Man Chi',
  'Hoi Lam', 'Tsz Ching', 'Lok Yiu', 'Ching Yi',
];
const CHI_NAMES = [
  '陳大文', '黃小明', '李美玲', '張國強', '吳惠欣', '林嘉輝', '何玉玲', '曾天樂',
  '周海欣', '梁俊傑', '朱麗珊', '鄭詠心', '何家豪', '謝思敏', '葉立基', '鄧文志',
  '馮凱琳', '羅芷晴', '黎樂瑤', '關靜怡',
];
const WARDS = ['A01', 'A02', 'B01', 'B02', 'C01', 'C02', 'D01', 'D02', 'E01', 'E02'];
const SPECS = ['MED', 'SUR', 'PAED', 'GYNE', 'ORTH', 'CARD', 'NEUR', 'PSY', 'EM', 'ICU'];
const SOURCES = ['QMH', 'QEH', 'PMH', 'KWH', 'NDH', 'PYNEH', 'TMH', 'UCH'];

function pad(n: number, width: number): string {
  return String(n).padStart(width, '0');
}

function generateBaseRows(): NormalPatientRecord[] {
  const rows: NormalPatientRecord[] = [];
  for (let i = 1; i <= ROW_COUNT; i++) {
    const fi = (i - 1) % FAMILY_NAMES.length;
    const gi = (i - 1) % GIVEN_NAMES.length;
    const ci = (i - 1) % CHI_NAMES.length;
    const wi = (i - 1) % WARDS.length;
    const si = (i - 1) % SPECS.length;
    const sri = (i - 1) % SOURCES.length;
    const ward = WARDS[wi];
    const bed = String((i % 12) + 1);
    const day = (i % 28) + 1;
    const month = (i % 12) + 1;
    const hour = (i % 24);
    const min = (i % 60);
    const dateStr = `${pad(day, 2)}-${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][month - 1]}-2024`;
    const timeStr = `${pad(hour, 2)}:${pad(min, 2)}`;
    const admissionDtm = `${dateStr} ${timeStr}`;
    const sex = i % 2 === 0 ? 'M' : 'F';
    const age = 20 + (i % 60);
    rows.push({
      id: String(i),
      wardCode: ward,
      bed,
      name: `${FAMILY_NAMES[fi]} ${GIVEN_NAMES[gi]}`,
      chineseName: CHI_NAMES[ci],
      caseNo: `EP${pad(i, 6)}`,
      specCode: SPECS[si],
      admissionDtm,
      sex,
      age,
      sexAge: `${sex}/${age}`,
      sourceCode: SOURCES[sri],
      hkid: `${String.fromCharCode(65 + (i % 26))}${pad(123456 + i, 6)}(${(i % 10)})`,
      mrn: `MRN${pad(i, 6)}`,
    });
  }
  return rows;
}

const MO_NAMES = ['Dr. Smith', 'Dr. Wong', 'Dr. Lee', 'Dr. Chan', 'Dr. Ng', 'Dr. Lam', 'Dr. Ho', 'Dr. Tsang'];
const TEAMS = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8'];

const baseRows = generateBaseRows();

export const cpiPatList: NormalPatientRecord[] = baseRows;

const cpiUnCodePatList: UncodedPatientRecord[] = baseRows.map((r, i) => ({
  ...r,
  dischargeDtm: i % 3 === 0 ? `15-Jan-2024 10:00` : undefined,
}));

const moPatList: MoInChargePatientRecord[] = baseRows.map((r, i) => ({
  ...r,
  moic: MO_NAMES[i % MO_NAMES.length],
}));

const cpiAbsPatList: NormalPatientRecord[] = baseRows;

const cpiUserGrpPatList: NormalPatientRecord[] = baseRows;

const cpiActiveMoPatList: NormalPatientRecord[] = baseRows;

const cpiActiveTeamPatList: ActiveTeamPatientRecord[] = baseRows.map((r, i) => ({
  ...r,
  wardCode2Disp: r.wardCode,
  teamCode: TEAMS[i % TEAMS.length],
  specIC: MO_NAMES[i % MO_NAMES.length],
}));

function generateGopcRows(): GopcPatientRecord[] {
  const rows: GopcPatientRecord[] = [];
  const priorities = ['P1', 'P2', 'P3'];
  const apptTypes = ['FO', 'FU', 'OP'];
  const attendStatuses = ['Attended', 'Pending', 'DNA', 'Cancelled'];
  const subSpecs = ['GEN', 'PAED', 'ORTH', 'DERM'];
  for (let i = 1; i <= ROW_COUNT; i++) {
    const fi = (i - 1) % FAMILY_NAMES.length;
    const gi = (i - 1) % GIVEN_NAMES.length;
    const ci = (i - 1) % CHI_NAMES.length;
    const day = (i % 28) + 1;
    const slot = 8 + (i % 10);
    const min = (i % 4) * 15;
    const dateStr = `${pad(day, 2)}-Jan-2024`;
    const slotDatetime = `${dateStr} ${pad(slot, 2)}:${pad(min, 2)}`;
    const sex = i % 2 === 0 ? 'M' : 'F';
    const age = 20 + (i % 60);
    rows.push({
      id: `g${i}`,
      name: `${FAMILY_NAMES[fi]} ${GIVEN_NAMES[gi]}`,
      chineseName: CHI_NAMES[ci],
      sex,
      age,
      slotDatetime,
      priority: priorities[i % 3],
      priorityValue: (i % 3) + 1,
      assmt: i % 2 === 0 ? 'Y' : 'N',
      consult: i % 3 === 0 ? 'Y' : 'N',
      apptType: apptTypes[i % 3],
      attendStatus: attendStatuses[i % 4],
      attendTime: i % 2 === 0 ? `${pad(9 + (i % 10), 2)}:${pad(i % 60, 2)}` : undefined,
      episode: `EP${pad(100 + i, 5)}`,
      bookDatetime: `${pad((i % 28) + 1, 2)}-Jan-2024`,
      subSpec: subSpecs[i % 4],
      sexAge: `${sex}/${age}`,
      hkid: `${String.fromCharCode(65 + (i % 26))}${pad(123456 + i, 6)}(${(i % 10)})`,
      mrn: `MRN${pad(i, 6)}`,
    });
  }
  return rows;
}

const gopcBase = generateGopcRows();

const msGopcPatList: GopcPatientRecord[] = gopcBase;

const gopcPatList: GopcPatientRecord[] = gopcBase;

const opPatList: OpPatientRecord[] = gopcBase.map((r, i) => ({
  ...r,
  type: i % 2 === 0 ? 'New' : 'FU',
  prIndicator: i % 5 === 0 ? 'Y' : 'N',
}));

const DATA_ROOT_TO_ROWS: Record<string, unknown[]> = {
  cpiPatList,
  cpiUnCodePatList,
  moPatList,
  cpiAbsPatList,
  cpiUserGrpPatList,
  cpiActiveMoPatList,
  cpiActiveTeamPatList,
  msGopcPatList,
  gopcPatList,
  opPatList,
};

export function getDummyPayload(dataRoot: string): Record<string, unknown> {
  const rows = DATA_ROOT_TO_ROWS[dataRoot] ?? [];
  return { [dataRoot]: rows };
}
