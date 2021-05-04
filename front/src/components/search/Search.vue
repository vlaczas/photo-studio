<template>
  <div class="search">
    <input type="text" class="search__input focus-ring" spellcheck="false" />
    <base-button class="filter-btn" @click="$emit('open-filters')"
      >Фильтры</base-button
    >
    <base-button>Поиск</base-button>
  </div>
</template>

<script>
export default {
  emits: ['open-filters'],
};
</script>

<style lang="scss">
.search {
  width: 80vw;
  margin: 50px auto 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  &__input {
    height: 34px;
    margin: 20px 0;
    min-width: 100%;
    border: none;
    box-shadow: 0 0 0 2px var(--col-fio);
    border-radius: 9px;
    padding: 0 5px;
    font: 400 0.95rem Rubik;
  }
}

@media (min-width: 768px) {
  .filter-btn {
    display: none !important;
  }
  .search {
    justify-content: flex-end;
  }
}
@media (min-width: 1024px) {
}
@media (min-width: 1439px) {
  .search {
    width: 50vw;
  }
}
</style>
