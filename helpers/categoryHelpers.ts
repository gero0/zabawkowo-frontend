import { domain } from "../constants/network";

export async function categoryRequest() {
  const url = domain + "/api/offer/categories";

  try {
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (e) {
    console.log(`categories fetch exception. ERROR: ${e}`);
    return {};
  }
}

export const handleCategoryChange = (categories, category) => {
  let newArray = [...categories];

  if (newArray.includes(category)) {
    newArray.splice(newArray.indexOf(category), 1);
  } else {
    newArray.push(category);
  }

  return newArray;
};
