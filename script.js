let playlists = {}; // To store playlists and their songs
let currentPlaylist = null; // The currently selected playlist
let currentSongIndex = 0; // Index of the current song
const audio = new Audio();

// DOM Elements
const titleElement = document.getElementById("title");
const artistElement = document.getElementById("artist");
const coverElement = document.getElementById("cover");
const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const volumeSlider = document.getElementById("volume-slider");
const currentTimeDisplay = document.getElementById("current-time");
const totalTimeDisplay = document.getElementById("total-time");
const playlistContainer = document.getElementById("playlists-container");
const newPlaylistInput = document.getElementById("new-playlist-name");
const createPlaylistBtn = document.getElementById("create-playlist-btn");
const playlistSelect = document.getElementById("playlist-select");
const songInput = document.getElementById("song-input");

// Load playlists from localStorage
function loadPlaylists() {
    const storedPlaylists = localStorage.getItem("playlists");
    if (storedPlaylists) {
        playlists = JSON.parse(storedPlaylists);
        updatePlaylists();
    }
}

// Save playlists to localStorage
function savePlaylists() {
    localStorage.setItem("playlists", JSON.stringify(playlists));
}

// Update playlist UI
function updatePlaylists() {
    playlistContainer.innerHTML = "";
    playlistSelect.innerHTML = "<option>Select Playlist</option>";

    for (let playlist in playlists) {
        // Playlist in the UI
        const div = document.createElement("div");
        div.textContent = playlist;
        div.addEventListener("click", () => {
            currentPlaylist = playlist;
            currentSongIndex = 0;
            playSongFromPlaylist();
        });

        // Add delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            deletePlaylist(playlist);
        });

        div.appendChild(deleteBtn);
        playlistContainer.appendChild(div);

        // Playlist in the dropdown
        const option = document.createElement("option");
        option.textContent = playlist;
        option.value = playlist;
        playlistSelect.appendChild(option);
    }
}

// Create a playlist
createPlaylistBtn.addEventListener("click", () => {
    const playlistName = newPlaylistInput.value.trim();
    if (playlistName && !playlists[playlistName]) {
        playlists[playlistName] = [];
        updatePlaylists();
        savePlaylists(); // Save to localStorage
        newPlaylistInput.value = "";
    }
});

// Add songs to the playlist
songInput.addEventListener("change", (event) => {
    const selectedPlaylist = playlistSelect.value;
    if (!playlists[selectedPlaylist]) {
        alert("Select a valid playlist to add songs.");
        return;
    }

    Array.from(event.target.files).forEach(file => {
        const song = {
            title: file.name,
            artist: "Unknown Artist",
            src: URL.createObjectURL(file)
        };
        playlists[selectedPlaylist].push(song);
    });

    alert("Songs added to " + selectedPlaylist);
    songInput.value = "";
    savePlaylists(); // Save to localStorage
});

// Delete a playlist
function deletePlaylist(playlistName) {
    if (confirm(`Are you sure you want to delete the playlist: ${playlistName}?`)) {
        delete playlists[playlistName];
        updatePlaylists();
        savePlaylists(); // Save to localStorage
    }
}

// Play song from the current playlist
function playSongFromPlaylist() {
    if (!currentPlaylist || !playlists[currentPlaylist].length) {
        alert("No songs in the playlist!");
        return;
    }

    const song = playlists[currentPlaylist][currentSongIndex];
    titleElement.textContent = song.title;
    artistElement.textContent = song.artist;
    coverElement.src = "logo.webp"; // Set cover art if available
    audio.src = song.src;
    playSong();
}

// Play and pause song
function playSong() {
    audio.play();
    playBtn.textContent = "⏸"; // Pause icon
}

function pauseSong() {
    audio.pause();
    playBtn.textContent = "▶"; // Play icon
}

// Next and previous controls
nextBtn.addEventListener("click", () => {
    if (currentPlaylist) {
        currentSongIndex = (currentSongIndex + 1) % playlists[currentPlaylist].length;
        playSongFromPlaylist();
    }
});

prevBtn.addEventListener("click", () => {
    if (currentPlaylist) {
        currentSongIndex = (currentSongIndex - 1 + playlists[currentPlaylist].length) % playlists[currentPlaylist].length;
        playSongFromPlaylist();
    }
});

// Volume control
volumeSlider.addEventListener("input", (event) => {
    audio.volume = event.target.value;
});

// Play/Pause toggle
playBtn.addEventListener("click", () => {
    if (audio.paused) playSong();
    else pauseSong();
});

// Update duration
audio.addEventListener("timeupdate", () => {
    const currentTime = formatTime(audio.currentTime);
    const totalTime = formatTime(audio.duration);
    currentTimeDisplay.textContent = currentTime;
    totalTimeDisplay.textContent = totalTime || "0:00";
});

// Format time in mm:ss
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// Initialize
loadPlaylists();
updatePlaylists();
// Create a playlist
createPlaylistBtn.addEventListener("click", () => {
    const playlistName = newPlaylistInput.value.trim();
    if (playlistName && !playlists[playlistName]) {
        playlists[playlistName] = [];
        updatePlaylists();
        savePlaylists(); // Save to localStorage
        newPlaylistInput.value = "";
    }
});

// Update playlist UI
function updatePlaylists() {
    playlistContainer.innerHTML = "";
    playlistSelect.innerHTML = "<option>Select Playlist</option>";

    for (let playlist in playlists) {
        // Playlist in the UI
        const div = document.createElement("div");
        div.textContent = playlist;
        div.addEventListener("click", () => {
            currentPlaylist = playlist;
            currentSongIndex = 0;
            playSongFromPlaylist();
        });

        // Add delete button with same style as other buttons
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn"); // Add class for styling
        deleteBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            deletePlaylist(playlist);
        });

        div.appendChild(deleteBtn);
        playlistContainer.appendChild(div);

        // Playlist in the dropdown
        const option = document.createElement("option");
        option.textContent = playlist;
        option.value = playlist;
        playlistSelect.appendChild(option);
    }
}

// Delete a playlist
function deletePlaylist(playlistName) {
    if (confirm(`Are you sure you want to delete the playlist: ${playlistName}?`)) {
        delete playlists[playlistName];
        updatePlaylists();
        savePlaylists(); // Save to localStorage
    }
    
    
}

const progressBar = document.getElementById('progress-bar');

audio.addEventListener('loadedmetadata', () => {
    progressBar.max = audio.duration;
});

audio.addEventListener('timeupdate', () => {
    progressBar.value = audio.currentTime;
});

progressBar.addEventListener('input', () => {
    audio.currentTime = progressBar.value;
});

