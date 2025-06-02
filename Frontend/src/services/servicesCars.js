export const getCoches = async () => {
  const response = await fetch("https://localhost:3002/api/Cars");
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    console.log("algo fue mal");
    return null;
  }
};
