let editMode = false;
let itemCounter = 0;

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
  ev.target.closest('.tier-items').appendChild(document.getElementById(data));
}

function addItem(name, imageSrc) {
  const item = document.createElement('div');
  item.className = 'tier-item';
  item.id = `item-${itemCounter++}`;
  item.style.backgroundImage = `url(${imageSrc})`;
  item.title = name;
  item.draggable = true;
  item.ondragstart = drag;
  document.querySelector('.tier-items').appendChild(item);
}

const addItemBtn = document.getElementById('addItem');
const modal = document.getElementById('addItemModal');
const closeBtn = document.getElementsByClassName('close')[0];
const itemNameInput = document.getElementById('itemName');
const searchQueryInput = document.getElementById('searchQuery');
const searchImagesBtn = document.getElementById('searchImages');
const imageOptions = document.getElementById('imageOptions');

const shareBtn = document.getElementById('share');
const shareModal = document.getElementById('shareModal');
const emailShareBtn = document.getElementById('emailShare');
const forumShareBtn = document.getElementById('forumShare');
const emailModal = document.getElementById('emailModal');
const emailInput = document.getElementById('emailInput');
const sendEmailBtn = document.getElementById('sendEmail');

// Function to close all modals
function closeAllModals() {
  const modals = [modal, shareModal, emailModal];
  modals.forEach(m => m.style.display = "none");
}

// Event listener for all close buttons
document.querySelectorAll('.close').forEach(closeBtn => {
  closeBtn.addEventListener('click', closeAllModals);
});

// Event listener for clicking outside the modal
window.addEventListener('click', (event) => {
  if (event.target.classList.contains('modal')) {
    closeAllModals();
  }
});

shareBtn.addEventListener('click', () => {
  shareModal.style.display = "block";
});

emailShareBtn.addEventListener('click', () => {
  shareModal.style.display = "none";
  emailModal.style.display = "block";
});

forumShareBtn.addEventListener('click', () => {
  // Placeholder for forum functionality
  alert("Forum sharing functionality coming soon!");
});

sendEmailBtn.addEventListener('click', () => {
  const email = emailInput.value;
  if (email) {
    // Capture the tier list as an image
    html2canvas(document.querySelector('.tier-list')).then(canvas => {
      const imageData = canvas.toDataURL('image/png');
      
      // Send the image data to the server
      fetch('/share/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, imageData }),
      })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        closeAllModals();
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while sending the email.');
      });
    });
  } else {
    alert('Please enter a valid email address.');
  }
});

addItemBtn.onclick = () => {
  modal.style.display = "block";
}

searchImagesBtn.onclick = () => {
  const query = searchQueryInput.value;
  if (!query) {
    alert('Please enter a search query');
    return;
  }

  fetch(`/search-images?query=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
      imageOptions.innerHTML = '';
      data.results.forEach(image => {
        const img = document.createElement('img');
        img.src = image.urls.thumb;
        img.onclick = () => {
          addItem(itemNameInput.value || query, image.urls.regular);
          closeAllModals();
        }
        imageOptions.appendChild(img);
      });
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while searching for images.');
    });
}

const editBtn = document.getElementById('edit');

function enterEditMode() {
  const tierLabels = document.querySelectorAll('.tier-label');
  tierLabels.forEach(label => {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = label.textContent;
    input.className = 'edit-tier-name';
    label.textContent = '';
    label.appendChild(input);
  });
  editBtn.textContent = 'Save Changes';
}

function exitEditMode() {
  const tierLabels = document.querySelectorAll('.tier-label');
  tierLabels.forEach(label => {
    const input = label.querySelector('input');
    if (input) {
      label.textContent = input.value;
    }
  });
  editBtn.textContent = 'Edit';
}

editBtn.addEventListener('click', () => {
  editMode = !editMode;
  if (editMode) {
    enterEditMode();
  } else {
    exitEditMode();
  }
});

const exportBtn = document.getElementById('export');

function exportTierList() {
  // Hide the buttons during capture
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => button.style.display = 'none');

  html2canvas(document.querySelector('.tier-list')).then(canvas => {
    // Show the buttons again
    buttons.forEach(button => button.style.display = '');

    // Convert the canvas to a data URL
    const imageData = canvas.toDataURL('image/png');

    // Create a link element and trigger the download
    const link = document.createElement('a');
    link.href = imageData;
    link.download = 'tier-list.png';
    link.click();
  });
}

exportBtn.addEventListener('click', exportTierList);

document.addEventListener('DOMContentLoaded', () => {
  const addItemBtn = document.getElementById('addItem');
  const exportBtn = document.getElementById('export');

  addItemBtn.addEventListener('click', () => {
    modal.style.display = "block";
  });

  exportBtn.addEventListener('click', exportTierList);
});
