export default {
  mounted() {
    // Observer to add class to sticky columns when they are stuck
    document.querySelectorAll('.b-table-sticky-column').forEach((i) => {
      if (i) {
        const observer = new IntersectionObserver(
          (entries) => {
            observerCallback(entries);
          },
          {
            root: document.querySelector('.ps_gs-table-products'),
            threshold: 1,
          },
        );
        observer.observe(i);
      }
    });
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-pinned', entry.intersectionRatio < 1);
      });
    };
  },
};
