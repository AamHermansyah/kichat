export const getPublicIdFromUrl = (secureUrl: string) => {
  // Define the regex pattern to match the publicId
  const regex = /\/([^\/]+)\.[^\/]+$/;

  // Apply the regex pattern to the URL
  const match = secureUrl.match(regex);

  // If a match is found, return the publicId, otherwise return an empty string or handle the error as needed
  return match ? match[1] : '';
};