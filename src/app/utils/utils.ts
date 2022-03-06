import { SortOption } from "../interfaces/sort.interface";

export const SortListCountries = (sortData: SortData) => {
  for (var i = 0; i < sortData.option.length; i++) {
    switch (sortData.option[i].name) {
      case "TotalConfirmedCases":
        if (sortData.option[i].type === "asc") {
          sortData.data.sort(
            (a: any, b: any) => a.TotalConfirmed - b.TotalConfirmed
          );
        }else
        {
          sortData.data.sort(
            (a: any, b: any) => b.TotalConfirmed - a.TotalConfirmed
          );
        }
        break;
      case "NumberOfDeaths":
        if (sortData.option[i].type === "asc") {
          sortData.data.sort((a: any, b: any) => a.TotalDeaths - b.TotalDeaths);
        }else
        {
          sortData.data.sort((a: any, b: any) => b.TotalDeaths - a.TotalDeaths);
        }
        break;
      case "NumberOfRecoveredCases":
        if (sortData.option[i].type === "asc") {
          sortData.data.sort(
            (a: any, b: any) => a.TotalRecovered - b.TotalRecovered
          );
        }else
        {
          sortData.data.sort(
            (a: any, b: any) => b.TotalRecovered - a.TotalRecovered
          );
        }
        break;
      default:
    }
  }
  return sortData.data;
};

interface SortData {
  option: SortOption[];
  data: object[];
}