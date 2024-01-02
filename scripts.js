// Function to create a new user
async function createUser() {
    const userName = document.getElementById('userName').value;
    const userEmail = document.getElementById('userEmail').value;
    const userPassword = document.getElementById('userPassword').value;
    const userCreationUser = document.getElementById('userCreationUser').value;
    const userModificationUser = document.getElementById('userModificationUser').value;

    try {
        const response = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: userName,
                email: userEmail,
                password: userPassword,
                creationUser: userCreationUser,
                modificationUser: userModificationUser,
            }),
        });

        const data = await response.json();
        console.log(data);

        // Add logic to handle the response as needed
    } catch (error) {
        console.error('Error creating user:', error);
        // Add logic to handle errors
    }
}

// Add similar functions for creating classrooms
