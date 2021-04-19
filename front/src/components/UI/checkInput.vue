<template>
  <div class="checked-input">
    <span v-if="isFree === false">❌</span>
    <span v-else-if="isFree === true">✅</span>
    <span v-else-if="isChecking"><spinner></spinner></span>
  </div>
</template>

<script>
import showNotification from '@/hooks/showNotification';

export default {
  props: {
    inputText: {
      type: String,
      required: true,
    },
    isInvalidUsername: {
      type: Boolean,
      required: true,
    },
    actionName: {
      type: String,
      required: true,
    },
    initValue: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      isChecking: false,
      isFree: '',
    };
  },
  watch: {
    inputText(newVal) {
      if (!newVal || newVal === this.initValue) {
        this.isFree = '';
      } else {
        setTimeout(() => {
          this.checkInput();
        }, 0);
      }
    },
  },
  methods: {
    checkInput() {
      if (this.isInvalidUsername) {
        this.isFree = '';
        return;
      }
      this.isChecking = true;
      this.$store
        .dispatch(this.actionName, this.inputText)
        .then((res) => {
          if (res.data.success) {
            this.isFree = false;
            showNotification('Такое имя уже занято ❌');
          } else {
            this.isFree = true;
          }
        })
        .catch(() => {
          showNotification(
            'Что-то сломалось на нашей стороне 🤦‍♂️',
          );
        })
        .finally(() => {
          this.isChecking = false;
          this.$emit('check-result', this.isFree);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.checked-input {
  position: absolute;
  width: 30px;
  aspect-ratio: 1 / 1;
  right: 15%;
  bottom: 5px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
