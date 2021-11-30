import './App.css';

import { useState, useEffect } from 'react';
import { cleanJSON } from './Helpers';

import Countdown from 'react-countdown';
import RepoForm from './RepoForm';
import Header from './Header';
import Repo from './Repo';
import { SimpleGrid, Button, ChakraProvider } from '@chakra-ui/react';

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

  const countdownRenderer = ({ seconds }) => {
    return (
      <p>Auto updating in {seconds} seconds</p>
    )
  }

  const repoComponents = repos.sort((r) => r.id).map((r) => {
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
        <RepoForm updateRepos={setRepos} resetTimer={setTimeIndex} />
        <br />
        <Countdown
          date={Date.now() + (1000 * 60 * 60 * 60)}
          key={currentTimeIndex}
          onComplete={refreshRepos}
          renderer={countdownRenderer} />
        <SimpleGrid
          bg='gray.50'
          minChildWidth='300px'
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
