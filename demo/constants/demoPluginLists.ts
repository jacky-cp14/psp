/**
 * Sample plugin list rows for the global store — matches legacy PSP context menu labels.
 * `id` values map to demo nav list ids in `App.tsx` where applicable.
 */
export const DEMO_PLUGIN_LISTS: ReadonlyArray<{ id: string; label: string }> = [
  { id: "normal", label: "Normal Pat. List" },
  { id: "normal-eight", label: "Normal Pat. List (8 cols)" },
  { id: "uncoded", label: "Uncoded Pat. List" },
  { id: "ms-gopc", label: "MS GOPC Pat. List" },
  { id: "mo-incharge", label: "Pat. List /w MO in-charge" },
  { id: "op-appt", label: "OP Appt. Pat. List" },
  { id: "user-group", label: "Pat. List by User Group" },
  { id: "absent", label: "Absent Pat. List" },
  { id: "gopc-appt", label: "GOPC Appt. Pat. List" },
  { id: "active-mo", label: "Active Pat. List by MO/Specialist" },
  { id: "active-team", label: "Active Pat. List by Team" },
  { id: "perf", label: "Perf Lab" },
];

/** Maps `DEMO_PLUGIN_LISTS` id → `App` nav list id (`LISTS[].id`). */
export const DEMO_PLUGIN_ID_TO_LIST_ID: Record<string, number> = {
  normal: 0,
  "normal-eight": 11,
  uncoded: 1,
  "ms-gopc": 2,
  "mo-incharge": 3,
  "op-appt": 4,
  "user-group": 5,
  absent: 6,
  "gopc-appt": 7,
  "active-mo": 8,
  "active-team": 9,
  perf: 10,
};
