import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreateTheme, Theme, ThemesParams } from "../../app/models/theme";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";

export interface ThemeState {
  themes: Theme[] | null;
  status: string;
  themesParams: ThemesParams;
  filtersLoaded: boolean;
  themesLoaded: boolean;
  category: string[];
  themeStatus: string[];
}

const initialState: ThemeState = {
  themes: null,
  status: "idle",
  themesParams: initParams(),
  filtersLoaded: false,
  themesLoaded: false,
  category: [],
  themeStatus: [],
};

function initParams() {
  return {
    // pageNumber: 1,
    // pageSize: 6,
    // orderBy: "name",
    type: "all",
    category: "all",
    themeStatus: "all",
  };
}

function getAxiosParams(themesParams: ThemesParams) {
  const params = new URLSearchParams();

  if (themesParams.themeStatus)
    params.append("themeStatus", themesParams.themeStatus.toString());
  if (themesParams.searchTerm)
    params.append("searchTerm", themesParams.searchTerm.toString());
  if (themesParams.category)
    params.append("category", themesParams.category.toString());
  if (themesParams.type) params.append("type", themesParams.type.toString());
  return params;
}

export const fetchThemesAsync = createAsyncThunk<
  Theme[],
  void,
  { state: RootState }
>("theme/fetchThemesAsync", async (_, thunkAPI) => {
  const params = getAxiosParams(thunkAPI.getState().theme.themesParams);
  // console.log("IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII" + params);
  try {
    const themes = await agent.Theme.getAll(params);
    thunkAPI.dispatch(setThemes(themes));
    return themes;
  } catch (error: any) {
    console.log(error.data);
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const fetchFilters = createAsyncThunk(
  "theme/fetchFilters",
  async (_, thunkAPI) => {
    try {
      return agent.Theme.fetchFilters();
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const createThemeAsync = createAsyncThunk<Theme, CreateTheme>(
  "messages/createTheme",
  async (newTheme, thunkAPI) => {
    try {
      const response = await agent.Theme.create(newTheme);
      return response.data; // Ovo vraća listu poruka sa servera
    } catch (error: unknown) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemes: (state, action) => {
      state.themes = action.payload;
    },
    setThemesParams: (state, action) => {
      state.themesLoaded = false;
      state.themesParams = {
        ...state.themesParams,
        ...action.payload,
      };
      // console.log(state.themesParams);
    },
    resetThemesParams: (state) => {
      state.themesParams = initParams();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createThemeAsync.fulfilled, (state, action) => {
      state.status = "succeeded"; // Ažuriramo status kako bismo pokazali da je operacija uspešna
      if (state.themes) {
        // Ako već imamo teme, dodajemo novu u listu
        state.themes.push(action.payload);
      } else {
        // Ako nema tema, postavljamo novu listu sa jednom temom
        state.themes = [action.payload];
      }
    });
    builder.addCase(fetchFilters.pending, (state) => {
      state.status = "pendingFetchFilters";
    });
    builder.addCase(fetchFilters.fulfilled, (state, action) => {
      // console.log(action.payload);
      state.category = action.payload.categories;
      state.themeStatus = action.payload.activeStatus;
      state.status = "idle";
      state.filtersLoaded = true;
    });
    builder.addCase(fetchFilters.rejected, (state, action) => {
      state.status = "idle";
      console.log(action.payload);
    });
    builder.addCase(fetchThemesAsync.pending, (state) => {
      state.status = "pendingFetchThemes";
    });
    builder.addCase(fetchThemesAsync.rejected, (state) => {
      //state.loading = false;
      state.status = "idle";
    });
    builder.addCase(fetchThemesAsync.fulfilled, (state) => {
      state.status = "idle";
      state.themesLoaded = true;
    });
  },
});
export const { setThemes, setThemesParams, resetThemesParams } =
  themeSlice.actions;
