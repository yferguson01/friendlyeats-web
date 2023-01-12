import React from "react";
import { useFirestore, useSigninCheck } from "reactfire";
import {
  addRestaurant,
  getAllRestaurants,
  getRandomItem,
} from "../services/FirestoreService";
import { DocumentData } from "firebase/firestore";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import { CardActionArea, Rating } from "@mui/material";
import { signIn, signOut } from "../services/AuthService";
import { useNavigate } from "react-router-dom";

function Home() {
  const firestore = useFirestore();
  const { status, restaurants } = getAllRestaurants(firestore);
  let navigate = useNavigate();

  function addMockRestaurants() {
    var promises = [];

    for (var i = 0; i < 20; i++) {
      var name = getRandomItem(data.words) + " " + getRandomItem(data.words);
      var category = getRandomItem(data.categories);
      var city = getRandomItem(data.cities);
      var price = Math.floor(Math.random() * 4) + 1;
      var photoID = Math.floor(Math.random() * 22) + 1;
      var photo =
        "https://storage.googleapis.com/firestorequickstarts.appspot.com/food_" +
        photoID +
        ".png";
      var numRatings = 0;
      var avgRating = 0;

      var promise = addRestaurant(
        {
          name: name,
          category: category,
          price: price,
          city: city,
          numRatings: numRatings,
          avgRating: avgRating,
          photo: photo,
        },
        firestore
      );

      if (!promise) {
        alert("addRestaurant() is not implemented yet!");
        return Promise.reject();
      } else {
        promises.push(promise);
      }
    }

    return Promise.all(promises);
  }

  return (
    <React.Fragment>
      <div className="template" id="header-base">
        {Header()}
      </div>
      {status == "loading" || restaurants.length == 0 ? (
        <div className="template" id="no-restaurants">
          <div id="guy-container" className="mdc-toolbar-fixed-adjust">
            <img className="guy" src="/src/images/guy_fireats.png" />
            <div className="text">
              This app is connected to the Firebase project "
              <b data-fir-content="projectId"></b>".
              <br />
              <br />
              Your Cloud Firestore has no documents in <b>/restaurants/</b>.
            </div>
            <br />

            <button
              className="mdc-button"
              id="add_mock_data"
              onClick={async () => await addMockRestaurants()}
            >
              Add mock data
            </button>
          </div>
        </div>
      ) : (
        <div className="template" id="main-adjusted">
          {restaurants.map((restaurant) => {
            return RestaurantCard(restaurant, navigate);
          })}
        </div>
      )}
    </React.Fragment>
  );
}
function RestaurantCard(restaurant: DocumentData, navigate: any) {
  const routeChange = () => {
    let path = `/restaurants/${restaurant.id}`;
    navigate(path);
  };

  return (
    <Card sx={{ width: 320 }} key={restaurant.id}>
      <CardActionArea onClick={routeChange}>
        <CardMedia
          sx={{ height: 140 }}
          image={restaurant.photo}
          title={restaurant.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {restaurant.name}
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight={"normal"}>
            {[...Array(restaurant.price)].map(() => "$")}
          </Typography>
          <Rating
            name="read-only size-small"
            value={restaurant.avgRating}
            readOnly
            precision={0.5}
          />
          <Typography variant="body2" color="text.secondary">
            {restaurant.category} ● {restaurant.city}
          </Typography>
        </CardContent>
        <CardActions></CardActions>
      </CardActionArea>
    </Card>
  );
}

function Header() {
  const { status: signinStatus, data: signInCheckResult } = useSigninCheck();
  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  }));
  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "20ch",
      },
    },
  }));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [
    mobileMoreAnchorEl,
    setMobileMoreAnchorEl,
  ] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {signinStatus == "loading" || signInCheckResult.signedIn === false ? (
        <MenuItem onClick={signIn}>Login with Google</MenuItem>
      ) : (
        <MenuItem onClick={signOut}>Logout</MenuItem>
      )}
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Friendly Eats
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
export default Home;

const data = {
  words: [
    "Bar",
    "Fire",
    "Grill",
    "Drive Thru",
    "Place",
    "Best",
    "Spot",
    "Prime",
    "Eatin'",
  ],
  cities: [
    "Albuquerque",
    "Arlington",
    "Atlanta",
    "Austin",
    "Baltimore",
    "Boston",
    "Charlotte",
    "Chicago",
    "Cleveland",
    "Colorado Springs",
    "Columbus",
    "Dallas",
    "Denver",
    "Detroit",
    "El Paso",
    "Fort Worth",
    "Fresno",
    "Houston",
    "Indianapolis",
    "Jacksonville",
    "Kansas City",
    "Las Vegas",
    "Long Island",
    "Los Angeles",
    "Louisville",
    "Memphis",
    "Mesa",
    "Miami",
    "Milwaukee",
    "Nashville",
    "New York",
    "Oakland",
    "Oklahoma",
    "Omaha",
    "Philadelphia",
    "Phoenix",
    "Portland",
    "Raleigh",
    "Sacramento",
    "San Antonio",
    "San Diego",
    "San Francisco",
    "San Jose",
    "Tucson",
    "Tulsa",
    "Virginia Beach",
    "Washington",
  ],
  categories: [
    "Brunch",
    "Burgers",
    "Coffee",
    "Deli",
    "Dim Sum",
    "Indian",
    "Italian",
    "Mediterranean",
    "Mexican",
    "Pizza",
    "Ramen",
    "Sushi",
  ],
};
