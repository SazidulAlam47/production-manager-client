const formatFirebaseError = (errorMessage: string) => {
    const match = errorMessage.match(/Firebase: Error \(auth\/(\S+)\)./);

    if (!match || !match[1]) {
        return errorMessage;
    }

    const firebaseError = match[1].replace(/-/g, ' '); // extract the error message

    const firebaseErrorCapitalized =
        firebaseError.charAt(0).toUpperCase() + firebaseError.slice(1); // make it capitalized

    return firebaseErrorCapitalized;
};

export default formatFirebaseError;
