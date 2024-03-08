document.addEventListener('DOMContentLoaded', () => {
  // functionality to ban or delete a user

  const toggleBan = async (evt) => {
    // allow an admin to toggle the ban status of a user
    user_id = evt.target.dataset.id;

    const response = await fetch(`/api/users/ban/${user_id}`, { method: 'PUT' });
    if (response.ok) {
      document.location.reload();
    } else {
      alert(`Failed to toggle banned status; ${response.statusText}`);
    }
  };

  const deleteUser = async (evt) => {
    // allow an admin to be deleted?
    user_id = evt.target.dataset.id;

    const OK = confirm('Are you sure you want to delete this user?');

    if (OK) {
      const response = await fetch(`/api/users/delete/${user_id}`, { method: 'DELETE' });
      if (response.ok) {
        document.location.reload();
      } else {
        alert(`Failed to delete user; ${response.statusText}`);
      }
    }
  };

  // click button to toggle user ban status
  document
    .querySelectorAll('button.ban')
    .forEach((el) => el.addEventListener('click', toggleBan));

  // delete user
  document
    .querySelectorAll('button.delete-user')
    .forEach((el) => el.addEventListener('click', deleteUser));

}, false);  // end DOM ready
