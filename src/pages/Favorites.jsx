import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  const removeFavorite = (id, e) => {
    e.preventDefault();
    e.stopPropagation();

    const updatedFavorites = favorites.filter(recipe => recipe.idMeal !== id);
    
    setFavorites(updatedFavorites);
    
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="pt-24 max-w-screen-lg mx-auto">
      <h2 className="text-4xl text-center text-amber-600">❤️ Favorite Recipes</h2>
      {favorites.length === 0 ? (
        <p className="text-center text-xl text-amber-200 mt-6">No favorite recipes yet!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {favorites.map((recipe) => (
            <div key={recipe.idMeal} className="relative">
              <button 
                onClick={(e) => removeFavorite(recipe.idMeal, e)}
                className="absolute top-2 right-2 bg-[#1f2a38] hover:bg-red-600 text-white p-2 rounded-full z-10"
              >
                ❌
              </button>
              <Link to={`/favoriterecipe/${recipe.idMeal}`}>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <img
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    className="rounded-lg w-full h-48 object-cover"
                  />
                  <h3 className="text-xl text-amber-200 mt-2">{recipe.strMeal}</h3>
                  <p className="text-amber-500">{recipe.strArea}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;