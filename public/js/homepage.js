
const dropdown2 = document.getElementById('dropdown2');


function isActive2() {
    if (dropdown2.classList.contains('is-active')) {
      dropdown2.classList.remove('is-active');
    } else {
      dropdown2.classList.add('is-active');
    }
  }


dropdown2.addEventListener('click', isActive2);