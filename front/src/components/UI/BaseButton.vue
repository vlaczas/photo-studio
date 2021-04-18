<template>
  <div tabindex="0" class="base-btn focus-ring">
    <spinner v-if="isLoading"></spinner>
    <button tabindex="-1" v-else>
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
    border: none;
    background-color: transparent;
    color: var(--col-white);
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
</style>
