// allows admins to delete responses when clicking the delete button
// linked to "adminResponses.handlebars"

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

document
  .querySelectorAll('button.delete-response')
  .forEach( (el) => el.addEventListener('click', deleteResponse));
