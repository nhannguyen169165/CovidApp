export interface Country {
    ID: string,
    Country: string,
    CountryCode: string,
    Slug: string,
    NewConfirmed: number,
    TotalConfirmed: number,
    NewDeaths: number,
    TotalDeaths: number,
    NewRecovered: number,
    TotalRecovered: number,
    Date: string,
    Premium: object
}

export interface CountryDetailData {
    Name:string;
    Capital:string;
    Population:number;
    Region:string;
    SubRegion:string;
    Flag:string;
}

export interface CountryChart {
    ID: string,
    Confirmed: string,
    Deaths: string,
    Recovered: string,
    Active: number,
    Date:string
}