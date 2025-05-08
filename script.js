
    document.addEventListener('DOMContentLoaded', () => {
      // Generate initial palette
      generatePalette();
      
      // Load saved palettes
      loadSavedPalettes();
      
      // Event listeners
      document.getElementById('generateBtn').addEventListener('click', generatePalette);
      document.getElementById('saveBtn').addEventListener('click', savePalette);
    });

    function generateRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    function generatePalette() {
      const paletteContainer = document.getElementById('colorPalette');
      paletteContainer.innerHTML = '';
      
      for (let i = 0; i < 5; i++) {
        const color = generateRandomColor();
        const colorBox = createColorBox(color);
        paletteContainer.appendChild(colorBox);
      }
    }

    function createColorBox(colorHex) {
      const box = document.createElement('div');
      box.className = 'color-box';
      box.style.backgroundColor = colorHex;
      box.setAttribute('data-color', colorHex);
      
      // Add tooltip
      const tooltip = document.createElement('span');
      tooltip.className = 'tooltip';
      tooltip.textContent = 'Click to copy';
      box.appendChild(tooltip);
      
      // Add color code text
      const colorText = document.createElement('span');
      colorText.textContent = colorHex.toUpperCase();
      colorText.className = 'color-text';
      box.appendChild(colorText);
      
      // Copy to clipboard on click
      box.addEventListener('click', function() {
        navigator.clipboard.writeText(colorHex).then(() => {
          tooltip.textContent = 'Copied!';
          setTimeout(() => {
            tooltip.textContent = 'Click to copy';
          }, 2000);
        });
      });
      
      return box;
    }

    function savePalette() {
      const colorBoxes = document.querySelectorAll('#colorPalette .color-box');
      const colors = Array.from(colorBoxes).map(box => box.getAttribute('data-color'));
      
      if (colors.length === 0) return;
      
      // Get existing saved palettes or initialize empty array
      const savedPalettes = JSON.parse(localStorage.getItem('colorPalettes') || '[]');
      
      // Add new palette with timestamp as ID
      savedPalettes.push({
        id: Date.now(),
        colors: colors
      });
      
      // Save to local storage
      localStorage.setItem('colorPalettes', JSON.stringify(savedPalettes));
      
      // Update UI
      loadSavedPalettes();
    }

    function loadSavedPalettes() {
      const container = document.getElementById('savedPalettes');
      const noSavedMessage = document.getElementById('noSavedMessage');
      
      // Get saved palettes from local storage
      const savedPalettes = JSON.parse(localStorage.getItem('colorPalettes') || '[]');
      
      // Clear container
      container.innerHTML = '';
      
      // Show/hide "no saved" message
      if (savedPalettes.length === 0) {
        container.appendChild(noSavedMessage);
      } else {
        // Add saved palettes to UI
        savedPalettes.forEach((palette, index) => {
          const paletteCard = document.createElement('div');
          paletteCard.className = 'saved-palette';
          
          // Header with delete button
          const header = document.createElement('div');
          header.className = 'saved-palette-header';
          
          const title = document.createElement('h3');
          title.className = 'saved-palette-title';
          title.textContent = `Palette ${index + 1}`;
          
          const deleteBtn = document.createElement('button');
          deleteBtn.className = 'delete-btn';
          deleteBtn.innerHTML = '&times;';
          deleteBtn.onclick = () => deletePalette(palette.id);
          
          header.appendChild(title);
          header.appendChild(deleteBtn);
          paletteCard.appendChild(header);
          
          // Color boxes
          const colorsContainer = document.createElement('div');
          colorsContainer.className = 'saved-colors';
          
          palette.colors.forEach(color => {
            const miniColorBox = document.createElement('div');
            miniColorBox.className = 'saved-color';
            miniColorBox.style.backgroundColor = color;
            
            // Add tooltip
            const tooltip = document.createElement('span');
            tooltip.className = 'tooltip';
            tooltip.textContent = 'Click to copy';
            miniColorBox.appendChild(tooltip);
            
            miniColorBox.onclick = () => {
              navigator.clipboard.writeText(color).then(() => {
                tooltip.textContent = 'Copied!';
                setTimeout(() => {
                  tooltip.textContent = 'Click to copy';
                }, 2000);
              });
            };
            
            colorsContainer.appendChild(miniColorBox);
          });
          
          paletteCard.appendChild(colorsContainer);
          container.appendChild(paletteCard);
        });
      }
    }

    function deletePalette(id) {
      // Get saved palettes
      const savedPalettes = JSON.parse(localStorage.getItem('colorPalettes') || '[]');
      
      // Filter out the palette to delete
      const updatedPalettes = savedPalettes.filter(palette => palette.id !== id);
      
      // Save updated list
      localStorage.setItem('colorPalettes', JSON.stringify(updatedPalettes));
      
      // Update UI
      loadSavedPalettes();
    }