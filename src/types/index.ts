export interface Variable {
  id: string;
  name: string;
}

export interface Firm {
  id: string;
  name: string;
  color: string;
}

export interface MapRating {
  firmId: string;
  x: number | null;
  y: number | null;
}

export interface StrategicMap {
  id: string;
  name: string;
  xVariableId: string;
  yVariableId: string;
  ratings: MapRating[];
}
