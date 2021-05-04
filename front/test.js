function debounce(timer) {
  let free = true;

  return () => {
    if (free) {
      free = false;
      setTimeout(() => (free = true), timer);
      return true;
    } else return false;
  };
}

export default debounce;
