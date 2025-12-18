import { Dataset } from '../types';

export const MOCK_DATASETS: Dataset[] = [
    {
        id: "d1",
        Data_Name: "Academic performance and retention data of first-year business students",
        Data_summary: "This dataset contains the academic performance and retention records of first-year students at a large European business school, including the number of ECTS credits earned and retention rates. It includes data from a post-intervention cohort (N=703) and three pre-intervention control cohorts (N=896, 825, and 720). The dataset is used to compare the effects of a goal-setting intervention on academic achievement and retention, particularly focusing on gender and ethnicity gaps.",
        Category: "Population census and household surveys",
        Sub_Category: "Education & Academic Records",
        Other_Information: "Evidence: 'The study made use of existing data derived from a larger data-gathering effort...'; Location: Methods; Confidence: high",
        Time_Coverage: "N/A",
        Geographic_Coverage: "Netherlands",
        URL: "N/A",
        ref: ["ref-CR63", "ref-CR29", "ref-CR1"],
        article_id: "art-001"
    },
    {
        id: "d2",
        Data_Name: "Beijing Food Safety Incidents 2004-2013",
        Data_summary: "A volunteer-maintained database of food safety incidents in China, covering reports from 2001 onwards. It includes over 3,000 incidents nationwide by 2013, with a focus on incidents caused by human factors. The dataset was used to analyze 295 food safety incidents in Beijing between 2004 and 2013.",
        Category: "Human Behavior Data",
        Sub_Category: "Public Health & Safety",
        Other_Information: "Data preprocessed to remove irrelevant entries.",
        Time_Coverage: "2004-2013",
        Geographic_Coverage: "China (Beijing)",
        URL: "N/A",
        ref: ["ref-CR12"],
        article_id: "art-002"
    },
    {
        id: "d3",
        Data_Name: "Global Nighttime Lights 2012-2020",
        Data_summary: "Annual cloud-free composite of nighttime light brightness values from the VIIRS instrument. Used to analyze urban growth laws, allometric scaling, and fractal geometry of natural cities.",
        Category: "Multimodal Sensing Data",
        Sub_Category: "Satellite Imagery",
        Other_Information: "Resolution: 15 arc-seconds.",
        Time_Coverage: "2012-2020",
        Geographic_Coverage: "Global",
        URL: "http://ngdc.noaa.gov/eog/viirs/download_dnb_composites.html",
        ref: ["ref-CR45", "ref-CR46"],
        article_id: "art-003"
    },
    {
        id: "d4",
        Data_Name: "NYC Taxi Trip Data 2015",
        Data_summary: "Detailed trip records from both yellow and green taxis in New York City, including pick-up and drop-off times, locations, trip distances, itemized fares, rate types, payment types, and driver-reported passenger counts.",
        Category: "Human Behavior Data",
        Sub_Category: "Mobility & Transportation",
        Other_Information: "Source: NYC Taxi and Limousine Commission (TLC).",
        Time_Coverage: "2015",
        Geographic_Coverage: "USA (New York City)",
        URL: "https://www1.nyc.gov/site/tlc/about/tlc-trip-record-data.page",
        ref: ["ref-CR88"],
        article_id: "art-004"
    },
    {
        id: "d5",
        Data_Name: "European City Air Quality Measurements",
        Data_summary: "Aggregated PM2.5 and NO2 readings from sensor networks in 50 major European cities. Used for urban health impact assessments.",
        Category: "Multimodal Sensing Data",
        Sub_Category: "Environmental Sensors",
        Other_Information: "Hourly averages.",
        Time_Coverage: "2018-2022",
        Geographic_Coverage: "Europe",
        URL: "N/A",
        ref: ["ref-CR99"],
        article_id: "art-005"
    },
    {
        id: "d6",
        Data_Name: "London Housing Price Index",
        Data_summary: "Monthly house price index for all London boroughs, split by property type (detached, semi-detached, terraced, flat).",
        Category: "Statical Infrastructure Data",
        Sub_Category: "Real Estate & Housing",
        Other_Information: "Source: UK Land Registry.",
        Time_Coverage: "1995-2023",
        Geographic_Coverage: "UK (London)",
        URL: "https://landregistry.data.gov.uk/",
        ref: ["ref-CR101"],
        article_id: "art-006"
    }
];
