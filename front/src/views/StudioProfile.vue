<template>
  <section>
    cсылка на эту студию:
    <a
      :href="`http://localhost/studios/${studio.slug}`"
      target="_blank"
      rel="noopener noreferrer"
    >
      http://localhost/studios/{{ studio.slug }}
    </a>
  </section>
</template>

<script>
export default {
  data() {
    return {
      studio: {},
    };
  },
  created() {
    this.$store
      .dispatch('studio/getSingleStudio', { slug: this.$route.slug })
      .then((res) => (this.studio = res.data.data))
      .catch((res) => console.log(res.data));
  },
};
</script>

<style></style>
