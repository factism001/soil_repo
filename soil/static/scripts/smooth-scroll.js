/*Handles smooth scolling
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
*/

//Handles back to top
let backToTop = document.getElementById('backToTop');

window.onscroll = function() {
  if (document.body.scrollTop > 5 || document.documentElement.scrollTop > 20) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

backToTop.addEventListener('click', () => {
  document.body.scrollTop = 0; 
  document.documentElement.scrollTop = 0;
})
