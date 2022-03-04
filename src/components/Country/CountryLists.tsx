import { useEffect, useState } from "react";
import {
  fetchListCountriesAsync,
  countrySelectors,
  setBookmarkFromState,
} from "../../redux/Slice/CountrySilce";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { SortOption } from "../../app/interfaces/sort.interface";
import "./CountryStyle.scss";
export default function CountryLists(props: any) {
  const countries = useAppSelector(countrySelectors.selectAll);
  const dispatch = useAppDispatch();
  const { listLoaded, status } = useAppSelector((state) => state.countries);
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

  const setBookmark = (countryCode: string) => {
    let countryBookmark = localStorage.getItem("country") || "[]";
    let arr = JSON.parse(countryBookmark);
    arr.push(countryCode);
    localStorage.setItem("country", JSON.stringify(arr));
    dispatch(setBookmarkFromState(countryCode));
  };
  const removeBookmark = (countryCode: string) => {
    let countryBookmark = localStorage.getItem("country") || "[]";
    let arr = JSON.parse(countryBookmark);
    let index = arr.indexOf(countryCode);
    if (index > -1) {
      arr.splice(index, 1);
    }
    localStorage.setItem("country", JSON.stringify(arr));
    dispatch(setBookmarkFromState(countryCode));
  };
  //update pagination data
  const setPagination = (value: number) => {
    if (value > 0) {
      setCurrentPagination(value);
      setTableStartIndex(10 * (value - 1));
      setTableEndIndex(10 * value);
    }
  };

  //create element pagination
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
            <a
              href="#"
              className="active"
              onClick={() => setPagination(index)}
              key={"pg-" + index}
            >
              {index}
            </a>
          );
        } else {
          elements.push(
            <a
              href="#"
              onClick={() => setPagination(index)}
              key={"pg-" + index}
            >
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
            <th>Options</th>
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
                  <tr className="table-row" key={item.ID}>
                    <td
                      className="row__country"
                      onClick={() =>
                        props.openPopup(item.CountryCode, item.Slug)
                      }
                    >
                      {item.Country}{" "}
                      {item.IsBookmark ? (
                        <i className="fas fa-star"></i>
                      ) : null}
                    </td>
                    <td className="row__totalConfirmed">
                      {item.TotalConfirmed.toLocaleString()}
                    </td>
                    <td className="row__totalDeaths">
                      {item.TotalDeaths.toLocaleString()}
                    </td>
                    <td className="row__totalRecovered">
                      {item.TotalRecovered.toLocaleString()}
                    </td>
                    <td className="row__options">
                      <span>
                        {!item.IsBookmark ? (
                          <i
                            className="far fa-bookmark"
                            onClick={() => setBookmark(item.CountryCode)}
                          ></i>
                        ) : (
                          <i
                            className="fas fa-bookmark"
                            onClick={() => removeBookmark(item.CountryCode)}
                          ></i>
                        )}
                      </span>
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

interface props {
  openPopup: any;
}
