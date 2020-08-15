import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import LanguageIcon from '@material-ui/icons/Language';
// core components
import Header from "components/Header/Header.js";
// import HeaderLinks from "components/Header/HeaderLinks.js";
// import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import "react-table/react-table.css";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import styles from "assets/jss/material-kit-react/views/loginPage.js";
import image from "assets/img/bg7.jpg";
import { getOS, getData, insertData, deleteData } from "../../api/api";
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import { toast } from 'react-toastify';
import { withCookies } from 'react-cookie';
import ReactTable from "react-table";
import moment from "moment";
import Switch from "react-switch";
const useStyles = makeStyles(styles);
let filter = {}
function LoginPage(props) {

  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  const [datepicker, setDatepicker] = React.useState(moment().format("L"));
  const [country, setCountry] = React.useState("");
  const [countryErr, setCountryErr] = React.useState(false);
  const [state, setState] = React.useState("");
  const [stateErr, setStateErr] = React.useState(false);
  const [cases, setCases] = React.useState(0);
  const [casesErr, setCasesErr] = React.useState(false);
  const [deaths, setDeaths] = React.useState(0);
  const [deathsErr, setDeathsErr] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [date, setDate] = React.useState(null)
  const [os, setOs] = React.useState("")
  const [release, setRelease] = React.useState("")
  const [switchS, setSwitchS] = React.useState(true)

  setTimeout(function () {
    setCardAnimation("");
  }, 700);
  const getOs = () => {
    getOS()
      .then(res => {
        setOs(res.data.OS)
        setRelease(res.data.Release)
      })
      .catch(err => console.log(err))
  }
  const getdata = (obj) => {
    setLoading(true)
    getData(obj)
      .then(res => {
        setData(res.data.response)
        setLoading(false)
      })
      .catch(err => console.log(err))
  }
  React.useEffect(() => {
    getOs()

  }, [])
  let records = data && data.length ?
    data.map((item) => {
      return {
        _id: item._id,
        country: item.country,
        state: item.state,
        date: item.date,
        cases: item.cases,
        deaths: item.deaths
      }
    })
    : []
  React.useEffect(() => onFetch({}), [date])
  const validate = () => {
    if (!country) {
      setCountryErr(true)
      return false
    }
    if (!state) {
      setStateErr(true)
      return false
    }
    if (typeof deaths !== "number") {
      setDeathsErr(true)
      return false
    }
    if (typeof cases !== "number") {
      setCasesErr(true)
      return false
    }

    return true;
  }
  const Submit = () => {
    if (!validate()) return
    let obj = {
      country,
      state,
      cases,
      deaths,
      date: datepicker
    }

    insertData(obj).then(async (res) => {
      if (res.data) {
        notify(res.data)
        getdata({
          country: "",
          state: "",
          deaths: "",
          date: "",
          cases: ""

        })
      }
    })
  }
  const classes = useStyles();
  const notify = (text) => {
    toast.success(text, {
      position: toast.POSITION.TOP_CENTER
    });
  };
  const remove = (id) => {
    deleteData(id).then(res => {
      if (res.data) {
        notify(res.data)
        getdata({
          country: "",
          state: "",
          deaths: "",
          date: "",
          cases: ""
        })
      }
    })
  }
  const columns = [
    {
      Header: "Country",
      accessor: "country",
      filterable: true
    },
    {
      Header: "State",
      accessor: "state",
      filterable: true,
      width: 190
    },
    {
      Header: "Date",
      accessor: "date",
      Cell: props => (
        <div>{moment(props.original.date).format("L").toString()}</div>
      ),
      filterable: true,
      Filter: ({ filter, onChange }) => {
        return (
          <TextField
            id="date"
            style={{ width: "100%" }}
            type="date"
            defaultValue={moment().format("L").toString()}
            value={date}
            className={classes.textField}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        );
      },
      width: 190
    },
    {
      Header: "Cases",
      accessor: "cases",
      width: 100
    },
    {
      Header: "Deaths",
      accessor: "deaths",
      width: 100
    },
    {
      Header: "Remove",
      Cell: props => (
        <Switch
          onChange={() => {
            setSwitchS(false)
            remove(props.original._id)
          }}
          checked={switchS}
          className="react-switch"
        />
      )

    },
  ];

  const onFetch = (state) => {
    filter.country = ""
    filter.state = ""
    filter.date = date ? date : ""


    if (state.filtered) {
      state.filtered.forEach((f) => {
        filter[f.id] = f.value;
      });
    };
    getdata(filter)
  }
  const { ...rest } = props;
  return (
    <div>
      <Header
        absolute
        color="transparent"
        brand={`OS:${os} Release:${release}`}
        {...rest}
      />
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: "url(" + image + ")",
          backgroundSize: "cover",
          backgroundPosition: "top center"
        }}
      >
        <div className={classes.container}>
          <GridContainer justify="flex-start">
            <GridItem xs={12} sm={12} md={4}>

              <Card className={classes[cardAnimaton]}>

                <form className={classes.form}>
                  <CardHeader color="primary" className={classes.cardHeader}>
                    <h4>Data Entry Form</h4>
                  </CardHeader>
                  <CardBody>

                    <CustomInput
                      labelText="Country"
                      id="country"
                      onChange={(e) => setCountry(e.target.value)}
                      value={country}
                      error={countryErr}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",

                        endAdornment: (
                          <InputAdornment position="end">
                            <LanguageIcon className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }}
                    />
                    <CustomInput
                      labelText="State"
                      id="state"
                      onChange={(e) => setState(e.target.value)}
                      value={state}
                      error={stateErr}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",

                        endAdornment: (
                          <InputAdornment position="end">
                            <LocationCityIcon className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }}
                    />
                    <CustomInput
                      labelText="Cases"
                      id="cases"
                      onChange={(e) => setCases(+e.target.value)}
                      value={cases}
                      error={casesErr}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "number",

                        endAdornment: (
                          <InputAdornment position="end">
                            <SupervisorAccountIcon className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }}
                    />
                    <CustomInput
                      labelText="Deaths"
                      id="deaths"
                      onChange={(e) => setDeaths(+e.target.value)}
                      value={deaths}
                      error={deathsErr}
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{

                        type: "number",
                        endAdornment: (
                          <InputAdornment position="end">
                            <SupervisorAccountIcon className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }}
                    />
                    <TextField
                      id="date"
                      label="Date"
                      style={{ width: "100%" }}
                      type="date"
                      defaultValue={datepicker}
                      value={datepicker}
                      onChange={(e) => setDatepicker(e.target.value)}
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    <Button onClick={() => Submit()} color="primary" size="lg">
                      Create Record
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={8}>
              <Card className={classes[cardAnimaton]}>
                <form className={classes.form}>
                  <CardHeader color="primary" className={classes.cardHeader}>
                    <h4>Data Table</h4>
                  </CardHeader>
                  <CardBody>

                    <ReactTable
                      data={records}
                      columns={columns}
                      loading={loading}
                      // onFetchData={onFetch}
                      defaultPageSize={10}
                      className="-striped -highlight"
                    ></ReactTable>

                  </CardBody>
                </form>
              </Card>
            </GridItem>
          </GridContainer>

        </div>
        {/* <Footer whiteFont /> */}
      </div>
    </div>
  );
}
export default withCookies(LoginPage)
