
document.getElementById('addBookForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Get form data
    const formData = new FormData(this);

    // Read the selected image file as Data URL
    const imageFile = formData.get('image');
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const imageDataUrl = event.target.result; // Image data as Data URL

        // Convert form data to JSON
        const jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });

        // Replace the image file with its Base64 representation in the JSON data
        jsonData.image = imageDataUrl;

        // Make POST request to add the book
        fetch('http://localhost:3000/addBook', {
            credentials: 'same-origin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Book added successfully:', data);
                location.reload();
                // Optionally, you can redirect or show a success message here
            })
            .catch(error => {
                console.error('Error adding book:', error);
            });
    };

    // Read the selected image file
    fileReader.readAsDataURL(imageFile);
});