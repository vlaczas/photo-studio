<template>
  <transition name="modal" mode="out-in">
    <section
      v-if="open"
      class="modal"
      @mousedown.self="$emit('close-modal')"
    >
      <div class="modal-inner">
        <slot></slot>
      </div>
    </section>
  </transition>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  emits: ['close-modal'],
};
</script>

<style lang="scss">
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: -150px;
  bottom: -150px;
  left: -150px;
  right: -150px;
  background-color: rgba($color: #000000, $alpha: 0.4);
  z-index: 100;
}
.modal-inner {
  background-color: var(--col-white);
  border-radius: 10px;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
