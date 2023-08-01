// A mock function to mimic making an async request for data
export function fetchAllProducts() {
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8080/products");
    const data = await response.json();

    resolve({data});
});
}

export function fetchProductsByFilter(filter, sort) {
  //filter = {"category" : ["smartphone", "laptops"]}
  //sort = {_sort : "price", _order : "desc"}
  // TODO : multiple categories support on server

  let queryString = '';
  for(let key in filter){
    const categoryValues = filter[key];
    if(categoryValues.length){
      const lastCategoryValue = categoryValues[categoryValues.length - 1]
      queryString += `${key}=${lastCategoryValue}&`
    }
  }

  for(let key in sort){
    queryString += `${key}=${sort[key]}&`;
  }

  console.log(queryString);
  return new Promise(async (resolve) => {
    const response = await fetch("http://localhost:8080/products?" + queryString);
    const data = await response.json();

    resolve({data});
});
}