// Placeholder for now: saving only to localStorage or later you will integrate Firebase Firestore.

export const updateUserProfile = async (displayName: string, nickname: string, photoFile?: File) => {
   // In real app, you'd upload photoFile to storage and save nickname to database.
   localStorage.setItem("displayName", displayName);
   localStorage.setItem("nickname", nickname);
   if (photoFile) {
     const reader = new FileReader();
     reader.onloadend = () => {
       const base64data = reader.result;
       localStorage.setItem("avatar", base64data as string);
     };
     reader.readAsDataURL(photoFile);
   }
 };
 