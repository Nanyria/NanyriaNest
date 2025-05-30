export interface InfoCardField {
  title: string;
  value: string | any[]; // <-- allow arrays
}

export interface InfoCardRowPair {
  first?: InfoCardField;
  second?: InfoCardField;
}

export interface InfoCardColumn2 {
  rows?: InfoCardField[]; // For normal fields with titles
  longText?: InfoCardField; // For long field with title
  rowPairs?: InfoCardRowPair[]; // For pairs of short fields with titles
}

export interface InfoCardColumn3 {
  rows?: InfoCardField[]; // For normal fields with titles
}
export interface InfoCardDisplayRow {
  label?: string;
  value: string;
  isBreak?: boolean;
}