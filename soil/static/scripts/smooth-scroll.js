//Handles smooth scolling
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

//Handles back to top
// Get button element
const backToTop = document.querySelector('#backToTop');

// Scroll handler to show/hide button
window.addEventListener('scroll', () => {

  if (document.body.scrollTop > 5 || document.documentElement.scrollTop > 5) {
    backToTop.classList.add('show');
  } else { 
    backToTop.classList.remove('show');
  }

});

// Scroll to top on click
backToTop.addEventListener('click', () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0; 
});
