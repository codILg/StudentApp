import { useParams } from "react-router-dom";
import { useAppSelector } from "../../app/store/configureStore";
import NotFound from "../../app/errors/NotFound";
import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  Collapse,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import CourseCardMedia from "./components/CourseCardMedia";
import { Author } from "./components/Author";

export default function Course() {
  const [openWeeks, setOpenWeeks] = useState<boolean[]>(Array(10).fill(false));

  const toggleWeek = (index: number) => {
    setOpenWeeks((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const { id } = useParams<{ id: string }>();
  const allCourses = useAppSelector((state) => state.course.courses);

  const topOfPageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (topOfPageRef.current) {
      // Skroluje na prvi element u referenci
      topOfPageRef.current.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
    }
    console.log("Ovdjee");
  }, [id]); // Pozivaće se kad se promeni ID kursa
  if (id == undefined) return <NotFound />;

  const course = allCourses!.find((i) => i.id === parseInt(id));

  if (course == undefined) return <NotFound />;

  return (
    <>
      <div ref={topOfPageRef}></div>
      <Container style={{ marginTop: "2rem" }}>
        {/* Naslov i opisi */}
        <Card
          sx={{
            boxShadow: (theme) => `0px 4px 10px ${theme.palette.text.primary}`,
            //   backgroundColor: "background.paper",
          }}
        >
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {course.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              ID: {course.id} | {course.year.name} | {course.studyProgram.name}
            </Typography>
            <Typography variant="body1" style={{ marginTop: "1rem" }}>
              {course.description}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              style={{ marginTop: "1rem" }}
            >
              Kreirano:{" "}
              {new Date(course.courseCreationDate).toLocaleDateString()}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              style={{ marginTop: "1rem" }}
            >
              Profesori
            </Typography>
            <Author authors={course!.professorsCourse} />
          </CardContent>
          <CourseCardMedia
            year={course.year}
            studyProgram={course.studyProgram}
            sx={{ borderBottom: "1px solid", borderColor: "divider" }}
          />
        </Card>

        {/* Izlistavanje sedmica */}
        <Typography variant="h5" style={{ margin: "2rem 0 1rem 0" }}>
          Sedmice i materijali
        </Typography>
        <List>
          {[...Array(10)].map((_, index) => (
            <div key={index}>
              <ListItem
                component="div"
                onClick={() => toggleWeek(index)}
                style={{ cursor: "pointer" }}
              >
                <ListItemText primary={`Sedmica ${index + 1}`} />
                <IconButton>
                  {openWeeks[index] ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </ListItem>
              <Collapse in={openWeeks[index]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem>
                    <ListItemText
                      primary={`Materijal za sedmicu ${index + 1}`}
                    />
                  </ListItem>
                </List>
              </Collapse>
            </div>
          ))}
        </List>
      </Container>
    </>
  );
}
