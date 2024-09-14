
fetch('data.json')
  .then(response => response.json()) 
  .then(data => {
    console.log(data);
    renderFloorplan(data);
  })
  .catch(error => console.error('Error fetching the JSON file:', error));

function renderFloorplan(data) {
    const container = document.getElementById('floorplan-container');
    container.innerHTML = '';

    // Render Regions
    data.Regions.forEach(region => {
        const regionElement = document.createElement('div');
        regionElement.style.position = 'absolute';
        regionElement.style.border = '1px solid black';
        regionElement.style.backgroundColor = '#4682B4';
        regionElement.classList.add('region');

        const startX = region[0].X;
        const startY = region[0].Y;
        const endX = region[1].X;
        const endY = region[1].Y;

        const width = Math.abs(endX - startX);
        const height = Math.abs(endY - startY);

        regionElement.style.left = `${startX}px`;
        regionElement.style.top = `${startY}px`;
        regionElement.style.width = `${width}px`;
        regionElement.style.height = `${height}px`;

        container.appendChild(regionElement);
    });

    // Render Doors
    data.Doors.forEach(door => {
        const doorElement = document.createElement('div');
        doorElement.style.position = 'absolute';
        doorElement.style.backgroundColor = '#8B4513'; // Brown color for doors
        doorElement.style.width = `${door.Width}px`;
        doorElement.style.height = '10px';
        doorElement.classList.add('door');
        doorElement.style.left = `${door.Location.X}px`;
        doorElement.style.top = `${door.Location.Y}px`;
        doorElement.style.transform = `rotate(${door.Rotation}rad)`;

        doorElement.addEventListener('click', () => {
            alert(`Door Location: (${door.Location.X}, ${door.Location.Y})\nRotation: ${door.Rotation}`);
        });

        container.appendChild(doorElement);
    });

    // Render Furniture
    data.Furnitures.forEach(furniture => {
        const furnitureElement = document.createElement('div');
        furnitureElement.style.position = 'absolute';
        furnitureElement.style.backgroundColor = 'black'; // Blue color for furniture
        furnitureElement.classList.add('furniture');

        const width = Math.abs(furniture.MaxBound.X - furniture.MinBound.X);
        const height = Math.abs(furniture.MaxBound.Y - furniture.MinBound.Y);

        furnitureElement.style.width = `${width}px`;
        furnitureElement.style.height = `${height}px`;
        furnitureElement.style.left = `${furniture.xPlacement}px`;
        furnitureElement.style.top = `${furniture.yPlacement}px`;
        furnitureElement.style.transform = `rotate(${furniture.rotation}rad)`;
        furnitureElement.title = furniture.equipName;

        makeFurnitureDraggable(furnitureElement);
        container.appendChild(furnitureElement);
    });
}

function makeFurnitureDraggable(furnitureElement) {
    let offsetX, offsetY, isDragging = false;

    furnitureElement.addEventListener('mousedown', (e) => {
        offsetX = e.clientX - furnitureElement.getBoundingClientRect().left;
        offsetY = e.clientY - furnitureElement.getBoundingClientRect().top;
        isDragging = true;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            furnitureElement.style.left = `${e.clientX - offsetX}px`;
            furnitureElement.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

const floorplanContainer = document.getElementById('floorplan-container');
let posX = 0, posY = 0, scale = 0.8;

document.addEventListener('keydown', (e) => {
    const step = 10;

    switch(e.key) {
        case 'ArrowUp':
            posY += step;
            break;
        case 'ArrowDown':
            posY -= step;
            break;
        case 'ArrowLeft':
            posX += step;
            break;
        case 'ArrowRight':
            posX -= step;
            break;
    }

    updateTransform();
    


});
//Zoom Functionalities
const zoomInButton = document.getElementById('zoom-in');
const zoomOutButton = document.getElementById('zoom-out');
const resetViewButton = document.getElementById('reset-view');
const zoomSlider = document.getElementById('zoom-slider');

zoomInButton.addEventListener('click', () => {
    scale = Math.min(scale + 0.1, 2);
    updateTransform();
});

zoomOutButton.addEventListener('click', () => {
    scale = Math.max(scale - 0.1, 0.5);
    updateTransform();
});

resetViewButton.addEventListener('click', () => {
    scale = 0.8;
    posX = 0;
    posY = 0;
    updateTransform();
});

zoomSlider.addEventListener('input', () => {
    scale = parseFloat(zoomSlider.value);
    updateTransform();
});

function updateTransform() {
    floorplanContainer.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
}
//Save function
document.getElementById('save-state').addEventListener('click', () => {
    const state = {
        zoom: scale,
        position: { x: posX, y: posY }
    };
    localStorage.setItem('floorplanState', JSON.stringify(state));
    alert('Your data has been saved successfully!');
});
//Load function
document.getElementById('load-state').addEventListener('click', () => {
    const state = JSON.parse(localStorage.getItem('floorplanState'));
    if (state) {
        scale = state.zoom;
        posX = state.position.x;
        posY = state.position.y;
        updateTransform();
        alert('Your data has been loaded');
    } else {
        alert('No saved data found.');
    }
});
