import axios from "../axios/axios";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import useStore from "../app/store";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { FaHeart, FaRegHeart } from "react-icons/fa"; 

const CategorySearch = () => {
  const [searchData, setSearchData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const categoryInputData = useStore((state) => state.categoryInputValue);

  const changeInputValue = useStore((state) => state.changeInputValue);

  const favorites = useStore((state) => state.favorites);
  const addToFavorites = useStore((state) => state.addToFavorites);
  const removeFromFavorites = useStore((state) => state.removeFromFavorites);
  
  const isFavorite = (idMeal) => favorites.some((recipe) => recipe.idMeal === idMeal);
    

  const getSearchData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/filter.php?c=${categoryInputData}`);
      setSearchData(res.data.meals);
      sessionStorage.setItem("CategorySearch", JSON.stringify(res.data.meals));
    } catch (error) {
      setErrorMessage(true);
    }
    setIsLoading(false);
  };

  const getDataFromSessionStorage = async () => {
    setIsLoading(true);
    const data =
      sessionStorage.getItem("CategorySearch") !== null
        ? JSON.parse(sessionStorage.getItem("CategorySearch"))
        : [];
    if (data.length !== 0) {
      setSearchData(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (categoryInputData.length === 0) {
      getDataFromSessionStorage();
    } else {
      getSearchData();
    }
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="z-50 pt-44 h-[60vh] flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <div className="pt-32 pb-10">
          <h3 className="text-4xl mb-10 text-center text-amber-700 font-semibold">
            Explore Our Recipe Collections
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {errorMessage || !searchData ? (
              <p className="text-white text-5xl">Sorry Meals Not Found😓</p>
            ) : (
              <>
                {searchData.map((element) => {
                  return (
                    <div className="relative">
                    <Link  to={"/recipe"} key={element.idMeal}>
                      <Card
                        mealName={element.strMeal}
                        mealImage={element.strMealThumb}
                        onClick={() => changeInputValue(element.strMeal)}
                        
                      />
       
                    </Link>
       
                    <button
      className="absolute bottom-2 left-2 text-2xl"
      onClick={(e) => {
        e.preventDefault();
        if (isFavorite(element.idMeal)) {
          removeFromFavorites(element.idMeal);
        } else {
          addToFavorites(element); 
        }
      }}
    >
      {isFavorite(element.idMeal) ? (
        <FaHeart className="text-red-500" />
      ) : (
        <FaRegHeart className="text-gray-500" />
      )}
    </button>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CategorySearch;
