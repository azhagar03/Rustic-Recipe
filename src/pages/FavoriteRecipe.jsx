import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const FavoriteRecipe = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [youtubeId, setYoutubeId] = useState("");

  useEffect(()=>{
    window.scrollTo(0,0)
  },[])
  
  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        setLoading(true);
        const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        const savedRecipe = savedFavorites.find(item => item.idMeal === id);
        
        if (savedRecipe && savedRecipe.strInstructions) {
          setRecipe(savedRecipe);
          if (savedRecipe.strYoutube) {
            setYoutubeId(savedRecipe.strYoutube.split("?v=")[1]);
          }
        } else {
          const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
          const data = await response.json();
          
          if (data.meals && data.meals.length > 0) {
            const fullRecipe = data.meals[0];
            setRecipe(fullRecipe);
            
            const updatedFavorites = savedFavorites.map(item => 
              item.idMeal === id ? fullRecipe : item
            );
            localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
            
            if (fullRecipe.strYoutube) {
              setYoutubeId(fullRecipe.strYoutube.split("?v=")[1]);
            }
          } else {
            throw new Error("Recipe not found");
          }
        }
      } catch (err) {
        setError("Failed to load recipe details. " + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  const renderIngredients = () => {
    if (!recipe) return null;
    const ingredients = [];
    
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      
      if (ingredient && ingredient.trim() !== "") {
        ingredients.push(
          <span key={i}>
            {i}. {ingredient} - {measure}<br />
          </span>
        );
      }
    }
    
    return ingredients;
  };

  if (loading) return <div className="text-center text-white text-2xl mt-32">Loading recipe...</div>;
  if (error) return <div className="text-center text-red-500 text-2xl mt-32">{error}</div>;

  return (
    recipe && (
      <div className="flex flex-col pt-24 pb-16 max-w-screen-lg m-auto">
        <div className="flex flex-col sm:flex-row text-center sm:text-left justify-center sm:justify-between items-center p-2 w-full gap-5 max-w-screen-lg m-auto">
          <figure className="sm:w-1/2">
            <img
              src={recipe.strMealThumb}
              alt="Meal Image"
              className="rounded-xl max-h-96 sm:w-80 md:w-96 m-auto"
            />
          </figure>
          <div className="w-1/2 flex flex-col items-center sm:items-start gap-2">
            <h3 className="text-amber-200 text-4xl md:text-5xl">
              {recipe.strMeal}
            </h3>
            <p className="text-amber-500 text-3xl md:text-4xl">
              {recipe.strArea}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-start items-start text-white pt-10 gap-4 px-2 sm:px-4">
          <h4 className="text-3xl sm:text-4xl pt-4 text-amber-600 sm:font-semibold">
            🍴 How to Make it
          </h4>
          <p className="text-xl text-amber-200">
            {recipe.strInstructions}
          </p>

          <h4 className="text-3xl sm:text-4xl pt-4 text-amber-600 sm:font-semibold">
            🍳 Ingredients and quantity
          </h4>
          <p className="text-xl text-amber-200">{renderIngredients()}</p>

          <h4 className="text-3xl sm:text-4xl pt-4 text-amber-600 sm:font-semibold">
            💻 Recipe Video
          </h4>
          {youtubeId ? (
            <iframe
              className="sm:w-[560px] sm:h-[315px]"
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              title="video"
            ></iframe>
          ) : (
            <p className="text-xl text-amber-200">
              Sorry video not available for this recipe ☹️
            </p>
          )}
        </div>
      </div>
    )
  );
};

export default FavoriteRecipe;