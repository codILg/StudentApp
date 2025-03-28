import { Box, AvatarGroup, Avatar, Typography } from "@mui/material";
import { ProfessorsCourse } from "../../../app/models/course";
import { Link } from "react-router-dom";

interface AuthorProps {
  authors: ProfessorsCourse[];
}

export function Author({ authors }: AuthorProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 1,
        alignItems: "center",
      }}
    >
      <AvatarGroup max={5}>
        {authors.map((author, index) => (
          <Avatar
            key={index}
            alt={author.user.firstName}
            sx={{ width: 24, height: 24, backgroundColor: "text.primary" }}
          >
            {author.user.firstName.charAt(0).toUpperCase()}
          </Avatar>
        ))}
      </AvatarGroup>
      <Box sx={{ margin: 0, padding: 0 }}>
        {
          authors.map((author, index) => (
            <Box key={index} sx={{ margin: 0, padding: 0, display: "inline" }}>
              <Typography
                variant="body2"
                component={Link}
                to={`/professorInfo/${author.user.id}`}
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                  fontWeight: "normal",
                  fontSize: "clamp(5pt, 9pt, 12pt)",
                  "&:hover": {
                    color: "primary.main",
                    cursor: "pointer",
                    fontWeight: "bold",
                  },
                }}
              >
                {author.user.firstName} {author.user.lastName}
              </Typography>
              {index < authors.length - 1 && <span>,</span>}{" "}
            </Box>
          ))
        }
      </Box>
    </Box>
  );
}
