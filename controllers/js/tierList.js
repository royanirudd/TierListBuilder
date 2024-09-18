const modal = document.getElementById('addItemModal');
const addItemBtn = document.getElementById('addItem');
const closeBtn = document.getElementsByClassName('close')[0];
const searchImagesBtn = document.getElementById('searchImages');
const imageOptions = document.getElementById('imageOptions');

addItemBtn.onclick = () => modal.style.display = "block";
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (event) => {
  if (event.target == modal) modal.style.display = "none";
}

searchImagesBtn.onclick = () => {
  const itemName = document.getElementById('itemName').value;
  const searchQuery = document.getElementById('searchQuery').value;
  
  // Simulate image search (replace with actual API call in production)
  const mockImages = [
    'https://via.placeholder.com/100x100?text=1',
    'https://via.placeholder.com/100x100?text=2',
    'https://via.placeholder.com/100x100?text=3',
    'https://via.placeholder.com/100x100?text=4',
    'https://via.placeholder.com/100x100?text=5'
  ];

  imageOptions.innerHTML = '';
  mockImages.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.onclick = () => addItemToTier(itemName, src);
    imageOptions.appendChild(img);
  });
}

function addItemToTier(name, imageSrc) {
  const item = document.createElement('div');
  item.className = 'tier-item';
  item.id = 'item-' + Date.now();
  item.style.backgroundImage = `url(${imageSrc})`;
  item.title = name;
  item.draggable = true;
  item.ondragstart = drag;

  document.getElementById('tier-S').appendChild(item);
  modal.style.display = "none";
}

function allowDrop(ev) {
  ev.preventDefault();
  ev.target.closest('.tier-items').classList.add('drag-over');
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
  const draggedElement = document.getElementById(data);
  
  const targetTier = ev.target.closest('.tier-items');
  
  if (draggedElement && targetTier) {
    targetTier.appendChild(draggedElement);
  }
  
  document.querySelectorAll('.tier-items').forEach(tier => {
    tier.classList.remove('drag-over');
  });
}

document.querySelectorAll('.tier-items').forEach(tierItems => {
  tierItems.ondragleave = (ev) => {
    ev.preventDefault();
    ev.target.closest('.tier-items').classList.remove('drag-over');
  };
});

function editTierName(element) {
  const currentName = element.innerText;
  const input = document.createElement('input');
  input.type = 'text';
  input.value = currentName;
  input.className = 'edit-tier-name';
  
  input.onblur = function() {
    element.innerText = this.value;
  }
  
  input.onkeypress = function(e) {
    if (e.key === 'Enter') {
      element.innerText = this.value;
    }
  }
  
  element.innerHTML = '';
  element.appendChild(input);
  input.focus();
}

document.getElementById('edit').addEventListener('click', () => {
  console.log('Edit clicked');
  // Implement additional edit functionality if needed
});

document.getElementById('export').addEventListener('click', () => {
  console.log('Export clicked');
  // Implement export functionality later
});
