// ============================================================
// scripts.js — Frontend Logic
// ============================================================
// This file handles all the user interaction on the page:
//   1. Fetches game data from our backend API
//   2. Renders game cards dynamically on the page
//   3. Lets users Edit (update) or Delete game records
//   4. Sorts games alphabetically (A-Z or Z-A)
// ============================================================

// --- Grab references to HTML elements we need ---
const grid       = document.getElementById('cardsGrid');    // The container where cards will be inserted
const emptyState = document.getElementById('emptyState');   // "No results" message (hidden by default)
const sortSelect = document.getElementById('sortSelect');   // The sort dropdown (<select>)

// Store all game data so we can re-sort without fetching again
let gameData = [];

// ============================================================
// FETCH (READ) — Get all games from the server
// ============================================================
// Calls our backend:  GET /api/quebec
// The backend queries MongoDB and returns an array of game objects
async function fetchData() {
  try {
    const response = await fetch('/api/quebec');

    // Check if the server responded with an error (e.g., 500)
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    // Parse the JSON response into a JavaScript array
    gameData = await response.json();

    // Sort and display the cards
    sortAndRender();
  } catch (err) {
    console.error('Error fetching data:', err);
  }
}

// ============================================================
// SORT — Sort the games and re-render the cards
// ============================================================
// Reads the dropdown value ('asc' or 'desc') and sorts by name
function sortAndRender() {
  const direction = sortSelect.value;  // 'asc' or 'desc'

  // Create a copy of the array so we don't mutate the original
  const sorted = [...gameData].sort((a, b) => {
    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();

    if (direction === 'asc') {
      return nameA.localeCompare(nameB);   // A → Z
    } else {
      return nameB.localeCompare(nameA);   // Z → A
    }
  });

  renderCards(sorted);
}

// ============================================================
// UPDATE — Change a game's name
// ============================================================
// Called when user clicks the "Edit" button on a card
// Sends:  PUT /api/quebec/:id  with { name: "New Name" } in the body
async function updateItem(id, oldName) {
  // Show a browser prompt with the current name pre-filled
  const newName = prompt('Enter new name for this game:', oldName);

  // If the user clicked Cancel, or typed the same name, do nothing
  if (!newName || newName === oldName) return;

  try {
    const response = await fetch(`/api/quebec/${id}`, {
      method: 'PUT',                                     // HTTP method for updates
      headers: { 'Content-Type': 'application/json' },   // Tell the server we're sending JSON
      body: JSON.stringify({ name: newName })             // Convert { name: "..." } to a JSON string
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    // Re-fetch all data to show the updated name
    fetchData();
  } catch (err) {
    console.error('Error updating item:', err);
  }
}

// ============================================================
// DELETE — Remove a game record
// ============================================================
// Called when user clicks the "Delete" button on a card
// Sends:  DELETE /api/quebec/:id
async function deleteItem(id) {
  // Ask the user to confirm before deleting
  if (!confirm('Are you sure you want to delete this game?')) return;

  try {
    const response = await fetch(`/api/quebec/${id}`, {
      method: 'DELETE'    // HTTP method for deletion
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    // Re-fetch all data to remove the deleted card from the page
    fetchData();
  } catch (err) {
    console.error('Error deleting item:', err);
  }
}

// ============================================================
// RENDER — Build the HTML cards and insert them into the page
// ============================================================
// Each game object from MongoDB looks like:
//   { _id: "abc123", name: "Tic Tac Toe", img: "https://...", app: "https://...", repo: "https://..." }
function renderCards(data) {
  // Clear all existing cards
  grid.innerHTML = '';

  // If there are no games, show the "No results" message
  if (data.length === 0) {
    emptyState.classList.remove('d-none');   // Show it (remove the Bootstrap "hidden" class)
    return;
  }
  emptyState.classList.add('d-none');       // Hide it

  // Loop through each game and create a card
  data.forEach(item => {
    // Create a Bootstrap column div
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-lg-4';   // Responsive: 1 col on mobile, 2 on tablet, 3 on desktop

    // Escape the name so special characters don't break the HTML
    // e.g., a name like: Rock 'n Roll  →  Rock \'n Roll  (safe for onclick)
    // e.g., a name like: <script>      →  &lt;script&gt; (safe for display)
    const safeName    = (item.name || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
    const displayName = (item.name || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Build the card HTML using a template literal (backtick string)
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img class="card-img-top" src="${item.img || ''}" alt="${displayName}">
        <div class="card-body">
          <h5 class="card-title fw-bold">${displayName}</h5>
          <div class="d-grid gap-2">
            <a class="btn btn-primary btn-sm" href="${item.app}" target="_blank">Play App</a>
            <a class="btn btn-outline-secondary btn-sm" href="${item.repo}" target="_blank">Repository</a>
            <div class="d-flex gap-2">
              <button class="btn btn-warning btn-sm flex-grow-1" onclick="updateItem('${item._id}', '${safeName}')">Edit</button>
              <button class="btn btn-danger btn-sm flex-grow-1" onclick="deleteItem('${item._id}')">Delete</button>
            </div>
          </div>
        </div>
      </div>`;

    // Add the card to the grid
    grid.appendChild(col);
  });
}
document.getElementById('game-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const gameData = {
        name: document.getElementById('name').value,
        repo: document.getElementById('repo').value,
        app: document.getElementById('app').value,
        image: document.getElementById('image').value
    };

    try {
        const response = await fetch('/api/quebec', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gameData)
        });

        if (response.ok) {
            alert('Game added successfully!');
            location.reload(); // Reload the page to fetch and display the new game
        } else {
            alert('Failed to add game.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
// ============================================================
// EVENT LISTENERS — Wire up user interactions
// ============================================================

// When the user changes the sort dropdown, re-sort and re-render
sortSelect.addEventListener('change', sortAndRender);

// ============================================================
// INITIALIZE — Run when the page first loads
// ============================================================
fetchData();
