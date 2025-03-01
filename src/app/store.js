import { create } from "zustand";

const useStore = create((set) => ({
  inputValue: "",
  categoryInputValue: "",
  favorites: JSON.parse(localStorage.getItem("favorites")) || [],

  changeInputValue: (searchInput) => set({ inputValue: searchInput }),
  changeCategoryInputValue: (categoryInput) => set({ categoryInputValue: categoryInput }),

  addToFavorites: (recipe) =>
    set((state) => {
      if (state.favorites.some((fav) => fav.idMeal === recipe.idMeal)) {
        return state; // Avoid duplicates
      }
      const updatedFavorites = [...state.favorites, recipe];
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // ✅ Save to storage
      return { favorites: updatedFavorites };
    }),

  removeFromFavorites: (idMeal) =>
    set((state) => {
      const updatedFavorites = state.favorites.filter((recipe) => recipe.idMeal !== idMeal);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // ✅ Update storage
      return { favorites: updatedFavorites };
    }),
}));

export default useStore;
