async function deleteFormHandler(event){
    event.preventDefault();

    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    await fetch(`/api/response/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        document.location.replace('/dashboard/single-post');
      } else {
        alert(response.statusText);
      } 
}

document.querySelector('.delete-response-btn').addEventListener('click', deleteFormHandler);