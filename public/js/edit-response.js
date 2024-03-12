async function editFormHandler(event) {
    event.preventDefault();

    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    
    const content = document.querySelector('textarea[name="response-content"]').value;

    console.log({content})

    const response = await fetch(`/api/responses/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            content
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert(response.statusText);
    }
}

document.getElementById('edit-response-form').addEventListener('submit', editFormHandler);