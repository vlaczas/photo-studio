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
      required: true,
      default: false,
    },
  },
};
</script>

<style lang="scss">
.base-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 130px;
  max-width: 130px;
  max-height: 41px;
  min-height: 41px;
  border-radius: 9px;
  padding: 11px;
  border-radius: 10px;
  background-color: var(--col-black);
  &:active {
    transform: scale(0.95);
  }
  &:disabled {
    background: var(--col-grey);
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

    &:focus {
      outline: none;
    }
  }
}
</style>
