import './App.css';
import React, { useState, useEffect } from 'react';

function App() {

  const [words, setWords] = useState(null)
  const [letters, setLetters] = useState(null)
  const [filteredWords, setFilterWords] = useState(null)
  const [rearrangedWords, setRearrangedWords] = useState(null)
  const [possibleAnswers, setPossibleAnswers] = useState(null)
  const [answer, setAnswer] = useState(null)

  useEffect(() => {
    fetchWords()
  }, [letters])

  useEffect(() => {
    filterWords()
  }, [words])

  useEffect(() => {
    rearrangeWords()
  }, [filteredWords])

  useEffect(() => {
    markLetters()
  }, [rearrangedWords])

  useEffect(() => {
    createAnswer()
  }, [possibleAnswers])

  const getLettersArr = () => {
    let lettersArr = []

    for (const letter in letters) {
      lettersArr.push(letters[letter])
    }
    return lettersArr.join('')
  }

  const fetchWords = async () => {
    let wordsArr = []
    const letters = getLettersArr()
    if (!letters) {
      return
    }
    const data = await fetch(`https://fly.wordfinderapi.com/api/search?letters=${letters}&word_sorting=points&group_by_length=true&page_size=20&dictionary=otcwl`)
    const res = await data.json()
    const pages = res.word_pages
    for (let i = 0; i < pages.length; i++) {
      pages[i].word_list.map((word) => {
        wordsArr.push(word.word)
      })

    }
    setWords(wordsArr)
  }

  const filterWords = () => {
    if (!words) {
      return
    }
    let newWords = words
    let filteredWords = []
    for (let i = 0; i < newWords.length; i++) {
      let count = 0
      for (let j = 0; j < newWords[i].length; j++) {
        const check = Object.keys(letters).find(k => letters[k].includes(newWords[i][j]));
        const next = Object.keys(letters).find(k => letters[k].includes(newWords[i][j + 1]))
        if (next && check === next) {
          count++
        } else if (!count && !next) {
          filteredWords.push(newWords[i])
          count = 0
        }
      }
    }
    setFilterWords(filteredWords.filter(word => word.length > 2))
  }

  const rearrangeWords = () => {
    const words = filteredWords
    const wordsArr = []
    if (!words) {
      return
    }
    for (let i = 0; i < words.length; i++) {
      for (let j = 0; j < words.length; j++) {
        for (let k = 0; k < words.length; k++) {
          if (words[i].endsWith(words[j][0]) && words[j].endsWith(words[k][0])) {
            wordsArr.push([words[i], words[j], words[k]])
            for (let l = 0; l < words.length; l++) {
              if (words[k].endsWith(words[l][0])) {
                wordsArr.push([words[i], words[j], words[k], words[l]])
                for (let p = 0; p < words.length; ++p) {
                  if (words[l].endsWith(words[p][0])) {
                    wordsArr.push([words[i], words[j], words[k], words[l], words[p]])
                    for (let o = 0; o < words.length; ++o) {
                      if (words[p].endsWith(words[o][0])) {
                        wordsArr.push([words[i], words[j], words[k], words[l], words[p], words[o]])
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    setRearrangedWords(wordsArr)
  }

  const markLetters = () => {
    const words = rearrangedWords
    const wordsArr = []
    if (!words) {
      return
    }
    for (let i = 0; i < words.length; i++) {
      let count = 0
      let check = []
      let word = words[i].join('')
      for (let j = 0; j < word.length; j++) {
        if (check.includes(word[j])) {
          continue
        } else {
          count++
          check.push(word[j])
        }
      }
      if (count == 12) {
        wordsArr.push(words[i])
      }
    }
    wordsArr.sort((a, b) => a.length - b.length)
    setPossibleAnswers(wordsArr)
  }

  const createAnswer = () => {
    if (possibleAnswers) {
      const newAnswer = []
      possibleAnswers.map(word => newAnswer.push(word))
      setAnswer(newAnswer)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let group1 = document.getElementById('group1').value
    let group2 = document.getElementById('group2').value
    let group3 = document.getElementById('group3').value
    let group4 = document.getElementById('group4').value
    if (group1.length != 3 || group2.length != 3 || group3.length != 3 || group4.length != 3) {
      return
    }
    setLetters({
      group1: group1,
      group2: group2,
      group3: group3,
      group4: group4,
    })
    fetchWords()
  }

  const handleChange = () => {
    
  }

  return (
    <div className="App">
      <input id='group1' onChange={handleChange} maxLength='3'></input>
      <input id='group2' onChange={handleChange} maxLength='3'></input>
      <input id='group3' onChange={handleChange} maxLength='3'></input>
      <input id='group4' onChange={handleChange} maxLength='3'></input>
      <button onClick={handleSubmit}>Submit</button>
      <h1>{answer}</h1>
    </div>
  );
}



export default App;
