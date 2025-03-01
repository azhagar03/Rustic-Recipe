import axios from "../axios/axios";
import { useEffect, useState } from "react";
import useStore from "../app/store";
import Card from "../components/Card";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const Categories = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const changeCategoryInputValue = useStore(
    (state) => state.changeCategoryInputValue
  );

  const getCategoryData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/categories.php");
      setCategoryData(res.data.categories);
      setFilteredData(res.data.categories);
    } catch (error) {
      setErrorMessage("Not Found");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getCategoryData();
  }, []);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    if (filter === "All") {
      setFilteredData(categoryData);
    } else {
      const filtered = categoryData.filter((item) =>
        item.strCategory.toLowerCase().includes(filter.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="z-50 pt-44 h-[60vh] flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <>
          <div className="pt-32 pb-10">
            <h3 className="text-4xl mb-10 text-center text-amber-700 font-semibold">
              Explore Our Recipe Collections
            </h3>

            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {["All", "Breakfast", "Chicken","Dessert", "Vegetarian", "Vegan",].map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterChange(filter)}
                  className={`px-4 py-2 rounded-md text-white ${
                    selectedFilter === filter ? "bg-amber-700" : "bg-gray-700"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap justify-center items-center gap-8">
              {errorMessage ? (
                <p className="text-white text-5xl">{errorMessage}😓</p>
              ) : (
                <>
                  {filteredData.map((element) => (
                    <Link to={"/category-search"} key={element.idCategory}>
                      <Card
                        mealName={element.strCategory}
                        mealImage={element.strCategoryThumb}
                        onClick={() => changeCategoryInputValue(element.strCategory)}
                      />
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Categories;
