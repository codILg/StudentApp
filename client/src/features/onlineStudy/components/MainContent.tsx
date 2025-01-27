import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { useAppSelector } from "../../../app/store/configureStore";
import { format } from "date-fns";
import CourseCardMedia from "./CourseCardMedia";
import { Author } from "./Author";
import { Button, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

const DateCard = ({ date }: { date: string }) => {
  const dateFormatted = new Date(date); // Pretvori string u Date objekat
  const formattedDate = format(dateFormatted, "dd.MM.yyyy"); // Formatiraj datum

  return <div>{formattedDate}</div>;
};

const SyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: 0,
  height: "100%",
  backgroundColor: theme.palette.secondary.main,
  "&:hover": {
    backgroundColor: "transparent",
    // cursor: "pointer",
    border: "1px solid",
    borderColor: theme.palette.background.paper,
  },
  "&:focus-visible": {
    outline: "3px solid",
    outlineColor: "hsla(210, 98%, 48%, 0.5)",
    outlineOffset: "2px",
  },
}));

const SyledCardContent = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  // gap: 4,
  padding: 16,
  // flexGrow: 1,
  "&:last-child": {
    // paddingBottom: 16,
  },
});

const StyledTypography = styled(Typography)({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
});

export default function MainContent() {
  const user = useAppSelector((state) => state.account.user);

  const [focusedCardIndex, setFocusedCardIndex] = React.useState<number | null>(
    null
  );

  const handleFocus = (index: number) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  const courses = useAppSelector((state) => state.course.allCourses);

  const newArray = [...(courses || [])];
  const topCourses = newArray
    ?.sort((a, b) => b.usersCourse.length - a.usersCourse.length)
    .slice(0, 5);
  const firstTwoCourses = topCourses.slice(0, 2); // Prvih 4 elementa
  const lastThreeCourses = topCourses.slice(-3);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        margin: 0,
        padding: 0,
      }}
    >
      <div>
        <Typography
          variant="h2"
          // gutterBottom
          sx={{
            fontFamily: "Raleway, sans-serif",
            marginY: 4,
            fontWeight: "bolder",
            color: "primary.main",
          }}
        >
          Online učenje
        </Typography>
        <Box
          sx={{
            margin: 0,
            padding: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontFamily: "Raleway, sans-serif" }}>
            Pronađite kurs koji vam odgovara.
          </Typography>
          {user && (
            <Button
              component={Link}
              to="/createCourse"
              //onClick={handleOpen}
              sx={{
                backgroundColor: "primary.dark",
                color: "white",
                padding: "10px 20px",
                borderRadius: "20px",
                // fontSize: "30px",
                "&:hover": {
                  backgroundColor: "primary.light",
                },
                height: "fit-content",
                width: "3rem",
                boxSizing: "border-box",
              }}
            >
              <AddIcon sx={{ fontSize: "16pt" }} />
            </Button>
          )}
        </Box>
      </div>
      <Divider />

      <Grid container spacing={2} columns={12}>
        {firstTwoCourses.map((course, index) => (
          <Grid key={index} size={{ xs: 12, md: 6 }}>
            <SyledCard
              variant="outlined"
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              tabIndex={index}
              className={focusedCardIndex === index ? "Mui-focused" : ""}
              sx={{
                // backgroundColor:"secondary.main",

                border: "none",
                borderRadius: "16px",
                boxShadow: (theme) =>
                  `0px 4px 12px ${theme.palette.mode === "light" ? "#ddd" : "#333"}`,
                overflow: "hidden",
                position: "relative",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: (theme) =>
                    `0px 8px 24px ${theme.palette.mode === "light" ? "#bbb" : "#111"}`,
                },
              }}
            >
              {/* Sekcija slike sa "overlay" efektom */}
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "200px", // Fiksna visina slike
                  overflow: "hidden",
                }}
              >
                <CourseCardMedia
                  year={course.year}
                  studyProgram={course.studyProgram}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "brightness(0.75)", // Tamniji filter da bi tekst bio čitljiv
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "16px",
                    left: "16px",
                    color: "white",
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="caption"
                    fontFamily="Raleway, sans-serif"
                    sx={{ opacity: 0.8, paddingX: 1.5 }}
                  >
                    {course.studyProgram.name}
                  </Typography>
                  <Typography
                    variant="h5"
                    fontFamily="Raleway, sans-serif"
                    sx={{
                      fontWeight: 700,
                      textDecoration: "none", // Uklanja podrazumevanu dekoraciju za Link
                      color: "#c4e1f6", // Podešava boju na primarnu boju teksta
                      "&:hover": {
                        color: "primary.main", // Opcionalno, boja pri hoveru
                      },
                      backdropFilter: "blur(30px)",
                      borderRadius: "20pt",
                      paddingX: 1.5,
                      backgroundColor: "#0c101780",
                    }}
                    component={Link}
                    to={`/courses/${course.id}`}
                  >
                    {course.name}
                  </Typography>
                </Box>
              </Box>

              {/* Glavni sadržaj kursa */}
              <Box
                sx={{
                  padding: "16px",
                  backgroundColor: "inherit",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <StyledTypography
                  variant="body2"
                  color="text.secondary"
                  fontFamily="Raleway, sans-serif"
                >
                  {course.description}
                </StyledTypography>

                <Divider sx={{ my: 1 }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {/* Autori kursa */}
                  <Author authors={course.professorsCourse} />

                  {/* Datum kreiranja */}
                  <Typography
                    variant="caption"
                    fontFamily="Raleway, sans-serif"
                    color="text.secondary"
                  >
                    <DateCard date={course.courseCreationDate.split("T")[0]} />
                  </Typography>
                </Box>
              </Box>
            </SyledCard>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2} columns={12}>
        {lastThreeCourses.map((course, index) => (
          <Grid key={index} size={{ xs: 12, md: 4 }}>
            <SyledCard
              variant="outlined"
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              tabIndex={index}
              className={focusedCardIndex === index ? "Mui-focused" : ""}
              sx={{
                // backgroundColor:"secondary.main",
                justifyContent: "space-evenly",
                height: "100%",
                border: "none",
                borderRadius: "16px",
                boxShadow: (theme) =>
                  `0px 4px 12px ${theme.palette.mode === "light" ? "#ddd" : "#333"}`,
                overflow: "hidden",
                position: "relative",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: (theme) =>
                    `0px 8px 24px ${theme.palette.mode === "light" ? "#bbb" : "#111"}`,
                },
              }}
            >
              <CourseCardMedia
                year={course.year}
                studyProgram={course.studyProgram}
                sx={{
                  height: { sm: "auto", md: "50%" },
                  aspectRatio: { sm: "16 / 9", md: "" },
                  filter: "brightness(0.75)", // Tamniji filter da bi tekst bio čitljiv
                }}
              />
              <Box
                sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
              >
                <SyledCardContent sx={{ pb: 0, gap: 0.5 }}>
                  <Typography
                    // gutterBottom
                    variant="caption"
                    component="div"
                    fontFamily="Raleway, sans-serif"
                    fontSize="clamp(10px, 12px, 14px)"
                  >
                    {course.studyProgram.name}
                  </Typography>
                  <Typography
                    // gutterBottom
                    variant="h6"
                    // component="div"
                    fontFamily="Raleway, sans-serif"
                    fontSize="clamp(12px, 14px, 16px)"
                    fontWeight="bolder"
                    component={Link}
                    to={`/courses/${course.id}`}
                    sx={{
                      textDecoration: "none",
                      color: "text.primary",
                      overflow: "hidden", // Sakriva sadržaj koji prelazi kontejner
                      display: "-webkit-box", // Neophodno za multi-line truncation
                      WebkitBoxOrient: "vertical", // Omogućava višelinijski prikaz
                      WebkitLineClamp: 1, // Maksimalan broj linija (menjajte po potrebi)
                      lineHeight: "1", // Podešava razmak između linija
                      height: "1.2em", // Fiksna visina: broj linija * lineHeight
                      textOverflow: "ellipsis", // Dodaje tri tačke
                    }}
                  >
                    {course.name}
                  </Typography>
                  <StyledTypography
                    variant="body2"
                    color="text.secondary"
                    // gutterBottom
                    fontFamily="Raleway, sans-serif"
                    fontSize="clamp(10px, 12px, 14px)"
                  >
                    {course.description}
                  </StyledTypography>
                </SyledCardContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 2,
                  }}
                >
                  <Author authors={course.professorsCourse} />
                  <Typography variant="caption">
                    <DateCard date={course.courseCreationDate.split("T")[0]} />
                  </Typography>
                </Box>
              </Box>
            </SyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
