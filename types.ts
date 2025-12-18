export interface Dataset {
  id: string; // Internal unique ID (can be article_id + index)
  Data_Name: string; // Mapped from title
  Data_summary: string; // Mapped from summary
  
  // Filter Dimensions
  Category: string; // e.g. "Population census..."
  Sub_Category: string; // e.g. "Detailed demographic breakdown"
  Time_Coverage: string; // e.g. "2010-2020", "N/A"
  
  // Additional Metadata
  Geographic_Coverage: string;
  Other_Information: string;
  URL: string;
  
  // References
  ref: string[];
  article_id: string;
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
