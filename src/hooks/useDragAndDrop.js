import { useState, useRef } from 'react';

const useDragAndDrop = (items, onReorder) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const dragCounter = useRef(0);

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    const dragImage = e.currentTarget.cloneNode(true);
    dragImage.style.transform = 'rotate(5deg)';
    dragImage.style.opacity = '0.8';
    e.dataTransfer.setDragImage(dragImage, 0, 0);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
    dragCounter.current = 0;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    dragCounter.current++;
    setDragOverIndex(index);
  };

  const handleDragLeave = (e) => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    
    if (draggedItem !== null && draggedItem !== dropIndex) {
      const newItems = [...items];
      const draggedItemData = newItems[draggedItem];
      
      // Remove the dragged item from its current position
      newItems.splice(draggedItem, 1);
      
      // Calculate the correct insert position
      const insertIndex = draggedItem < dropIndex ? dropIndex - 1 : dropIndex;
      
      // Insert the item at the new position
      newItems.splice(insertIndex, 0, draggedItemData);
      onReorder(newItems);
    }
    
    // Reset drag state
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const getDragProps = (index) => ({
    draggable: true,
    onDragStart: (e) => handleDragStart(e, index),
    onDragEnd: handleDragEnd,
    onDragOver: handleDragOver,
    onDragEnter: (e) => handleDragEnter(e, index),
    onDragLeave: handleDragLeave,
    onDrop: (e) => handleDrop(e, index),
    'data-dragging': draggedItem === index,
    'data-drag-over': dragOverIndex === index,
  });

  return {
    draggedItem,
    dragOverIndex,
    getDragProps,
  };
};

export default useDragAndDrop;