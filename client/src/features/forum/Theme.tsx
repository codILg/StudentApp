import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import NotFound from "../../app/errors/NotFound";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { MentionsInput, Mention } from "react-mentions";
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Popover,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  createMessage,
  deleteMessageAsync,
  fetchMessagesAsync,
} from "./messageSlice";
import { useEffect, useRef, useState } from "react";
import {
  deleteThemeAsync,
  fetchThemeByIdAsync,
  updateThemeStatus,
} from "./themeSlice";
import { Author } from "../onlineStudy/components/Author";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BlockIcon from "@mui/icons-material/Block";
import React from "react";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ChatTwoToneIcon from "@mui/icons-material/ChatTwoTone";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { Message } from "../../app/models/theme";
import { Theme as ThemeMod } from "../../app/models/theme";

import "./themeStyle.css";
import { borderRadius } from "@mui/system";
import Unauthorized from "../../app/errors/Unauthorized";
import { LoadingButton } from "@mui/lab";

export default function Theme() {
  const navigate = useNavigate();
  const status = useAppSelector((state) => state.theme.status);
  const statusMessage = useAppSelector((state) => state.message.status);

  // const open = Boolean(anchorEl);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [selectedMessage, sestSelectedMessage] = useState<Message>();

  const handleDeleteMessage = (
    // event: React.MouseEvent<HTMLElement>,
    message: Message
  ) => {
    // console.log(courseSelected);
    // setCourseSelected(course);
    sestSelectedMessage(message);
    setOpenMessageDialog(true);
  };
  const handleCloseMessageDialog = () => {
    sestSelectedMessage(undefined);
    setOpenMessageDialog(false);
    // setAnchorEl(null);
  };

  const handleConfirmDeleteMessage = async () => {
    try {
      console.log(selectedMessage);
      if (selectedMessage)
        await dispatch(deleteMessageAsync(selectedMessage.id!));
      setOpenMessageDialog(false);

      // await dispatch(fetchMessagesAsync(parseInt(id!)));
    } catch (error) {
      console.error("Greška prilikom brisanja poruke:", error);
    }
  };

  const { id } = useParams<{ id: string }>(); // Osigurava da je `id` uvek string
  // const themes = useAppSelector((state) => state.theme.themes);
  const { user } = useAppSelector((state) => state.account);
  const messages = useAppSelector(
    (state) => state.message.messages![parseInt(id!)]
  );

  const messagesLoaded = useAppSelector(
    (state) => state.message.messagesLoaded
  );

  const uniqueUsers = Array.from(
    new Map(
      messages?.map((message) => [message.user?.id, message.user])
    ).values()
  );

  const mentionUsers = uniqueUsers
    ?.filter((user) => user?.username) // Filtriramo korisnike koji imaju username
    .map((user) => ({
      id: String(user?.id), // Pretvaramo ID u string
      display: String(user?.username), // Pretvaramo username u string
    }));

  // mentionUsers.map((m) => console.log({ ...m }));
  // console.log({ ...mentionUsers });

  const [messageContent, setMessageContent] = useState("");
  const dispatch = useAppDispatch();

  // const theme = themes!.find((i) => i.id === parseInt(id!));
  const theme = useAppSelector((state) => state.theme.currentTheme);

  const themeLoaded = useAppSelector((state) => state.theme.currentThemeLoaded);
  useEffect(() => {
    dispatch(fetchThemeByIdAsync(parseInt(id!)));
  }, [dispatch]);

  const topOfPageRef = useRef<HTMLDivElement>(null);
  const bottomOfPageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    console.log(theme);
    if (theme != null && themeLoaded) {
      // Fetch podataka
      dispatch(fetchMessagesAsync(parseInt(id!))).then(() => {
        // Skrolovanje stranice na vrh
        if (topOfPageRef.current) {
          window.scrollTo({ top: 0, behavior: "instant" });
          console.log("Stranica skrolovana na vrh");
        }
      });
    }
  }, [id, theme, dispatch]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const idMenu = open ? "simple-popover" : undefined;
  const [loadingStatus, setLoadingStatus] = React.useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget); // Postavlja element na koji je kliknuto
    console.log(anchorEl);
  };

  const updateStatus = async (
    event: React.MouseEvent<HTMLElement>,
    theme: ThemeMod
  ) => {
    event.preventDefault(); // Sprečava osvežavanje stranice

    setLoadingStatus(true); // Postavi loading za određenu temu

    const updateData = {
      id: theme.id,
      active: !theme.active,
    };

    try {
      await dispatch(updateThemeStatus(updateData));
    } catch (error) {
      console.error("Greška prilikom ažuriranja statusa:", error);
    } finally {
      setLoadingStatus(false); // Isključi loading nakon završetka
    }
  };

  const handleDeleteClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteThemeAsync(theme!.id));
      navigate("/themes?type=all");
    } catch (error) {
      console.error("Greška prilikom brisanja teme:", error);
    } finally {
      setAnchorEl(null); // Zatvara meni
      setOpenDialog(false);
    }
  };

  const handleClose = () => {
    setAnchorEl(null); // Zatvara Popover
  };

  if (id == undefined) return <NotFound />;

  if (status === "rejectedUnauthorized") {
    return <Unauthorized />;
  }

  // Ako kurs ne postoji, proveravamo status
  if (!theme) {
    if (status === "rejectedNotFound") {
      return <NotFound />;
    }

    // Pazimo da ne prikažemo LoadingComponent ako je status već bio unauthorized
    return <LoadingComponent message="Učitavanje teme..." />;
  }

  return (
    <>
      {id === undefined ? (
        <NotFound />
      ) : status === "rejectedUnauthorized" ? (
        <Unauthorized />
      ) : !theme ? (
        status === "rejectedNotFound" ? (
          <NotFound />
        ) : (
          <LoadingComponent message="Učitavanje teme..." />
        )
      ) : (
        <>
          <div ref={topOfPageRef}></div>

          <Grid
            container
            sx={{
              display: "flex",
              direction: "column",
              margin: 0,
              paddingX: 10,
              paddingY: 3,
            }}
          >
            <Grid
              container
              sx={{
                direction: "row",
                display: "flex",
                margin: 0,
                justifyContent: "space-around",
                boxSizing: "border-box",
              }}
            >
              <Grid item xs={12} sx={{ marginBottom: 2 }}>
                {" "}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Breadcrumbs
                    //size="small"
                    aria-label="breadcrumbs"
                    separator={<ChevronRightRoundedIcon fontSize="small" />}
                    sx={{ pl: 0 }}
                  >
                    <Box
                      component={Link}
                      to="/onlineStudy"
                      sx={{ display: "flex", alignItems: "center" }}
                      // onClick={() => dispatch(resetCoursesParams())}
                      onClick={() => navigate(-1)}
                    >
                      <ChatTwoToneIcon
                        sx={{
                          color: "text.secondary",
                          // fontWeight: "bold",
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.2)",
                            color: "primary.main", // Promijeni boju na hover
                          },
                        }}
                      />
                    </Box>

                    {/* </Link> */}
                    <Typography
                      component={Typography}
                      color="neutral"
                      sx={{
                        fontSize: 12,
                        fontWeight: 500,
                        "&:hover": {
                          color: "primary.dark", // Promijeni boju na hover
                        },
                        fontFamily: "Raleway, sans-serif",
                      }}
                    >
                      Tema
                    </Typography>
                  </Breadcrumbs>
                </Box>
              </Grid>
              <Grid item xs={6} sx={{ padding: 1 }}>
                <CardContent
                  sx={{
                    border: "1px solid",
                    borderRadius: "20px",
                    borderColor: "primary.main",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    padding: 0,
                    pt: 3,
                    px: 2,
                  }}
                >
                  <Grid container sx={{ padding: 0 }}>
                    <Grid item sx={{ padding: 0 }}>
                      <Avatar
                        alt={theme.title}
                        sx={{
                          width: 56,
                          height: 56,
                          backgroundColor: "text.primary",
                          mr: 2,
                          padding: 0,
                        }}
                      >
                        <Box sx={{ fontSize: "25pt" }}>
                          {theme.title.charAt(0).toUpperCase()}
                        </Box>
                      </Avatar>
                    </Grid>
                    <Grid item xs>
                      <Grid
                        gap={2}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="h5" fontWeight="bold">
                          {theme.title}
                        </Typography>

                        <Chip
                          // variant="soft"
                          size="small"
                          icon={
                            // {
                            //   true: <CheckRoundedIcon />,
                            //   false: <BlockIcon />,
                            // }[theme.active]
                            loadingStatus ? (
                              <CircularProgress
                                size={16}
                                sx={{ color: "#fff" }}
                              />
                            ) : theme.active ? (
                              <CheckRoundedIcon />
                            ) : (
                              <BlockIcon />
                            )
                          }
                          sx={{
                            backgroundColor: loadingStatus
                              ? "grey" // Boja dok traje učitavanje
                              : theme.active
                                ? "text.primaryChannel"
                                : "text.secondaryChannel", // Prilagođene boje
                            color: "#fff", // Tekst u beloj boji
                            borderRadius: "16px", // Primer prilagođenog oblika
                            ".MuiChip-icon": {
                              color: "#fff",
                            },
                          }}
                          // label={theme.active ? "Aktivno" : "Zatvoreno"}
                          label={
                            loadingStatus
                              ? "Ažuriranje..."
                              : theme.active
                                ? "Aktivno"
                                : "Zatvoreno"
                          }
                        />
                        {user && user.username == theme.user?.username ? (
                          <>
                            <div>
                              <Box
                                aria-describedby={idMenu}
                                // variant="contained"
                                onClick={handleClick}
                                sx={{
                                  display: "flex",
                                  width: "fit-content",
                                  padding: 0,
                                  "&:hover": {
                                    cursor: "pointer",
                                  },
                                }}
                              >
                                <MoreVertIcon />
                              </Box>
                              <Popover
                                id={idMenu}
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{
                                  vertical: "bottom",
                                  horizontal: "center",
                                }}
                                slotProps={{
                                  paper: {
                                    sx: {
                                      borderRadius: "10pt",
                                      "&:hover": {
                                        cursor: "pointer",
                                      },
                                    },
                                  },
                                }}
                              >
                                <Typography
                                  onClick={(event) =>
                                    updateStatus(event, theme)
                                  }
                                  variant="body2"
                                  sx={{
                                    paddingX: 2,
                                    paddingY: 1,
                                    "&:hover": {
                                      cursor: "pointer",
                                      color: "primary.light",
                                    },
                                    fontFamily: "Raleway, sans-serif",
                                    color: "text.primary",
                                    backgroundColor: "background.paper",
                                  }}
                                >
                                  {theme.active ? "Zaključaj" : "Otključaj"}
                                </Typography>
                                <Typography
                                  onClick={handleDeleteClick} // Otvara dijalog
                                  variant="body2"
                                  sx={{
                                    paddingX: 2,
                                    paddingY: 1,
                                    "&:hover": {
                                      cursor: "pointer",
                                      color: "primary.light",
                                    },
                                    fontFamily: "Raleway, sans-serif",
                                    color: "text.secondaryChannel",
                                    backgroundColor: "background.paper",
                                  }}
                                >
                                  Obriši
                                </Typography>
                              </Popover>
                              <Dialog
                                open={openDialog}
                                onClose={handleCloseDialog}
                                sx={{
                                  "& .MuiDialog-paper": {
                                    borderRadius: "12pt",
                                    padding: 3,
                                    minWidth: 300,
                                    textAlign: "center",
                                  },
                                }}
                              >
                                <DialogTitle
                                  sx={{
                                    fontFamily: "Raleway, sans-serif",
                                    fontSize: "1.2rem",
                                  }}
                                >
                                  Potvrda brisanja
                                </DialogTitle>
                                <DialogContent>
                                  <Typography
                                    sx={{
                                      fontFamily: "Raleway, sans-serif",
                                      color: "text.secondary",
                                    }}
                                  >
                                    Da li ste sigurni da želite da obrišete ovu
                                    temu?
                                  </Typography>
                                </DialogContent>
                                <DialogActions
                                  sx={{ justifyContent: "center", gap: 2 }}
                                >
                                  <Button
                                    onClick={handleCloseDialog}
                                    sx={{ color: "text.primary" }}
                                  >
                                    Odustani
                                  </Button>
                                  <LoadingButton
                                  loading={status=="pendingDeleteTheme"}
                                    onClick={handleConfirmDelete}
                                    color="error"
                                    variant="contained"
                                    loadingIndicator={
                                      <CircularProgress size={18} sx={{ color: "white" }} /> // Ovdje mijenjaš boju
                                    }
                                  >
                                    Obriši
                                  </LoadingButton>
                                </DialogActions>
                              </Dialog>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                      </Grid>
                      <Typography variant="body2" color="text.secondary">
                        {theme.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {`Objavljeno: ${new Date(theme.date).toLocaleDateString("sr-RS")}`}{" "}
                      </Typography>
                      <br />
                      {theme.user ? (
                        <Typography variant="caption" color="text.secondary">
                          Autor:{" "}
                          <b>
                            {theme.user?.firstName} {theme.user?.lastName}
                          </b>
                        </Typography>
                      ) : (
                        <Typography
                          variant="caption"
                          sx={{
                            color: "gray",
                            textDecoration: "none",
                            fontSize: "10pt",
                            // fontWeight: "normal",
                          }}
                        >
                          Autor: <b>[Obrisan korisnik]</b>
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Grid>

              {theme.course && <Divider sx={{ marginY: 2 }} />}
              <Grid item xs={6} sx={{ padding: 1 }}>
                {theme.course ? (
                  <CardContent
                    sx={{
                      border: "1px solid",
                      borderRadius: "20px",
                      borderColor: "primary.main",
                      height: "100%",
                      padding: 0,
                      pt: 3,
                      px: 2,
                    }}
                  >
                    <Typography
                      variant="button"
                      sx={{ fontSize: "8pt", fontWeight: "bold" }}
                    >
                      Kurs
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {theme.course.name}{" "}
                      <Box
                        component="span"
                        sx={{
                          mx: 1,
                          my: 0,
                          display: "inline-flex",
                          alignItems: "center",
                          fontSize: "18pt",
                          color: "action.disabled",
                        }}
                      >
                        {" "}
                        |{" "}
                      </Box>
                      {theme.course.year.name}{" "}
                      <Box
                        component="span"
                        sx={{
                          mx: 1,
                          my: 0,
                          display: "inline-flex",
                          alignItems: "center",
                          fontSize: "18pt",
                          color: "action.disabled",
                        }}
                      >
                        |{" "}
                      </Box>{" "}
                      {theme.course.studyProgram.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ marginBottom: 1 }}
                    >
                      {theme.course.description}
                    </Typography>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Profesori:
                      </Typography>
                      <Box
                        key="index"
                        sx={{ display: "flex", flexDirection: "row" }}
                      >
                        {/* <Avatar
                      key={index}
                      alt={professor.user.firstName}
                      // src={author.avatar}
                      sx={{
                        width: 23,
                        height: 23,
                        backgroundColor: "text.primary",
                        mr: 1,
                      }}
                    >
                      {professor.user.firstName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography>
                      {professor.user.firstName}&nbsp;
                      {professor.user.lastName}
                    </Typography> */}
                        <Author authors={theme.course.professorsCourse} />
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ marginTop: 2 }}
                      // onClick={() =>
                      //   (window.location.href = `/courses/${theme.course.id}`)
                      // }
                      component={Link}
                      to={`/courses/${theme.course.id}`}
                    >
                      Idi na kurs
                    </Button>
                  </CardContent>
                ) : (
                  <CardContent
                    sx={{
                      border: "1px solid",
                      borderRadius: "20px",
                      borderColor: "primary.main",
                      height: "100%",
                      padding: 0,
                      pt: 3,
                      px: 2,
                    }}
                  >
                    <Typography
                      variant="button"
                      sx={{ fontSize: "10pt", fontWeight: "bold" }}
                    >
                      Kategorija
                    </Typography>
                    <Divider />
                    <Typography
                      variant="body1"
                      sx={{ mt: 2, fontSize: "16pt" }}
                    >
                      Slobodna tema
                    </Typography>{" "}
                  </CardContent>
                )}
              </Grid>
            </Grid>
            <Grid
              container
              sx={{
                direction: "column",
                display: "flex",
                margin: 0,
                justifyContent: "space-around",
                boxSizing: "border-box",
                padding: 1,
                mt: 2,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  display: "block",
                  fontFamily: "Raleway, sans-serif",
                  width: "100%",
                }}
              >
                Poruke
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  paddingY: 1,
                  color: "action.disabled",
                  display: "block",
                  fontFamily: "Raleway, sans-serif",
                  width: "100%",
                }}
              >
                {theme.active ? "" : "Zatvorena tema"}
              </Typography>

              <Grid
                item
                xs={12}
                sx={{
                  boxSizing: "border-box",
                  border: "1px solid",
                  borderColor: theme.active
                    ? "primary.main"
                    : "action.disabled",
                  borderRadius: "20px",
                  position: "relative",
                  margin: 0,

                  padding: 0,
                  mb: 2,
                }}
              >
                {!messagesLoaded ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "80vh",
                      width: "100%",
                      margin: 0,
                      padding: 1,
                    }}
                  >
                    <CircularProgress
                      size={120}
                      sx={{ color: "text.secondary" }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      // margin: "0 16px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      overflow: "auto",
                      height: "80vh",
                      width: "100%",
                      margin: 0,
                      padding: 1,

                      "&::-webkit-scrollbar": {
                        width: "8px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "primary.main", // Boja skrola
                        borderRadius: "8px",
                      },
                      "&::-webkit-scrollbar-thumb:hover": {
                        backgroundColor: "primary.dark", // Boja hvataljke na hover
                      },
                      "&::-webkit-scrollbar-track": {
                        backgroundColor: "transparent", // Prozirna pozadina skrola
                      },
                    }}
                  >
                    <Box
                      sx={{
                        // listStyleType: "none",
                        //padding: 5, // Širi prozor za poruke
                        padding: 0,
                        px: 2,
                        overflow: "auto",
                        "&::-webkit-scrollbar": {
                          width: "8px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "primary.main", // Boja skrola
                          borderRadius: "8px",
                        },
                        "&::-webkit-scrollbar-thumb:hover": {
                          backgroundColor: "primary.light", // Boja hvataljke na hover
                        },
                        "&::-webkit-scrollbar-track": {
                          backgroundColor: "transparent", // Prozirna pozadina skrola
                        },
                      }}
                    >
                      {messages && messages.length > 0 ? (
                        messages.map((message, index) => (
                          <Box
                            key={index} // Dodaj ključ da izbegneš React grešku
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent:
                                message.user?.email === user?.email
                                  ? "flex-end"
                                  : "flex-start", // Poravnanje poruka
                              marginBottom: 2,
                            }}
                          >
                            <Box
                              sx={{
                                backgroundColor:
                                  message.user?.email === user?.email
                                    ? "common.background"
                                    : "common.onBackground",
                                padding: 2,
                                borderRadius: 2,
                                maxWidth: "70%", // Ograniči širinu poruke
                              }}
                            >
                              <Stack direction="row" alignItems="center">
                                {/* {message.user.email !== user?.email && ( // Avatar samo za druge korisnike */}
                                <Avatar
                                  sx={{
                                    marginRight: 2,
                                    backgroundColor: "common.backgroundChannel",
                                  }}
                                />
                                {/* )} */}
                                <Box sx={{ width: "100vw" }}>
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight={
                                      message.user?.email === user?.email
                                        ? "bold"
                                        : "normal"
                                    }
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      color: "common.white",
                                    }}
                                  >
                                    <span>
                                      {message.user ? (
                                        `${message.user?.firstName} ${message.user?.lastName}`
                                      ) : (
                                        <span style={{ fontStyle: "italic" }}>
                                          [Obrisan korisnik]
                                        </span>
                                      )}
                                      {theme.user?.email ===
                                        message.user?.email && (
                                        <span
                                          style={{
                                            color: "primary.main",
                                            marginLeft: "8px",
                                          }}
                                        >
                                          &#9733;{" "}
                                          <Typography
                                            variant="button"
                                            fontSize={10}
                                            component="span"
                                          >
                                            autor
                                          </Typography>
                                        </span>
                                      )}
                                    </span>

                                    <span
                                      style={{
                                        fontSize: "12px",
                                        color: "common.black",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-end",
                                      }}
                                    >
                                      <Typography variant="caption">
                                        {new Date(
                                          message.creationDate
                                        ).toLocaleTimeString("sr-RS", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          second: "2-digit",
                                        })}{" "}
                                        {new Date(
                                          message.creationDate
                                        ).toLocaleDateString("sr-RS", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "numeric",
                                        })}
                                      </Typography>
                                    </span>
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.primary"
                                    sx={{ textAlign: "left" }}
                                  >
                                    {message.content}
                                  </Typography>
                                  {user && user.email == message.user?.email ? (
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                      }}
                                    >
                                      <Box
                                        aria-describedby={idMenu}
                                        // variant="contained"
                                        onClick={() =>
                                          handleDeleteMessage(message)
                                        }
                                        sx={{
                                          display: "flex",
                                          width: "fit-content",
                                          borderRadius: "20pt",
                                          padding: 0,
                                          color: "text.disabled",
                                          "&:hover": {
                                            cursor: "pointer",
                                            color: "text.primary",
                                          },
                                        }}
                                      >
                                        <DeleteOutlineOutlinedIcon
                                          sx={{ fontSize: "16pt" }}
                                        />
                                      </Box>
                                      {/* <Popover
                                  id={idMenu}
                                  open={open}
                                  anchorEl={anchorEl}
                                  onClose={handleClose}
                                  anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "center",
                                  }}
                                  slotProps={{
                                    paper: {
                                      sx: {
                                        borderRadius: "10pt",
                                        "&:hover": {
                                          cursor: "pointer",
                                        },
                                      },
                                    },
                                  }}
                                >
                                  <Typography
                                    onClick={handleDeleteClick}
                                    variant="body2"
                                    sx={{
                                      paddingX: 2,
                                      paddingY: 1,
                                      "&:hover": {
                                        cursor: "pointer",
                                        color: "primary.light",
                                      },
                                      fontFamily: "Raleway, sans-serif",
                                      color: "text.secondaryChannel",
                                      backgroundColor: "background.paper",
                                    }}
                                  >
                                    Obriši kurs
                                  </Typography>
                                </Popover> */}
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </Box>
                              </Stack>
                            </Box>
                          </Box>
                        ))
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 2,
                            textAlign: "center",
                            fontSize: "12pt",
                            fontFamily: "Raleway, sans-serif",
                          }}
                        >
                          {theme.active
                            ? user
                              ? "Započnite razgovor."
                              : "Prijavite se da započnete razgovor."
                            : "Zatvorena tema"}
                        </Typography>
                      )}
                      <div ref={bottomOfPageRef}></div>
                    </Box>
                  </Box>
                )}

                {user && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "auto", // Gura input na dno
                      padding: 2,
                      // position: "sticky", // Dodajte ovo za "zalijepljeni" efekat
                      bottom: 0, // Zalijepite dno
                      width: "100%",
                      backgroundColor: "background.paper",
                      borderRadius: "0 0 20px 20px",
                      justifyContent: "space-around",
                    }}
                  >
                    {/* <TextField
                  fullWidth
                  disabled={!theme.active}
                  placeholder={
                    theme.active
                      ? "Unesite poruku..."
                      : "Nije moguće slati poruke na zatvorenoj temi"
                  }
                  variant="outlined"
                  size="small"
                  sx={{ marginRight: 2 }}
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                /> */}
                    <MentionsInput
                      className="ssky-mention-input"
                      value={messageContent}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        let newValue = e.target.value;
                        const regex = /@\[([a-zA-Z0-9_]+)\]\(\d+\)/g;
                        newValue = newValue.replace(regex, "@$1");
                        console.log(newValue);
                        setMessageContent(newValue);
                      }}
                      style={{
                        width: "92%",
                        maxWidth: "92%",
                        minHeight: "40px",
                        padding: "10px", // Veći padding gura placeholder dole
                        display: "block",
                        lineHeight: "20px", // Podesi prema minHeight da placeholder bude centriran
                      }}
                      placeholder={
                        theme.active
                          ? "Unesite poruku..."
                          : "Nije moguće slati poruke na zatvorenoj temi"
                      }
                    >
                      <Mention
                        trigger="@"
                        data={mentionUsers}
                        displayTransform={(id: string, display: string) =>
                          "@" + display.toString()
                        }
                      />
                    </MentionsInput>

                    <LoadingButton
                      loading={statusMessage == "pendingCreateMessage"}
                      variant="contained"
                      disabled={!theme.active || messageContent == ""}
                      loadingIndicator={
                        <CircularProgress size={24} sx={{ color: "white" }} /> // Ovdje mijenjaš boju
                      }
                      sx={{
                        textTransform: "none",
                        color: "primary.main",
                        backgroundColor: "primary.dark",
                        "&:hover": {
                          color: "primary.dark",
                          backgroundColor: "primary.main",
                        },
                      }}
                      onClick={() => {
                        const localDate = new Date();
                        const offset = localDate.getTimezoneOffset();

                        const adjustedDate = new Date(
                          localDate.getTime() - offset * 60000
                        );

                        const newMessage = {
                          content: messageContent,
                          themeId: theme.id,
                          creationDate: adjustedDate.toISOString(),
                          user: user!,
                        };
                        dispatch(createMessage(newMessage));
                        //PROVJERITI STO NE RADI
                        if (bottomOfPageRef.current) {
                          bottomOfPageRef.current.scrollIntoView({
                            behavior: "instant",
                            block: "start",
                          });
                        }
                        setMessageContent("");
                      }}
                    >
                      Pošalji
                    </LoadingButton>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Dialog
            open={openMessageDialog}
            onClose={handleCloseMessageDialog}
            sx={{
              "& .MuiDialog-paper": {
                borderRadius: "12pt",
                padding: 3,
                minWidth: 300,
                textAlign: "center",
              },
            }}
          >
            <DialogTitle
              sx={{
                fontFamily: "Raleway, sans-serif",
                fontSize: "1.2rem",
              }}
            >
              Potvrda brisanja
            </DialogTitle>
            <DialogContent>
              <Typography
                sx={{
                  fontFamily: "Raleway, sans-serif",
                  color: "text.secondary",
                }}
              >
                Da li ste sigurni da želite da obrišete poruku?
              </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
              <Button
                onClick={handleCloseMessageDialog}
                sx={{ color: "text.primary" }}
              >
                Odustani
              </Button>
              <LoadingButton
              loading={statusMessage=="pendingDeleteMessage"}
                onClick={handleConfirmDeleteMessage}
                color="error"
                variant="contained"
                loadingIndicator={
                  <CircularProgress size={18} sx={{ color: "white" }} /> // Ovdje mijenjaš boju
                }
              >
                Obriši
              </LoadingButton>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
}
