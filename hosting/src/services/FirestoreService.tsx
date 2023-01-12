import {
  DocumentData,
  Firestore,
  addDoc,
  collection,
  doc,
  getDoc,
  limit,
  orderBy,
  query,
  runTransaction,
  where,
} from "firebase/firestore";
import { useFirestoreCollectionData } from "reactfire";

export function addRestaurant(data: DocumentData, firestore: Firestore) {
  const restaurantCollection = collection(firestore, "restaurants");
  return addDoc(restaurantCollection, data);
}

export function getAllRestaurants(firestore: Firestore) {
  const restaurantCollection = collection(firestore, "restaurants");
  const restaurantQuery = query(
    restaurantCollection,
    orderBy("avgRating", "desc"),
    limit(50)
  );
  return getDocumentsInQuery(restaurantQuery);
}

export function getDocumentsInQuery(restaurantQuery: any) {
  const { status, data: restaurants } = useFirestoreCollectionData(
    restaurantQuery,
    {
      idField: "id",
    }
  );
  return { status, restaurants };
}

export async function getRestaurant(id: any, firestore: Firestore) {
  const docSnap = await getDoc(doc(firestore, "restaurants", id));
  if (docSnap.exists()) {
    return docSnap.data();
  }
}

export function getFilteredRestaurants(filters: any, firestore: Firestore) {
  const constraints = [];

  if (filters.category !== "Any") {
    constraints.push(where("category", "==", filters.category));
  }
  if (filters.city !== "Any") {
    constraints.push(where("city", "==", filters.city));
  }
  if (filters.price !== "Any") {
    constraints.push(where("price", "==", filters.price.length));
  }
  if (filters.sort === "Rating") {
    constraints.push(orderBy("avgRating", "desc"));
  } else if (filters.sort === "Reviews") {
    constraints.push(orderBy("numRatings", "desc"));
  }

  const restaurantQuery = query(
    collection(firestore, "restaurants"),
    ...constraints
  );
  return getDocumentsInQuery(restaurantQuery);
}

export async function addRating(restaurantID: any, rating: any, firestore: Firestore) {
  const restaurantDoc = doc(collection(firestore, "restaurants"), restaurantID);
  const ratingDoc = doc(collection(restaurantDoc, "ratings"));

  return runTransaction(firestore, async (transaction) => {
    return transaction.get(restaurantDoc).then(function(doc) {
      var data = doc.data();
      if (!doc.exists()) {
        throw "Document does not exist!";
      }
      var newAverage =
        (data?.numRatings * data?.avgRating + rating.rating) /
        (data?.numRatings + 1);

      transaction.update(restaurantDoc, {
        numRatings: data?.numRatings + 1,
        avgRating: newAverage,
      });
      return transaction.set(ratingDoc, rating);
    });
  });
  
}

export function getRandomItem(arr: any) {
  return arr[Math.floor(Math.random() * arr.length)];
}
