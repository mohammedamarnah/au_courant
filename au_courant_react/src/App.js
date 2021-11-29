import './App.css';

import { useState, useEffect } from 'react';
import { cleanJSON } from './Helpers';

import Countdown from 'react-countdown';
import RepoForm from './RepoForm';
import Header from './Header';
import Repo from './Repo';

function App() {
  const [repos, setRepos] = useState([]);
  const [currentTimeIndex, setTimeIndex] = useState(0);

  useEffect(() => {
    fetch("http://localhost:4432/repos")
      .then(response => response.text())
      .then(data => setRepos(JSON.parse(cleanJSON(data)).repositories))
      .catch(error => console.log(error));
  }, []);

  const refreshRepos = (repos) => {
    if (!repos.length) return;
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
    <div className="App">
      <Header />
      <RepoForm updateRepos={setRepos} resetTimer={setTimeIndex} />
      <Countdown
        date={Date.now() + (1000 * 60)}
        key={currentTimeIndex}
        onComplete={refreshRepos(repos)}
        renderer={countdownRenderer} />
      {repoComponents}
    </div>
  );
}

export default App;
