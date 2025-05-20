export type OverpassElement = {
    id: number;
    lat: number;
    lon: number;
    tags?: Record<string, string>;
  };

export type OverpassResponse = {
    elements: OverpassElement[];
  };