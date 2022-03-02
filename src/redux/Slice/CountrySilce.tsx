import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import api from "../../app/api/api";
import { Country } from "../../app/interfaces/country.interface";
import { RootState } from "../../app/store/configureStore";
import { SortListCountries } from "../../app/utils/utils";
import { SortOption } from "../../app/interfaces/sort.interface";
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
      return data;
    });
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const countrySlice = createSlice({
  name: "country",
  initialState: countriesAdapter.getInitialState({
    listLoaded: false,
    status: "idle",
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchListCountriesAsync.pending, (state) => {
      state.status = "pendingFetchCountries";
    });
    builder.addCase(fetchListCountriesAsync.fulfilled, (state, action) => {
      countriesAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.listLoaded = true;
    });
    builder.addCase(fetchListCountriesAsync.rejected, (state, action) => {
      state.status = "idle";
    });
  },
});
export const countrySelectors = countriesAdapter.getSelectors(
  (state: RootState) => state.country
);
