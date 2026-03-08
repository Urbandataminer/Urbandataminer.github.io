export interface Dataset {
  id: string | number; // Internal unique ID (metadata.json uses numeric id)
  Data_Name: string; // Mapped from title
  Data_summary: string; // Mapped from summary
  
  // Filter Dimensions
  Category: string | null; // e.g. "Population census..." or null for unmapped categories
  Sub_Category: string | null; // e.g. "Detailed demographic breakdown" or null for unmapped sub-categories
  Time_Coverage: string; // e.g. "2010-2020", "N/A"
  year_start?: number | null;
  year_end?: number | null;
  year_bucket?: string; // e.g., "2010s", "2020s", "Unknown"
  country?: string; // e.g., "China", "Global", "Multi", "Unknown"
  
  // Additional Metadata
  Geographic_Coverage: string;
  Other_Information: string;
  URL: string;
  Need_Author_Contact?: boolean | null;
  
  // References
  ref: string[];
  paper_url: string;

  // Allow backend to add extra metadata fields without breaking the UI.
  [key: string]: any;
}

export interface FilterCounts {
  [key: string]: number;
}

export enum Sender {
  USER = 'user',
  BOT = 'bot'
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: Date;
}
