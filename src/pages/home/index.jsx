import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Input,
  Button,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect } from "react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6a1b9a",
    },
    background: {
      default: "#ffffff",
    },
  },
});

const validationSchema = yup.object({
  website: yup
    .string()
    .url("Please enter a valid website link")
    .required("This field is required"),
});

const CardGrid = () => {
  const [wordCount, setWordCount] = React.useState(0);
  const [websites, setWebSites] = React.useState([]);

  useEffect(()=>{
    loadAll()
  },[])
  const loadAll = async () => {
    try {
        const response = await axios.get(`http://localhost:3009/websites`, {
        });
       
        setWebSites(response.data)
      } catch (error) {
        console.error(error);
      }
  }
  const formik = useFormik({
    initialValues: {
      website: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(`http://localhost:3009/websites`, {
          url: values.website,
        });

        setWordCount(response.data.wordCount);
        loadAll()
      } catch (error) {
        console.error(error);
      }
    },
  });

  const handleDelete = async (values) => {
    try {
      await axios.delete(`http://localhost:3009/websites/${values.id}`, {
      });
      loadAll()
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "url", headerName: "Website", width: 450 },
    { field: "wordCount", headerName: "Web Count", width: 100 },
    { field: "createdAt", headerName: "Created At", width: 100 },
    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      renderCell: (params) => (
        <IconButton
          aria-label="delete"
          onClick={() => handleDelete(params.row)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];
  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Word Count
          </Typography>
        </Toolbar>
      </AppBar>
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ backgroundColor: "#f3e5f5" }}>
              <CardContent>
                <h2>Insert Website Link</h2>
                <form onSubmit={formik.handleSubmit}>
                  <Input
                    id="website"
                    name="website"
                    placeholder="Enter website link"
                    fullWidth
                    value={formik.values.website}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.website && Boolean(formik.errors.website)
                    }
                  />
                  {formik.touched.website && formik.errors.website ? (
                    <Typography sx={{ color: "red" }}>
                      {formik.errors.website}
                    </Typography>
                  ) : null}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: "1rem" }}
                  >
                    Submit
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ backgroundColor: "#f3e5f5" }}>
              <CardContent>
                <h2>Word Count</h2>
                <Typography>Word Count: {wordCount}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Card sx={{ backgroundColor: "#f3e5f5" }}>
              <CardContent>
                <h2>Table Data</h2>
                <div style={{ height: 400, width: "100%" }}>
                  <DataGrid
                    rows={websites}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                  />
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default CardGrid;
