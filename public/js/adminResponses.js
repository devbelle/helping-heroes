// allows admins to delete responses when clicking the delete button
// linked to "adminResponses.handlebars"

var responseList = new List('all-responses', { valueNames: ['username', 'date', 'upvotes' ] });

const deleteResponse = async (evt) => {
  const OK = confirm('Are you sure you want to delete this response?');
  if (OK) {
    const responseID = evt.target.dataset.id;
    const res = await fetch(`/api/responses/${responseID}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      document.location.reload();
    } else {
      alert(`Failed to delete response, status: ${res.statusText}`);
    };
  };
}


const dropdown2 = document.getElementById('dropdown2');


function isActive2() {
    if (dropdown2.classList.contains('is-active')) {
      dropdown2.classList.remove('is-active');
    } else {
      dropdown2.classList.add('is-active');
    }
  }


dropdown2.addEventListener('click', isActive2);

document
  .querySelectorAll('button.delete-response')
  .forEach( (el) => el.addEventListener('click', deleteResponse));
