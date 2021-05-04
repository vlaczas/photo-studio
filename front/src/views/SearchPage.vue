<template>
  <section class="search-page">
    <search @open-filters="openFilter = true"></search>
    <div class="search-output">
      <div :class="{ filters: true, top: openFilter }">
        <h1>Фильтры</h1>
        <span class="closer" @click="openFilter = false">X</span>
        <div>
          <div class="range">
            <label for="price"
              >Цена до <strong>{{ price }}</strong> грн./час</label
            >
            <input
              type="range"
              id="price"
              v-model="price"
              min="250"
              max="1000"
              step="50"
            />
          </div>
          <div class="checkboxes">
            <div>
              <input type="checkbox" id="box1" />
              <label for="box1">Вспышки</label>
            </div>
            <div>
              <input type="checkbox" id="box2" />
              <label for="box2">Дневной свет</label>
            </div>
            <div>
              <input type="checkbox" id="box3" />
              <label for="box3">Столы</label>
            </div>
          </div>
          <div class="footer">
            <button class="bold-btn">Сбросить</button>
            <base-button>Применить</base-button>
          </div>
        </div>
      </div>
      <div>
        <search-output></search-output>
      </div>
    </div>
  </section>
</template>

<script>
import Search from '@/components/search/Search.vue';
import SearchOutput from '../components/search/SearchOutput.vue';

export default {
  components: { Search, SearchOutput },
  data() {
    return {
      openFilter: false,
      price: 1000,
      checkboxes: [],
    };
  },
};
</script>

<style lang="scss" scoped>
strong {
  font-weight: bold;
}
.search-page {
  min-height: calc(100vh - 108px);
}
.search-output {
  display: flex;
  width: 100vw;
  margin: 50px auto 0;
}
.filters {
  width: 100vw;
  position: fixed;
  top: 100%;
  z-index: 11;
  background-color: white;
  transition: top 0.3s ease;

  & > div {
    position: relative;
    height: calc(100vh - 77px);
    overflow: auto;
  }

  h1 {
    border-bottom: 1px solid black;
    padding: 25px 20px;
    position: sticky;
    top: 0;
  }

  .range {
    display: flex;
    flex-direction: column;
    margin: 20px 20px 0;

    input {
      width: 80%;
      margin: 20px auto;
    }
  }
}
.checkboxes {
  div {
    cursor: pointer;
  }

  div:hover {
    background-color: var(--col-lgrey);
  }
  label {
    display: inline-block;
    padding: 15px 0;
    cursor: pointer;
    width: calc(100% - 53px);
  }
  input {
    margin: 0 20px;
  }
}
.closer {
  top: 22px;
  right: 10px;
  background-color: white;
}
.top {
  top: 0;
}

.footer {
  display: flex;
  border-top: 1px solid black;
  padding: 25px 35px;
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  justify-content: space-between;
}
@media (min-width: 768px) {
  .closer {
    display: none;
  }

  .checkboxes {
    margin-bottom: 109px;
  }
  .filters {
    position: static;
    width: max(300px, 20vw);
    margin-right: 25px;
    border-radius: 15px;
    height: min-content;

    & > div {
      height: auto;
    }
  }

  .footer {
    padding: 25px;
  }
}
@media (min-width: 1024px) {
  .search-output {
    width: 80vw;
  }
}
@media (min-width: 1439px) {
}
</style>
