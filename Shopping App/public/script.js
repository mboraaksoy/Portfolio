document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.querySelector('#categoryFilter');
  
    dropdown.addEventListener('change', function () {
      const selected = this.value;
      window.location.href = `/products?category=${encodeURIComponent(selected)}`;
    });
  });