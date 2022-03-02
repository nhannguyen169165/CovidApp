import CountryLists from "../../components/Country/CountryLists";
import "./HomeStyle.scss";
export default function HomeScreen() {
  return (
    <div className="home-container">
      <div>
        <p>Coronavirus (COVID-19) Dashboard</p>
      </div>
      <CountryLists />
    </div>
  );
}
