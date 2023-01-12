import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { addRating, getRestaurant } from "../services/FirestoreService";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import { Box, Card, CardContent, Rating, Typography } from "@mui/material";
import { query, collection, doc, limit } from "firebase/firestore";

function Restaurant() {
  let { id } = useParams();
  const firestore = useFirestore();
  const { status, data: ratings } = useFirestoreCollectionData(
    query(
      collection(doc(collection(firestore, "restaurants"), id), "ratings"),
      limit(50)
    ),
    {
      idField: "id",
    }
  );
  const { data: user } = useUser();
  const [loading, setLoading] = useState(true);
  const [restaurantDoc, setRestaurantDoc] = useState({
    name: "",
    category: "",
    price: "",
    city: "",
    numRatings: "",
    avgRating: "",
    photo: "",
  });

  useEffect(() => {
    setLoading(true);
    getRestaurant(id, firestore).then((data: any) => {
      setRestaurantDoc(data);
      setLoading(false);
    });
  }, []);

  function addMockRatings(restaurantID: any) {
    var ratingPromises = [];
    for (var r = 0; r < 5 * Math.random(); r++) {
      var rating =
        data.ratings[
          parseInt(JSON.stringify(data.ratings.length * Math.random()))
        ];
      rating.userName = "Bot (Web)";
      rating.userId = user?.uid || "";
      ratingPromises.push(addRating(restaurantID, rating, firestore));
    }
    return Promise.all(ratingPromises);
  }
  if (loading) {
    return <div className="App">Loading...</div>;
  }
  return (
    <React.Fragment>
      <Box
        sx={{
          width: "100%",
          height: 300,
        }}
      >
        <img src={restaurantDoc.photo}></img>
      </Box>
      {parseInt(restaurantDoc.numRatings) === 0 ? (
        <div className="template" id="no-ratings">
          <div id="guy-container" className="mdc-toolbar-fixed-adjust">
            <img className="guy" src="/src/images/guy_fireats.png" />
            <div className="text">
              This restaurant has no ratings.
              <br />
            </div>
            <br />
            <button
              className="mdc-button"
              id="add_mock_data"
              onClick={async () => await addMockRatings(id)}
            >
              Add mock ratings
            </button>
          </div>
        </div>
      ) : (
        <>
          {ratings.map((rating) => {
            return (
              <Card sx={{ width: 320 }} key={rating.id}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {rating.text}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 12 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    {rating.userName}
                  </Typography>
                  <Rating
                    name="read-only size-small"
                    value={rating.rating}
                    readOnly
                    precision={0.5}
                  />
                </CardContent>
              </Card>
            );
          })}
        </>
      )}
    </React.Fragment>
  );
}

export default Restaurant;

const data = {
  ratings: [
    {
      rating: 1,
      text: "Would never eat here again!",
      userName: "",
      userId: "",
    },
    {
      rating: 2,
      text: "Not my cup of tea.",
    },
    {
      rating: 3,
      text: "Exactly okay :/",
    },
    {
      rating: 4,
      text: "Actually pretty good, would recommend!",
    },
    {
      rating: 5,
      text: "This is my favorite place. Literally.",
    },
  ],
};
