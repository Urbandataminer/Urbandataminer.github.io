export interface Dataset {
  id: string; // Internal unique ID
  Data_Name: string; // Mapped from title
  Data_summary: string; // Mapped from summary
  
  // Filter Dimensions
  Category: string | null; // e.g. "Population census..." or null for unmapped categories
  Sub_Category: string | null; // e.g. "Detailed demographic breakdown" or null for unmapped sub-categories
  Time_Coverage: string; // e.g. "2010-2020", "N/A"
  
  // Additional Metadata
  Geographic_Coverage: string;
  Other_Information: string;
  URL: string;
  
  // References
  ref: string[];
  paper_url: string;
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
