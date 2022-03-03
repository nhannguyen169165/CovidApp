import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { countryChartSlice, countrySlice } from "../../redux/Slice/CountrySilce";
import { countryDetailSlice } from "../../redux/Slice/CountrySilce";
export const store = configureStore({
    reducer: {
        countries:countrySlice.reducer,
        countryDetail:countryDetailSlice.reducer,
        countryChart:countryChartSlice.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;