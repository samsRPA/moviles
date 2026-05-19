import { registerUserInFirebase, loginUserInFirebase, logoutFromFirebase, updateUserProfile } from "../models/UserModel";

export async function registerUser({ name, email, pass, pass2 }) {
  if (!name.trim()||!email.trim()||!pass||!pass2) return {ok:false,error:"Completa todos los campos."};
  if (pass!==pass2) return {ok:false,error:"Las contraseñas no coinciden."};
  if (pass.length<6) return {ok:false,error:"Mínimo 6 caracteres en la contraseña."};
  try { return {ok:true, user:await registerUserInFirebase(name.trim(),email.trim(),pass)}; }
  catch(e) { return {ok:false, error:firebaseErrorMessage(e.code)}; }
}

export async function loginUser(email, password) {
  if (!email.trim()||!password.trim()) return {ok:false,error:"Completa correo y contraseña."};
  try { return {ok:true, user:await loginUserInFirebase(email.trim(),password)}; }
  catch(e) { return {ok:false, error:firebaseErrorMessage(e.code)}; }
}

export async function logoutUser() { await logoutFromFirebase(); }

export async function saveUserPreferences(uid, city, interests) {
  await updateUserProfile(uid, { city, interests, needsOnboarding:false });
}

function firebaseErrorMessage(code) {
  const map = {
    "auth/email-already-in-use":   "Este correo ya está registrado.",
    "auth/invalid-email":          "El correo no es válido.",
    "auth/weak-password":          "La contraseña es muy débil.",
    "auth/user-not-found":         "No existe una cuenta con este correo.",
    "auth/wrong-password":         "Contraseña incorrecta.",
    "auth/invalid-credential":     "Correo o contraseña incorrectos.",
    "auth/too-many-requests":      "Demasiados intentos. Intenta más tarde.",
    "auth/network-request-failed": "Error de red. Revisa tu conexión.",
  };
  return map[code]??"Ocurrió un error. Intenta de nuevo.";
}
