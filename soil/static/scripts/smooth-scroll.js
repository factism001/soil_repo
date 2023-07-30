function smoothScroll(e) {
  e.preventDefault();
  
  const targetId = this.getAttribute('href');
  const target = document.querySelector(targetId);

  // Scroll to target element
  target.scrollIntoView({
    behavior: 'smooth'
  });
}

// Get all nav links
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
  link.addEventListener('click', smoothScroll);
});
