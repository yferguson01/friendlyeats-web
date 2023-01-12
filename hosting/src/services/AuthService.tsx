import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export async function signOut(auth: any) {
  await auth.signOut();
}
export async function signIn(auth: any) {
  const provider = new GoogleAuthProvider();

  await signInWithPopup(auth, provider);
};
