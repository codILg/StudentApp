import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Modal,
  Grid,
  TextField,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  Button,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { validationSchema } from "./forumpageValidation";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
// import Theme from "./Theme";
import { createThemeAsync } from "./themeSlice";
import { useNavigate } from "react-router-dom";

export default function CreateTheme() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const courses = useAppSelector((state) => state.course.courses);

  const [isFreeTopic, setIsFreeTopic] = useState(false);
  const methods = useForm({
    mode: "all",
    resolver: yupResolver(validationSchema(isFreeTopic)),
  });

  const {
    control,
    setValue,
    trigger,
    clearErrors,
    register,
    formState: { errors },
  } = methods;

  //   const { control, setValue, clearErrors, trigger, register } = methods; // Koristite methods iz roditeljskog komponenta
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  //   const {formState: { isSubmitting, errors, isValid }}=useForm();
  const onSubmit = async (data: FieldValues) => {
    console.log(data);
    const localDate = new Date();
    const offset = localDate.getTimezoneOffset();

    const adjustedDate = new Date(localDate.getTime() - offset * 60000);
    const newTheme = {
      title: data.title,
      description: data.description,
      date: adjustedDate.toISOString(),
      courseId: data.courseId,
    };
    console.log(newTheme);
    const resultAction = await dispatch(createThemeAsync(newTheme));

    if (createThemeAsync.fulfilled.match(resultAction)) {
      navigate(`/forum/${resultAction.payload.id}`);
    } else {
      console.error("Failed to create theme:", resultAction.payload);
    }
  };
  useEffect(() => {
    if (isInitialized) {
      trigger();
      console.log(isInitialized);
    } else {
      setIsInitialized(true);
    }
  }, [isFreeTopic, trigger]);
  const navigate1 = useNavigate();

  const handleClose = () => {
    navigate1(-1);
  };

  return (
    <Grid
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        style={{ width: "40%", padding: 8 }}
      >
        <Grid
          container
          spacing={3}
          sx={{
            direction: "column",
            gap: 4,
            width: "100%",
            padding: 2,
            paddingX: 4,
            backgroundColor: "background.default",
            borderRadius: "20px",
            border: "2px solid",
            borderColor: "primary.main",
            display: "flex",
            flexDirection: "column",
            // boxSizing: "border-box",
            height: "75%",
            maxHeight: "75%",
          }}
        >
          <Typography
            variant="h6"
            sx={{ textAlign: "center", fontFamily: "Raleway, sans-serif" }}
            mb={2}
          >
            Kreiranje teme
          </Typography>

          <Grid  sx={{ paddingLeft: 0 }}>
            <Controller
              name="title"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Naslov"
                  variant="outlined"
                  fullWidth
                  {...register("title", {
                    required: "Title is required.",
                  })}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || ""}
                  sx={{ height: "3rem", maxHeight: "3rem" }}
                />
              )}
            />
          </Grid>
          <Grid  sx={{ padding: 0 }}>
            <Controller
              name="description"
              control={control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Opis"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={5}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || ""}
                  {...register("description", {
                    required: "Description is required.",
                  })}
                  sx={{ height: "9rem", maxHeight: "9rem" }}
                />
              )}
            />
          </Grid>
          <Grid  sx={{ padding: 0 }}>
            <Controller
              name="freeTopic"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{ height: "2rem", maxHeight: "2rem" }}
                      {...field}
                      name="freeTopic"
                      checked={isFreeTopic}
                      value={isFreeTopic}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setIsFreeTopic(isChecked);
                        if (isChecked) {
                          setValue("courseId", "0");
                          clearErrors("courseId");
                        } else {
                          setValue("courseId", "0", { shouldValidate: true });
                          trigger();
                        }
                        setValue("freeTopic", isChecked);
                      }}
                      color="primary"
                    />
                  }
                  label="Slobodna tema"
                />
              )}
            />
          </Grid>
          <Grid  sx={{ padding: 0 }}>
            <FormControl
              fullWidth
              disabled={isFreeTopic}
              sx={{ height: "3rem", maxHeight: "3rem" }}
              error={!!errors.courseId} // Dinamičko upravljanje greškom na FormControl
            >
              <InputLabel id="courseId-label">Kurs</InputLabel>
              <Controller
                name="courseId"
                control={control}
                rules={{
                  required: "Izbor kursa je obavezan!", // Pravilo validacije
                }}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      {...field}
                      labelId="courseId-label"
                      value={field.value || "0"}
                      label="Kurs"
                      error={!!fieldState.error} // Dinamičko upravljanje greškom na Select komponenti
                      onChange={(e) => {
                        setValue("courseId", e.target.value || "0", {
                          shouldValidate: true,
                        });
                        if (fieldState.error) {
                          clearErrors("courseId");
                        }
                        trigger();
                      }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 120,
                            overflowY: "auto",
                          },
                        },
                      }}
                      sx={{
                        color: fieldState.error ? "error.main" : "inherit", // Menja boju teksta
                        "& .MuiSelect-icon": {
                          color: fieldState.error ? "error.main" : "inherit", // Menja boju ikone
                        },
                      }}
                    >
                      <MenuItem value={0}>Nema kursa</MenuItem>
                      {courses?.map((course) => (
                        <MenuItem key={course.id} value={course.id}>
                          {course.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldState.error && (
                      <FormHelperText>
                        {fieldState.error?.message || "Greška u izboru kursa"}
                      </FormHelperText>
                    )}
                  </>
                )}
              />
            </FormControl>
          </Grid>

          <Grid
            
            sx={{ display: "flex", justifyContent: "space-evenly", padding: 0 }}
          >
            <Button onClick={handleClose}>Odustani</Button>
            <LoadingButton
              loading={loading}
              disabled={!methods.formState.isValid}
              type="submit"
              variant="contained"
              color="primary"
            >
              Pošalji
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
}
