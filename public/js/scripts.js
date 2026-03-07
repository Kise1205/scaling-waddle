const grid = document.getElementById('cardsGrid');

/**
 * READ: Fetch all game records from the MongoDB Atlas via our Express API
 */
async function fetchData() {
    try {
        // Calling the unified API endpoint
        const response = await fetch('/api/quebec');
        const data = await response.json();
        renderCards(data);
    } catch (err) {
        console.error("API Error while fetching data:", err);
    }
}

/**
 * UPDATE: Modify the 'name' field of a specific game record
 * @param {string} id - The MongoDB ObjectId of the record
 * @param {string} oldName - The current name to show in the prompt
 */
async function updateItem(id, oldName) {
    const newName = prompt("Enter new name for this game:", oldName);
    
    // Validation: Only proceed if a name was entered and it's different from the old one
    if (!newName || newName === oldName) return;

    try {
        await fetch(`/api/quebec/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            // We only update the name field as requested
            body: JSON.stringify({ name: newName })
        });
        // Refresh the UI with updated data from the database
        fetchData();
    } catch (err) {
        console.error("API Error while updating item:", err);
    }
}

/**
 * DELETE: Remove a game record from the database
 * @param {string} id - The MongoDB ObjectId
 */
async function deleteItem(id) {
    if (confirm("Are you sure you want to delete this game?")) {
        try {
            await fetch(`/api/quebec/${id}`, { method: 'DELETE' });
            // Refresh the UI after deletion
            fetchData();
        } catch (err) {
            console.error("API Error while deleting item:", err);
        }
    }
}

/**
 * RENDER: Dynamically create HTML cards for each game object
 * @param {Array} data - Array of game objects from the API
 */
function renderCards(data) {
    grid.innerHTML = '';
    data.forEach(item => {
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-lg-4';
        
        // Using real database fields: name, img, app, repo
        col.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img class="card-img-top" src="${item.img || ''}" alt="${item.name}">
                <div class="card-body">
                    <h5 class="card-title fw-bold">${item.name}</h5>
                    <div class="d-grid gap-2">
                        <a class="btn btn-primary btn-sm" href="${item.app}" target="_blank">Play App</a>
                        <a class="btn btn-outline-secondary btn-sm" href="${item.repo}" target="_blank">Repository</a>
                        <div class="d-flex gap-2">
                            <button class="btn btn-warning btn-sm flex-grow-1" onclick="updateItem('${item._id}', '${item.name}')">Edit</button>
                            <button class="btn btn-danger btn-sm flex-grow-1" onclick="deleteItem('${item._id}')">Delete</button>
                        </div>
                    </div>
                </div>
            </div>`;
        grid.appendChild(col);
    });
}

// Initial call to load data when the page opens
fetchData();