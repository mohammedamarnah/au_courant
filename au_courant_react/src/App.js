import './App.css';

// react imports
import { useState, useEffect } from 'react';

// 3rd party libraries
import { SimpleGrid, ChakraProvider } from '@chakra-ui/react';
import { sortBy } from 'underscore';
import Countdown from 'react-countdown';

// helpers
import { cleanJSON } from './Helpers';

// components
import RepoForm from './components/RepoForm';
import Header from './components/Header';
import Repo from './components/Repo';

function App() {
  const [repos, setRepos] = useState([]);
  const [currentTimeIndex, setTimeIndex] = useState(0);

  useEffect(() => {
    fetch("http://localhost:4432/repos")
      .then(response => response.text())
      .then(data => setRepos(JSON.parse(cleanJSON(data)).repositories))
      .catch(error => console.log(error));
  }, []);

  const refreshRepos = () => {
    fetch("http://localhost:4432/refresh-repos", { method: "PUT" })
      .then(response => response.text())
      .then(data => {
        setRepos(JSON.parse(cleanJSON(data)).repositories);
        setTimeIndex(Date.now());
      })
      .catch(error => console.log(error));
  }

  const countdownRenderer = ({ hours, minutes, seconds }) => {
    let hoursStr = "";
    let minutesStr = "";
    if (hours) hoursStr = `${hours} hours and`
    if (minutes) minutesStr = `${minutes} minutes and`
    return (
      <p>Auto updating in {hoursStr} {minutesStr} {seconds} seconds</p>
    )
  }

  let sortedRepos = sortBy(repos, 'id');
  sortedRepos = sortBy(sortedRepos, 'seen_state');
  const repoComponents = sortedRepos.map((r) => {
    return (
      <Repo
        key={r.id}
        repo={r}
        updateRepos={setRepos}
        resetTimer={setTimeIndex} />
    )
  });

  return (
    <ChakraProvider>
      <div className="App">

        <Header />

        <br />

        <RepoForm 
          updateRepos={setRepos} 
          resetTimer={setTimeIndex} />

        <br />

        <Countdown
          date={Date.now() + (1000 * 60 * 60 * 60)}
          key={currentTimeIndex}
          onComplete={refreshRepos}
          renderer={countdownRenderer} />

        <br />

        <SimpleGrid
          bg='gray.50'
          minChildWidth='250px'
          spacing='8'
          p='10'
          textAlign='center'
          rounded='lg'
          color='gray.400'>
          {repoComponents}
        </SimpleGrid>

      </div>
    </ChakraProvider>
  );
}

export default App;
