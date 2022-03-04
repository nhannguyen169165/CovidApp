import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import api from "../../app/api/api";
import { Country } from "../../app/interfaces/country.interface";
import {
  CountryDetailData,
  CountryChart,
} from "../../app/interfaces/country.interface";
import { RootState } from "../../app/store/configureStore";
import { SortListCountries } from "../../app/utils/utils";
import { SortOption } from "../../app/interfaces/sort.interface";
import moment from "moment";

//Country lists
export const countriesAdapter = createEntityAdapter<Country>({
  selectId: (country: Country) => country.ID,
});

export const fetchListCountriesAsync = createAsyncThunk<
  Country[],
  { sortOption: SortOption[] }
>("country/fetchListCountriesAsync", async ({ sortOption }, thunkAPI) => {
  try {
    return await api.Country.list().then((response) => {
      let data = response.Countries;
      for (var i = 0; i < sortOption.length; i++) {
        data = SortListCountries({ option: sortOption, data });
      }
      console.log(data);
      return data;
    });
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const countrySlice = createSlice({
  name: "countries",
  initialState: countriesAdapter.getInitialState({
    listLoaded: false,
    status: "idle",
    countries: new Array() as Array<Country>,
  }),
  reducers: {
    setBookmarkFromState: (state, action) => {
      let country = state.countries;
      let index = country.findIndex(
        (element) => element.CountryCode === action.payload
      );
      if (index > -1) {
        country[index].IsBookmark = !country[index].IsBookmark;
      }
      countriesAdapter.setAll(state, country);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchListCountriesAsync.pending, (state) => {
      state.status = "pendingFetchCountries";
    });
    builder.addCase(fetchListCountriesAsync.fulfilled, (state, action) => {
      let countryBookmark = localStorage.getItem("country") || "[]";
      let arr = JSON.parse(countryBookmark);
      for (var i = 0; i < action.payload.length; i++) {
        let index = arr.indexOf(action.payload[i].CountryCode);
        if (index > -1) {
          action.payload[i].IsBookmark = true;
        } else {
          action.payload[i].IsBookmark = false;
        }
      }
      countriesAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.listLoaded = true;
      state.countries = action.payload;
    });
    builder.addCase(fetchListCountriesAsync.rejected, (state, action) => {
      state.status = "idle";
    });
  },
});
export const { setBookmarkFromState } = countrySlice.actions;
export const countrySelectors = countriesAdapter.getSelectors(
  (state: RootState) => state.countries
);

//Country detail
export const countryDetailAdapter = createEntityAdapter<CountryDetailData>({
  selectId: (country: CountryDetailData) => country.Name,
});

export const fetchCountryDetailAsync = createAsyncThunk<
  CountryDetailData,
  { countryCode: string }
>("country/fetchCountryDetailAsync", async ({ countryCode }, thunkAPI) => {
  try {
    return await api.Country.detail(countryCode).then((response) => {
      let data: CountryDetailData = {
        Name: response[0].name.official,
        Capital: response[0].capital,
        Population: response[0].population,
        Region: response[0].region,
        SubRegion: response[0].subregion,
        Flag: response[0].flags.png,
      };
      return data;
    });
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const countryDetailSlice = createSlice({
  name: "countryDetail",
  initialState: countryDetailAdapter.getInitialState({
    dataLoaded: false,
    status: "idle",
  }),
  reducers: {
    resetDataLoaded: (state) => {
      state.dataLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCountryDetailAsync.pending, (state) => {
      state.status = "pendingFetchCountry";
    });
    builder.addCase(fetchCountryDetailAsync.fulfilled, (state, action) => {
      countryDetailAdapter.removeAll(state);
      countryDetailAdapter.setOne(state, action.payload);
      state.status = "idle";
      state.dataLoaded = true;
    });
    builder.addCase(fetchListCountriesAsync.rejected, (state, action) => {
      state.status = "idle";
    });
  },
});

export const countryDetailSelectors = countryDetailAdapter.getSelectors(
  (state: RootState) => state.countryDetail
);

export const { resetDataLoaded } = countryDetailSlice.actions;

//country chart

export const countryChartAdapter = createEntityAdapter<CountryChart>({
  selectId: (country: CountryChart) => country.ID,
});

export const fetchCountryChartAsync = createAsyncThunk<
  CountryChart[],
  { slug: string }
>("country/fetchCountryChartAsync", async ({ slug }, thunkAPI) => {
  try {
    const to =
      moment(new Date(new Date().setDate(new Date().getDate() - 1))).format(
        "YYYY-MM-DD"
      ) + "T00:00:00Z";
    const from =
      moment(new Date(new Date().setDate(new Date().getDate() - 30))).format(
        "YYYY-MM-DD"
      ) + "T00:00:00Z";
    return await api.Country.chart(slug, from, to).then((response) => {
      const data: CountryChart[] = [];
      console.log(response);
      for (var i = 0; i < response.length; i++) {
        data.push({
          ID: "ID-" + i + response[i].Country,
          Confirmed: response[i].Confirmed,
          Deaths: response[i].Deaths,
          Recovered: response[i].Recovered,
          Active: response[i].Active,
          Date: moment(response[i].Date).format("YYYY-MM-DD"),
        });
      }
      console.log(data);
      return data;
    });
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const countryChartSlice = createSlice({
  name: "countryChart",
  initialState: countryChartAdapter.getInitialState({
    dataLoaded: false,
    status: "idle",
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCountryChartAsync.pending, (state) => {
      state.status = "pendingFetchCountryChart";
    });
    builder.addCase(fetchCountryChartAsync.fulfilled, (state, action) => {
      countryChartAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.dataLoaded = true;
    });
    builder.addCase(fetchCountryChartAsync.rejected, (state, action) => {
      state.status = "idle";
    });
  },
});

export const countryChartSelectors = countryChartAdapter.getSelectors(
  (state: RootState) => state.countryChart
);
