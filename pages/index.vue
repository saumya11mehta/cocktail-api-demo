<template>
	<div class="bg-gradient-to-r from-[#000428] via-[#000428] to-[#06294E]">
		<!-- Modal -->
		<div class="block fixed left-0 top-0 w-full h-full overflow-auto z-20 bg-black bg-opacity-90" v-if="selectedCocktail">
		<div class="block my-10 mx-auto">
			<span class="text-white text-2xl font-bold absolute cursor-pointer top-5 right-8" @click="selectedCocktail = null">&times;</span>
			<img :src="selectedCocktail.strDrinkThumb" alt="Cocktail Image" class="max-w-full max-h-full block my-0 mx-auto" />
		</div>
		</div>

		<div class="p-10">
			<div class="text-6xl text-center p-10">The Cocktail List</div>
      
        <div v-for="cocktail in sortedCocktails" :key="cocktail.id">
          <div  :class="{ 'bg-gradient-to-r from-black to-[#000428] flex mt-10 mx-10 p-10 rounded-lg shadow-2xl z-10':true, 'warning':cocktail.containsDairy }" @mouseenter="cocktail.isShow = true" @mouseleave="cocktail.isShow = false">
            <div class="flex justify-center items-center basis-1/4 shrink-0 ">
              <img :src="cocktail.strDrinkThumb" alt="Cocktail Image" class="w-1/2 h-auto" @click="openModal(cocktail)" />
            </div>
            <div class="flex-grow">
              <div class="font-bold text-2xl ">{{ cocktail.strDrink }}</div>
              <div><span class="font-bold">Instructions:</span> {{ cocktail.strInstructions }}</div>
              <div><span class="font-bold">Glass:</span>{{ cocktail.strGlass }}</div>
              <div><span class="font-bold">Ingredients:</span> {{ getPrintIngredients(cocktail) }}</div>
            </div>
          </div>
            <div :class="{'card-open ml-20 mr-10 text-lg rounded-b-lg shadow-2xl flex items-center z-0':true,'bg-white':(!cocktail.containsDairy && !cocktail.containsEggWhites),'bg-yellow-200':(cocktail.containsDairy || cocktail.containsEggWhites) ,'slide-in': cocktail.isShow }">
              <span class="text-black mx-5" v-if="!cocktail.containsDairy && !cocktail.containsEggWhites">No Allergy Information</span>
              <span class="text-black mx-5" v-if="cocktail.containsDairy || cocktail.containsEggWhites">Might have Dairy Or Egg Whites</span>
            </div>
        </div>
		</div>
	</div>
</template>

<script>
export default {
  data() {
    return {
      cocktails: [],
      selectedCocktail: null,
    };
  },
  computed: {
    sortedCocktails() {
      return this.cocktails.sort();
    },
  },
  async mounted() {
    try {
      const characters = 'abcdefghijklmnopqrstuvwxyz';
      let randompicker = Math.round( Math.random() * (characters.length-1) );
      const response = await $fetch(
        'https://www.thecocktaildb.com/api/json/v1/1/search.php?f='+characters[randompicker]
      );
      this.cocktails = response.drinks.map((cocktail)=>{
        let n = 15 //number of Ingredients, is fixed for now
        cocktail.ingredients = [];
        for(let i = 1; i <=15; i++) {
          if (cocktail.hasOwnProperty("strIngredient"+i))
          {
            if(cocktail["strIngredient"+i] != null){
              cocktail.ingredients[i-1] = cocktail["strIngredient"+i]
            }
            delete cocktail["strIngredient"+i];
          }
        }
        return cocktail;
      })
      this.cocktails = this.cocktails.map((cocktail) => {
        const containsEggWhites = cocktail.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes('egg white')
        );
        return { ...cocktail, containsEggWhites };
      });
      this.cocktails = this.cocktails.map((cocktail) => {
        const containsDairy = cocktail.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes('light cream') || ingredient.toLowerCase().includes('baileys irish cream')|| ingredient.toLowerCase().includes('milk')
        );
        return { ...cocktail, containsDairy };
      });
      this.cocktails = this.cocktails.map((cocktail) => {
        const isShow = false
        return { ...cocktail, isShow };
      })
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    openModal(cocktail) {
      this.selectedCocktail = cocktail;
    },
    getPrintIngredients(cocktail){
      return cocktail.ingredients.toString();
    }
  },
};
</script>
