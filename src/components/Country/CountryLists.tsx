import { useEffect, useState } from "react";
import {
  fetchListCountriesAsync,
  countrySelectors,
} from "../../redux/Slice/CountrySilce";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { SortOption } from "../../app/interfaces/sort.interface";
import "./CountryStyle.scss";

export default function CountryLists(props: any) {
  const countries = useAppSelector(countrySelectors.selectAll);
  const dispatch = useAppDispatch();
  const { listLoaded, status } = useAppSelector((state) => state.country);
  const [sortOptionData, setSortOptionData] = useState<SortOption[]>([
    {
      name: "TotalConfirmedCases",
      type: "desc",
    },
    {
      name: "NumberOfDeaths",
      type: "desc",
    },
    {
      name: "NumberOfRecoveredCases",
      type: "asc",
    },
  ]);

  const [tableStartIndex, setTableStartIndex] = useState(0);
  const [tableEndIndex, setTableEndIndex] = useState(10);
  const [currentPagination, setCurrentPagination] = useState(1);
  useEffect(() => {
    if (!listLoaded) {
      dispatch(fetchListCountriesAsync({ sortOption: sortOptionData }));
    }
  }, [listLoaded, dispatch]);

  //update pagination data
  const setPagination = (value: number) => {
    if (value > 0) {
      setCurrentPagination(value);
      setTableStartIndex(10 * (value - 1));
      setTableEndIndex(10 * value);
    }
  };

  //create element pagination number
  const paginationElements = () => {
    let elements = [];
    if (countries.length > 0) {
      for (
        let i = Math.floor((currentPagination - 1) / 4) * 4;
        i <=
        Math.floor(countries.length / 10) -
          (Math.floor(countries.length / 10) -
            (Math.floor((currentPagination - 1) / 4) + 1) * 4);
        i++
      ) {
        if (i > Math.floor(countries.length / 10)) {
          continue;
        }
        let index = i + 1;
        if (currentPagination === index) {
          elements.push(
            <a href="#" className="active" onClick={() => setPagination(index)}>
              {index}
            </a>
          );
        } else {
          elements.push(
            <a href="#" onClick={() => setPagination(index)}>
              {index}
            </a>
          );
        }
      }
    }
    return elements;
  };

  return (
    <div className="container__listCountries">
      <table>
        <thead>
          <tr>
            <th>Country</th>
            <th>Total Confirmed</th>
            <th>Total Deaths</th>
            <th>Total Recovered</th>
          </tr>
        </thead>
        <tbody>
          {countries.length === 0
            ? null
            : countries
                .filter(
                  (element, index) =>
                    index >= tableStartIndex && index <= tableEndIndex
                )
                .map((item, index) => (
                  <tr className="table-row">
                    <td className="row__country">{item.Country}</td>
                    <td className="row__totalConfirmed">
                      {item.TotalConfirmed}
                    </td>
                    <td className="row__totalDeaths">{item.TotalDeaths}</td>
                    <td className="row__totalRecovered">
                      {item.TotalRecovered}
                    </td>
                  </tr>
                ))}
        </tbody>
      </table>
      <div className="pagination">
        {currentPagination === 1 || countries.length === 0 ? null : (
          <a href="#" onClick={() => setPagination(currentPagination - 1)}>
            &laquo;
          </a>
        )}
        {paginationElements()}
        {currentPagination > Math.floor(countries.length / 10) ||
        countries.length === 0 ? null : (
          <a href="#" onClick={() => setPagination(currentPagination + 1)}>
            &raquo;
          </a>
        )}
      </div>
    </div>
  );
}
