<template>
	<div class="bg-gradient-to-r from-[#000428] via-[#000428] to-[#06294E]">
		<!-- Modal -->
		<div class="block fixed left-0 top-0 w-full h-full overflow-auto z-20 bg-black bg-opacity-90" v-if="selectedBeer">
		<div class="block my-10 mx-auto">
			<span class="text-white text-2xl font-bold absolute cursor-pointer top-5 right-8" @click="selectedBeer = null">&times;</span>
			<img :src="selectedBeer.image_url" alt="Beer Image" class="max-w-full max-h-full block my-0 mx-auto" />
		</div>
		</div>

		<div class="p-10">
			<div class="text-6xl text-center p-10">Brewed Beers</div>
      
        <div v-for="beer in sortedBeers" :key="beer.id">
          <div  :class="{ 'bg-gradient-to-r from-black to-[#000428] flex mt-10 mx-10 p-10 rounded-lg shadow-2xl z-10':true, 'warning':beer.containsLactose }" @mouseenter="beer.isShow = true" @mouseleave="beer.isShow = false">
            <div class="flex justify-center items-center basis-1/4 shrink-0 ">
              <img :src="beer.image_url" alt="Beer Image" class="w-1/2 h-auto" @click="openModal(beer)" />
            </div>
            <div class="flex-grow">
              <div class="font-bold text-2xl ">{{ beer.name }}</div>
              <div><span class="font-bold">Tagline:</span> {{ beer.tagline }}</div>
              <div><span class="font-bold">Description:</span>{{ beer.description }}</div>
              <div><span class="font-bold">ABV:</span> {{ beer.abv }}</div>
              <div><span class="font-bold">IBU : </span> {{ beer.ibu }}</div>
            </div>
          </div>
            <div :class="{'card-open ml-20 mr-10 text-lg rounded-b-lg shadow-2xl flex items-center z-0':true,'bg-white':!beer.containsLactose,'bg-yellow-200':beer.containsLactose ,'slide-in': beer.isShow }">
              <span class="text-black mx-5" v-if="!beer.isDryHopped && !beer.containsLactose">No Allergy Information</span>
              <span class="text-[#DC2626] mx-5" v-if="beer.isDryHopped">Is Dry Hopped</span>
              <span class="text-black mx-5" v-if="beer.containsLactose">Contains Lactose</span>
            </div>
        </div>
		</div>
	</div>
</template>

<script>
export default {
  data() {
    return {
      beers: [],
      selectedBeer: null,
    };
  },
  computed: {
    sortedBeers() {
      return this.beers
      .filter((beer) => beer.ingredients.hops.every((hop) => hop.name.toLowerCase() !== 'centennial'))
      .sort((a, b) => a.abv - b.abv);
    },
  },
  async mounted() {
    try {
      const response = await $fetch(
        'https://api.punkapi.com/v2/beers?brewed_after=11-2012'
      );
      this.beers = response.map((beer) => {
        const containsLactose = beer.ingredients.hops.some((hop) =>
          hop.name.toLowerCase().includes('lactose')
        );
        return { ...beer, containsLactose };
      });
      this.beers = this.beers.map((beer) => {
        const isDryHopped = beer.ingredients.hops.some((hop) =>
          hop.add.toLowerCase().includes('dry hop')
        );
        return { ...beer, isDryHopped };
      });
      this.beers = this.beers.map((beer) => {
        const isShow = false
        return { ...beer, isShow };
      })
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    openModal(beer) {
      console.log(beer)
      this.selectedBeer = beer;
    },
  },
};
</script>
