<template>
  <div>
    <!-- Modal -->
    <div class="modal" v-if="selectedBeer">
      <div class="modal-content">
        <span class="close" @click="selectedBeer = null">&times;</span>
        <img :src="selectedBeer.image_url" alt="Beer Image" class="modal-image" />
      </div>
    </div>

    <h1 class="heading">Brewed Beers</h1>

    <!-- Table -->
    <table class="beer-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Tagline</th>
          <th>Description</th>
          <th>Warnings</th>
          <th>Image</th>
          <th>ABV</th>
          <th>IBU</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="beer in sortedBeers" :key="beer.id" :class="{ 'beer-row': true, 'highlight': beer.isDryHopped, 'warning':beer.containsLactose }">
          <td>{{ beer.name }}</td>
          <td>{{ beer.tagline }}</td>
          <td>{{ beer.description }}</td>
          <td>
            <span v-if="!beer.isDryHopped && !beer.containsLactose">None</span>
            <span v-if="beer.isDryHopped">Is Dry Hopped</span>
            <span v-if="beer.containsLactose">Contains Lactose</span>
          </td>
          <td>
            <img :src="beer.image_url" alt="Beer Image" class="beer-image" @click="openModal(beer)" />
          </td>
          <td>{{ beer.abv }}</td>
          <td>{{ beer.ibu }}</td>
        </tr>
      </tbody>
    </table>
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
