import * as React from "react";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { Course } from "../../../app/models/course";
import { Grid } from "@mui/material";
import CourseCardMedia from "./CourseCardMedia";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../app/store/configureStore";

interface SlideCardProps {
  courses: Course[]; 
}

export default function SlideCard({ courses }: SlideCardProps) {
  const user = useAppSelector((state) => state.account.user);

  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  if (courses[activeStep] != null)
    return (
      <div style={{ margin: "0", padding: 0 }}>
        <Grid
          sx={{
            gridTemplateColumns: "1fr 2fr", 
            display: "grid",
            gap: 2, 
            width: "100%", 
            mb: 3,
          }}
        >
          <CourseCardMedia
            year={courses[activeStep].year}
            studyProgram={courses[activeStep].studyProgram}
            sx={{
              height: "100px",
              borderRadius: "25pt",
              objectFit: "cover", 
            }}
          />
          <Grid
            sx={{
              display: "grid",
              gridTemplateRows: "1fr 1fr 1fr", 
              gap: 0.5, 
            }}
          >
            <Typography
              component={Link}
              to={user ? `/courses/${courses[activeStep].id}`: `/login`}
              sx={{
                width: "fit-content",
                overflow: "hidden", 
                textOverflow: "ellipsis", 
                fontSize: "clamp(0.8rem, 1.8vw, 1.2rem)", 
                fontFamily: "Raleway, sans-serif",
                textDecoration: "none",
                color: "text.primary",
                fontWeight:"normal",
                display: "-webkit-box", 
                WebkitBoxOrient: "vertical", 
                WebkitLineClamp: 1, 
                lineHeight: "1", 
                height: "1em", 
                "&:hover":{
                  color:"primary.main", 
                  fontWeight:"bolder",
                }
              }}
            >
              {courses[activeStep].name}
            </Typography>

            <Typography
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "clamp(0.6rem,1.5vw, 1rem)",
                fontFamily: "Raleway, sans-serif",
              }}
            >
              {courses[activeStep].description}
            </Typography>

            <Typography
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "clamp(0.5rem, 1vw, 1rem)",
                fontFamily: "Raleway, sans-serif",
                color: "primary.main",
              }}
            >
              {courses[activeStep].studyProgram.name} &nbsp; | &nbsp;{" "}
              {courses[activeStep].year.name}
            </Typography>
          </Grid>
        </Grid>
        <MobileStepper
          variant="text"
          steps={courses.length}
          position="static"
          activeStep={activeStep}
          sx={{
            flexGrow: 1,
            padding: 0,
            "& .MuiMobileStepper-dot": {
              backgroundColor: "background.paper", 
            },
            "& .MuiMobileStepper-dotActive": {
              backgroundColor: "common.black", 
            },
          }}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === courses.length - 1}
              sx={{ color: "common.black" }}
            >
              Sljedeći
              {theme.direction === "rtl" ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
              sx={{ color: "common.black" }}
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Prethodni
            </Button>
          }
        />
      </div>
    );
  else
    return (
      <Typography fontFamily="Raleway, sans-serif" textAlign="center">
        Nema kurseva za ovog profesora
      </Typography>
    );
}
