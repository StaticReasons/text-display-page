import React, { useEffect, useState } from 'react';
import './App.css';

import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import VerticalAlignCenterIcon from '@mui/icons-material/VerticalAlignCenter';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';

function App() {
  // const [textList, setTextList] = useState(['1', '2', '3', '4', '5']);
  const [textList, setTextList] = useState(['Write a text here']);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    // Load data from localStorage every time the page is loaded
    let savedTextList;
    try {
      savedTextList = JSON.parse(localStorage['textList']);
    } catch (e) { return; }
    if (!(Array.isArray(savedTextList) && savedTextList.length !== 0)) return;
    setTextList([...savedTextList]);

    let hash = window.location.hash ? parseInt(window.location.hash.slice(1)) : 0;
    let index = hash >= 0 && hash < savedTextList.length ? hash : 0;
    setSelectedIndex(index);
    window.location.hash = index;
  }, []);

  // Save data to localStorage when setting textList
  const setTextListWithSave = (newTextList) => {
    setTextList(newTextList);
    localStorage['textList'] = JSON.stringify(newTextList);
  }

  const indexValid = (index) => index >= 0 && index < textList.length;
  let currentText = indexValid(selectedIndex) ? textList[selectedIndex] : '';
  const setCurrentText = (text) => {
    if (!indexValid(selectedIndex)) return;
    const newTextList = [...textList];
    newTextList[selectedIndex] = text;
    setTextListWithSave(newTextList);
  }

  const handleInputChange = (event) => {
    setCurrentText(event.target.value);
  };

  const handleSelect = (index) => {
    if (!indexValid(index)) return;
    setSelectedIndex(i => index);
  }

  const handleAddText = (index) => {
    if (!indexValid(index)) return;
    const newTextList = [...textList];
    newTextList.splice(index + 1, 0, '');
    setSelectedIndex(index + 1);
    setTextListWithSave(newTextList);
    document.getElementById('input').focus();
  };

  const handleDeleteText = (index) => {
    if (!indexValid(index)) return;
    if (textList.length <= 1) {
      setTextListWithSave(['']);
      setSelectedIndex(0);
      return;
    }
    setTextListWithSave(textList.filter((_, i) => i !== index));
    // console.log(`selectedIndex: ${selectedIndex} index: ${index}`);
    if (index === selectedIndex) {
      setSelectedIndex(Math.max(index - 1, 0));
    }
  };

  const handleMoveTextLeft = (index) => {
    if (!(indexValid(index) && index > 0)) return;
    const newTexts = [...textList];
    const temp = newTexts[index];
    newTexts[index] = newTexts[index - 1];
    newTexts[index - 1] = temp;
    setTextListWithSave(newTexts);
    setSelectedIndex(index - 1);
  };

  const handleMoveTextRight = (index) => {
    if (!(indexValid(index) && index < textList.length - 1)) return;
    const newTexts = [...textList];
    const temp = newTexts[index];
    newTexts[index] = newTexts[index + 1];
    newTexts[index + 1] = temp;
    setTextListWithSave(newTexts);
    setSelectedIndex(index + 1);
  };


  return (
    <div className="container">
      <div className="display-container display-text-center">
        <div className="display-text" id="display-text">
          {currentText}
        </div>
      </div>
      <div className="input-line">
        <input
          type="text"
          id="input"
          value={currentText}
          onChange={handleInputChange}
        />
        <button onClick={() => 
          document.getElementById("display-text").parentElement.classList = "display-container display-text-top"}>
          <VerticalAlignTopIcon />
        </button>
        <button onClick={() => 
          document.getElementById("display-text").parentElement.classList = "display-container display-text-center"}>
          <VerticalAlignCenterIcon />
        </button>
        <button onClick={() => 
          document.getElementById("display-text").parentElement.classList = "display-container display-text-bottom"}>
          <VerticalAlignBottomIcon />
        </button>
      </div>
      <div className="text-list-container" onWheel={(e) => e.currentTarget.scrollLeft += e.deltaY * 0.6}>
        <div className="text-list">
          {textList.map((text, index) => (
            <div key={index} className={`text-card ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => { handleSelect(index); window.location.hash = index}}>
              <div className='card-inner'>
                <div className='card-buttons'>
                  <button onClick={(event) => { event.stopPropagation(); handleAddText(index) }}><AddIcon /></button>
                  <button onClick={(event) => { event.stopPropagation(); handleMoveTextLeft(index) }} disabled={index === 0}><ArrowBackIcon /></button>
                  <button onClick={(event) => { event.stopPropagation(); handleMoveTextRight(index) }} disabled={index === textList.length - 1}><ArrowForwardIcon /></button>
                  <button onClick={(event) => { event.stopPropagation(); handleDeleteText(index) }}><CloseIcon /></button>
                </div>
                <div className='text-container'>
                  <div className='text'>{text}</div>
                </div>
                <div className='card-padding' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;