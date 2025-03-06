import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import {
  Professor,
  ProfessorsParams,
  StudentsParams,
} from "../../app/models/professor";
import { Course, StudyProgram, Year } from "../../app/models/course";
import { RootState } from "../../app/store/configureStore";
import { Theme } from "../../app/models/theme";
import { User } from "../../app/models/user";

export interface ProfessorState {
  professors: Professor[];
  status: string;
  professorsParams: ProfessorsParams;
  filtersLoaded: boolean;
  professorsLoaded: boolean;

  professorCourses: Record<number, Course[]> | null;
  professorThemes: Record<number, Theme[]> | null;
  coursesLoaded: boolean;
  programs: string[];
  years: string[];
  profYears: Record<number, Year[]> | null;
  profPrograms: Record<number, StudyProgram[]> | null;

  currentProfessor: Professor | null;
  currentProfessorLoaded: boolean;
  currentProfessorYears: Year[] | null;
  currentProfessorPrograms: StudyProgram[] | null;
  currentProfessorCourses: Course[] | null;
  currentProfessorThemes: Theme[] | null;
  currentProfThemesLoaded: boolean;
  currentProfCoursesLoaded: boolean;
}

const initialState: ProfessorState = {
  professors: [],
  status: "idle",
  professorsParams: initParams(),
  filtersLoaded: false,
  professorsLoaded: false,
  //
  professorCourses: {},
  professorThemes: {},
  coursesLoaded: false,
  programs: [],
  years: [],
  profYears: {},
  profPrograms: {},

  currentProfessor: null,
  currentProfessorLoaded: false,
  currentProfessorYears: [],
  currentProfessorPrograms: [],
  currentProfessorCourses: [],
  currentProfessorThemes: [],
  currentProfThemesLoaded: false,
  currentProfCoursesLoaded: false,
};

function initParams() {
  return {
    year: "Sve",
    program: "Sve",
  };
}

function getAxiosParams(professorsParams: ProfessorsParams) {
  const params = new URLSearchParams();

  if (professorsParams.searchTerm)
    params.append("searchTerm", professorsParams.searchTerm.toString());
  if (professorsParams.program)
    params.append("program", professorsParams.program.toString());
  if (professorsParams.year)
    params.append("year", professorsParams.year.toString());
  return params;
}

//za kurseve profesora iskoristila metodu iz courseSlice jer je ovdje pod tim imenom druga metoda
export const fetchProfessorYearsProgramsAsync = createAsyncThunk<
  void,
  { id: number; totalCount: number }
>(
  "professor/fetchProfessorYearsProgramsAsync",
  async ({ id, totalCount }, thunkAPI) => {
    try {
      const { years, programs } =
        await agent.Professor.getProfessorYearsPrograms(id);
      const professorCourses = await agent.Course.getProfessorCourses(id);

      thunkAPI.dispatch(
        setProfessorCourses({
          professorId: id,
          years: years,
          programs: programs,
          courses: professorCourses,
          totalCount: totalCount, // Dodaj ukupni broj profesora
        })
      );
    } catch (error: any) {
      console.error(error.data);
      throw error;
    }
  }
);

export const deleteProfessorsThemeAsync = createAsyncThunk<
  { id: number; idProfessor: number },
  { id: number; idProfessor: number },
  { state: RootState }
>("professor/deleteProfessorsTheme", async ({ id, idProfessor }, thunkAPI) => {
  try {
    await agent.Theme.deleteTheme(id);

    return { id, idProfessor };
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const deleteProfessorsCourseAsync = createAsyncThunk<
  { id: number; idProfessor: number },
  { id: number; idProfessor: number },
  { state: RootState }
>(
  "course/deleteProfessorsCourseAsync",
  async ({ id, idProfessor }, thunkAPI) => {
    try {
      await agent.Course.deleteCourse(id);

      return { id, idProfessor };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchProfessorThemesAsync = createAsyncThunk<void, number>(
  "professor/fetchProfessorThemesAsync",
  async (id, thunkAPI) => {
    try {
      // const { themes } =
      //   await agent.Professor.getProfessorThemes(id);
      const professorThemes = await agent.Theme.getProfessorThemes(id);

      thunkAPI.dispatch(
        setProfessorThemes({
          professorId: id,
          themes: professorThemes,
        })
      );
    } catch (error: any) {
      console.error(error.data);
      throw error;
    }
  }
);

export const fetchProfessorsAsync = createAsyncThunk<
  Professor[],
  void,
  { state: RootState }
>("professor/fetchProfessorsAsync", async (_, thunkAPI) => {
  const params = getAxiosParams(thunkAPI.getState().professor.professorsParams);
  try {
    const professors = await agent.Professor.GetAllProfessors(params);
    // thunkAPI.dispatch(setProfessors(professors));
    return professors;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const fetchFilters = createAsyncThunk(
  "professor/fetchFilters",
  async (_, thunkAPI) => {
    try {
      const filters = agent.Professor.fetchFilters();

      return filters;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);
interface UpdateThemeDto {
  id: number;
  active: boolean;
}

export const updateThemeStatus = createAsyncThunk<Theme[], UpdateThemeDto>(
  "professor/updateTheme",
  async (themeData, thunkAPI) => {
    try {
      console.log("PROFESSOR slice ts");

      const themeDto = await agent.Theme.updateTheme(themeData); // Pozivanje agenta sa parametrima
      console.log(themeDto);
      console.log(themeDto.user.id);

      const professorThemes = await agent.Theme.getProfessorThemes(
        themeDto.user.id
      );

      console.log(professorThemes);

      console.log("APDEJTOVAO STATUS");

      // thunkAPI.dispatch(
      //   setProfessorThemes({
      //     professorId: themeDto.user.id,
      //     themes: professorThemes,
      //   })
      // );
      return professorThemes;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

interface ProfessorResponse {
  professor: Professor;
  years: Year[] | null;
  programs: StudyProgram[] | null;
  //courses: Course[] | null;
}
export const fetchProfessorByIdAsync = createAsyncThunk<
  ProfessorResponse,
  number
>("professor/fetchProfessorByIdAsync", async (id, thunkAPI) => {
  try {
    const professor = await agent.Professor.getProfessorById(id);
    const { years, programs } =
      await agent.Professor.getProfessorYearsPrograms(id);
    return {
      professor: professor,
      years: years,
      programs: programs,
      //courses: professorCourses.courses,
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

interface ThemeResponse {
  // professor: Professor;
  // years: Year[] | null;
  // programs: StudyProgram[] | null;
  //courses: Course[] | null;
  themes: Theme[] | null;
}

export const fetchProfessorByIdThemesAsync = createAsyncThunk<
  ThemeResponse,
  number
>("professor/fetchProfessorByIdThemesAsync", async (id, thunkAPI) => {
  try {
    // const professor = await agent.Professor.getProfessorById(id);
    // const { years, programs } =
    //   await agent.Professor.getProfessorYearsPrograms(id);
    const professorThemes = await agent.Theme.getProfessorThemes(id);
    console.log(professorThemes);
    return {
      // professor: professor,
      // years: years,
      // programs: programs,
      themes: professorThemes,
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

interface CourseResponse {
  // professor: Professor;
  // years: Year[] | null;
  // programs: StudyProgram[] | null;
  //courses: Course[] | null;
  courses: Course[] | null;
}

export const fetchProfessorByIdCoursesAsync = createAsyncThunk<
  CourseResponse,
  number
>("professor/fetchProfessorByIdCoursesAsync", async (id, thunkAPI) => {
  try {
    const professorCourses = await agent.Course.getProfessorCourses(id);
    console.log(professorCourses);
    return {
      courses: professorCourses.courses,
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

interface RemoveResponseProf {
  Message: string;
  professorId: number;
  courseId: number;
  withdrawDate: string;
}
export const removeProfessorFromCourse = createAsyncThunk<
  RemoveResponseProf,
  number
>("professor/removeProfessorFromCourse", async (courseId, thunkAPI) => {
  try {
    const profCourse =
      await agent.Professor.removeProfessorFromCourse(courseId);
    console.log(profCourse);
    return profCourse;
  } catch (error: any) {
    console.log(error.data);
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

export const professorSlice = createSlice({
  name: "professor",
  initialState,
  reducers: {
    setProfessorsParams: (state, action) => {
      state.professorsLoaded = false;
      state.professorsParams = {
        ...state.professorsParams,
        ...action.payload,
      };
    },
    resetProfessorsParams: (state) => {
      state.professorsParams = initParams();
    },
    setProfessorCourses: (state, action) => {
      state.profYears![action.payload.professorId] = action.payload.years;
      state.profPrograms![action.payload.professorId] = action.payload.programs;
      state.professorCourses![action.payload.professorId] =
        action.payload.courses;

      if (
        state.profYears !== null &&
        state.professorsParams.year == null &&
        state.professorsParams.program == null &&
        state.professorsParams.searchTerm == undefined
      ) {
        const allCoursesLoaded =
          Object.keys(state.profYears).length === action.payload.totalCount;
        state.coursesLoaded = allCoursesLoaded;
      } else {
        state.coursesLoaded = true;
      }
    },
    setProfessorThemes: (state, action) => {
      state.professorThemes![action.payload.professorId] =
        action.payload.themes;
    },
    setCoursesLoaded: (state, action) => {
      state.coursesLoaded = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProfessorsAsync.pending, (state) => {
      state.status = "pendingFetchProfessors";
      state.professorsLoaded = false;
    });
    builder.addCase(fetchProfessorsAsync.fulfilled, (state, action) => {
      state.status = "idle";
      state.professors = action.payload;
      state.professorsLoaded = true;
    });
    builder.addCase(fetchProfessorsAsync.rejected, (state) => {
      state.status = "rejectedFetchProfessors";
    });
    builder.addCase(fetchFilters.fulfilled, (state, action) => {
      state.years = action.payload.years;
      state.programs = action.payload.programs;
      state.status = "idle";
      state.filtersLoaded = true;
    });
    builder.addCase(fetchFilters.rejected, (state, action) => {
      state.status = "idle";
    });
    builder.addCase(updateThemeStatus.pending, (state) => {
      state.status = "pendingUpdateThemeStatus";
    });
    builder.addCase(updateThemeStatus.fulfilled, (state, action) => {
      console.log("prof slice reducer");
      console.log(action.payload);

      state.currentProfessorThemes = action.payload;
      console.log("usao u reducer na update status");
      state.status = "fulfilledUpdateThemeStatus";
    });
    builder.addCase(updateThemeStatus.rejected, (state) => {
      state.status = "idle";
    });

    builder.addCase(fetchProfessorYearsProgramsAsync.pending, (state) => {
      state.status = "pendingFetchProfessorCoursesAsync";
      state.coursesLoaded = false;
    });
    builder.addCase(fetchProfessorYearsProgramsAsync.rejected, (state) => {
      //state.loading = false;
      state.status = "idle";
    });
    builder.addCase(fetchProfessorYearsProgramsAsync.fulfilled, (state) => {
      //state.loading = false; // Postavi loading na true
      // state.coursesLoaded = true;
      state.status = "idle";
    });
    builder.addCase(deleteProfessorsThemeAsync.pending, (state) => {
      state.status = "pendingDeleteTheme";
    });
    builder.addCase(deleteProfessorsThemeAsync.fulfilled, (state, action) => {
      state.status = "idle";
      // state.professorThemes![action.payload.idProfessor] =
      //   state.professorThemes![action.payload.idProfessor].filter(
      //     (theme) => theme.id !== action.payload.id
      //   );
      if (state.currentProfessorThemes)
        state.currentProfessorThemes = state.currentProfessorThemes?.filter(
          (theme) => theme.id !== action.payload.id
        );
    });
    builder.addCase(deleteProfessorsThemeAsync.rejected, (state) => {
      state.status = "rejectedDeleteProfTheme";
    });
    builder.addCase(deleteProfessorsCourseAsync.pending, (state) => {
      state.status = "pendingDeleteCourse";
    });

    builder.addCase(deleteProfessorsCourseAsync.fulfilled, (state, action) => {
      state.status = "idle";
      // state.professorCourses![action.payload.idProfessor] =
      //   state.professorCourses![action.payload.idProfessor].filter(
      //     (course) => course.id !== action.payload.id
      //   );

      // state.professorThemes![action.payload.idProfessor] =
      //   state.professorThemes![action.payload.idProfessor].filter(
      //     (theme) => theme.course?.id !== action.payload.id
      //   );
      if (state.currentProfessorCourses)
        state.currentProfessorCourses = state.currentProfessorCourses?.filter(
          (course) => course.id !== action.payload.id
        );
    });
    builder.addCase(deleteProfessorsCourseAsync.rejected, (state) => {
      state.status = "rejectedDeleteProfCourse";
    });

    // builder.addCase(fetchProfessorByIdAsync.pending, (state) => {
    //   state.status = "pendingFetchProfessorByIdAsync";
    //   // state.coursesLoaded = false;
    // });
    builder.addCase(fetchProfessorByIdAsync.rejected, (state) => {
      //state.loading = false;
      state.status = "idle";
    });
    builder.addCase(fetchProfessorByIdAsync.pending, (state) => {
      state.status = "pendingFetchProfessorById";
    });
    builder.addCase(fetchProfessorByIdAsync.fulfilled, (state, action) => {
      //state.loading = false; // Postavi loading na true
      // state.coursesLoaded = true;
      state.currentProfessorLoaded = true;
      console.log(action.payload);
      state.currentProfessor = action.payload.professor;
      // state.currentProfessorCourses = action.payload.courses;
      state.currentProfessorYears = action.payload.years;
      state.currentProfessorPrograms = action.payload.programs;
      state.status = "fulfilledFetchProfessorByIdAsync";
    });
    builder.addCase(fetchProfessorByIdThemesAsync.pending, (state) => {
      state.currentProfThemesLoaded = false;
    });
    builder.addCase(
      fetchProfessorByIdThemesAsync.fulfilled,
      (state, action) => {
        state.currentProfessorThemes = action.payload.themes;
        state.currentProfThemesLoaded = true;
      }
    );
    builder.addCase(fetchProfessorByIdThemesAsync.rejected, (state) => {
      state.status = "rejectedFetchProfessorThemes";
    });
    builder.addCase(fetchProfessorByIdCoursesAsync.pending, (state) => {
      state.currentProfCoursesLoaded = false;
    });
    builder.addCase(
      fetchProfessorByIdCoursesAsync.fulfilled,
      (state, action) => {
        state.currentProfessorCourses = action.payload.courses;
        state.currentProfCoursesLoaded = true;
      }
    );
    builder.addCase(fetchProfessorByIdCoursesAsync.rejected, (state) => {
      state.status = "rejectedFetchProfessorCourses";
    });

    builder.addCase(removeProfessorFromCourse.pending, (state) => {
      state.status = "pendingRemoveProfessorFromCourse";
    });
    builder.addCase(removeProfessorFromCourse.fulfilled, (state, action) => {
      console.log(action.payload);
      if (state.currentProfessorCourses) {
        const course = state.currentProfessorCourses.find(
          (course) => course.id === action.payload.courseId
        );
        console.log(course?.professorsCourse);

        if (course) {
          const profCourse = course.professorsCourse.find(
            (professor) => professor.user.id == action.payload.professorId
          );
          if (profCourse) profCourse.withdrawDate = action.payload.withdrawDate;
        }
        // state.currentProfessorCourses = state.currentProfessorCourses.filter(
        //   (course) => course.id != action.payload.courseId
        // );
        // console.log(course?.professorsCourse);
      }
      state.status = "fulfilledRemoveProfessorFromCourse";
    });
    builder.addCase(removeProfessorFromCourse.rejected, (state) => {
      state.status = "rejectedRemoveProfessorFromCourse";
    });
  },
});

export const {
  setProfessors,
  setProfessorsParams,
  setProfessorCourses,
  resetProfessorsParams,
  setCoursesLoaded,
  setProfessorThemes,
} = professorSlice.actions;
