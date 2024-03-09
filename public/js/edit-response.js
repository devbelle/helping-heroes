async function editFormHandler(event) {
    event.preventDefault();

    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    
    const content = document.querySelector('textarea[name="response-content"]').value;

    const response = await fetch(`/api/response/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            content
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.replace('/dashboard/single-post');
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.edit-response-form').addEventListener('submit', editFormHandler);