import { useState, useEffect } from "react";
import CountryLists from "../../components/Country/CountryLists";
import Modal from "../../components/Common/Modal/Modal";
import {
  fetchCountryDetailAsync,
  fetchCountryChartAsync,
  countryDetailSelectors,
  countryChartSelectors,
  resetDataLoaded,
} from "../../redux/Slice/CountrySilce";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import "./HomeStyle.scss";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";

export default function HomeScreen() {
  const [isOpenModal, setOpenModal] = useState(false);
  const countryDetailData = useAppSelector(countryDetailSelectors.selectAll);
  const countryChartData = useAppSelector(countryChartSelectors.selectAll);
  const { dataLoaded, status } = useAppSelector((state) => state.countryDetail);
  const dispatch = useAppDispatch();
  const openPopup = (countryCode: string, slug: string) => {
    dispatch(fetchCountryDetailAsync({ countryCode: countryCode }));
    dispatch(fetchCountryChartAsync({ slug: slug }));
  };
  const closePopup = () => {
    dispatch(resetDataLoaded());
    setOpenModal(false);
  };

  useEffect(() => {
    if (dataLoaded) {
      setOpenModal(true);
    }
  }, [dataLoaded, dispatch]);

  const renderLineChart = (
    <ResponsiveContainer width="90%" height={400}>
      <AreaChart
        width={600}
        height={400}
        data={countryChartData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorConfirmed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F97D25" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#F97D25" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorDeaths" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#D01330" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#D01330" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorRecovered" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0F9153" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#0F9153" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="Date"/>
        <YAxis width={150} />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="Confirmed"
          stroke="#F97D25"
          fillOpacity={1}
          fill="url(#colorConfirmed)"
        />
            <Area
          type="monotone"
          dataKey="Deaths"
          stroke="#D01330"
          fillOpacity={1}
          fill="url(#colorDeaths)"
        />
            <Area
          type="monotone"
          dataKey="Recovered"
          stroke="#0F9153"
          fillOpacity={1}
          fill="url(#colorRecovered)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  const modalContent = () => {
    return (
      <>
        {dataLoaded ? (
          <>
            <div className="modal-content__title">
              <div className="modal-content__title__countryFlag">
                <img src={countryDetailData[0].Flag} />
              </div>
              <div className="modal-content__title__countryName">
                <span>{countryDetailData[0].Name}</span>
              </div>
            </div>
            <div className="modal-content__info">
              <div className="modal-content__info__label">
                <span>Region :</span>
              </div>
              <div className="modal-content__info__val">
                <span> {countryDetailData[0].Region} </span>
              </div>
            </div>
            <div className="modal-content__info">
              <div className="modal-content__info__label">
                <span>Sub Region :</span>
              </div>
              <div className="modal-content__info__val">
                <span> {countryDetailData[0].SubRegion} </span>
              </div>
            </div>
            <div className="modal-content__info">
              <div className="modal-content__info__label">
                <span>Capital :</span>
              </div>
              <div className="modal-content__info__val">
                <span> {countryDetailData[0].Capital} </span>
              </div>
            </div>
            <div className="modal-content__info">
              <div className="modal-content__info__label">
                <span>Population :</span>
              </div>
              <div className="modal-content__info__val">
                <span>{countryDetailData[0].Population.toLocaleString()} </span>
              </div>
            </div>

            <div className="modal-content__title__chart">
              Covid stats for the past month
            </div>
            <div className="modal-content__chart">{renderLineChart}</div>
          </>
        ) : null}
      </>
    );
  };

  return (
    <div className="home-container">
      <div>
        <p>Coronavirus (COVID-19) Dashboard</p>
      </div>
      <CountryLists openPopup={openPopup} />
      <Modal isVisible={isOpenModal} closePopup={closePopup}>
        {modalContent()}
      </Modal>
    </div>
  );
}
