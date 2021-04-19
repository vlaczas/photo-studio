<template>
  <div
    tabindex="0"
    class="base-btn focus-ring"
    :class="color"
  >
    <spinner v-if="isLoading"></spinner>
    <button :class="color" tabindex="-1" v-else>
      <slot></slot>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    isLoading: {
      type: Boolean,
      required: false,
      default: false,
    },
    color: {
      type: String,
      required: false,
      default: 'black',
    },
  },
};
</script>

<style lang="scss" scoped>
.base-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 140px;
  max-width: 140px;
  min-height: 38px;
  max-height: 38px;
  border-radius: 9px;
  background-color: var(--col-black);
  &:active {
    transform: scale(0.97);
  }

  &:hover {
    background: var(--back-grad);
  }
  cursor: pointer;

  & button {
    font-weight: 600;
    color: var(--col-white);
    border: none;
    background-color: transparent;
    user-select: none;
    cursor: pointer;
    padding: 10px 5px;
    width: 100%;

    &:disabled {
      background: var(--col-grey);
      border-radius: 9px;
    }

    &:focus {
      outline: none;
    }
  }
}
.white {
  background-color: var(--col-white);
  color: var(--col-black) !important;
}
.black {
  background-color: var(--col-black);
  color: var(--col-white);
}
</style>
