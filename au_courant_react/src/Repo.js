import { cleanJSON } from './Helpers';
import './Repo.css';

function Repo({ repo, updateRepos, resetTimer }) {

  const removeRepo = (repoName, event) => {
    event.preventDefault();
    fetch(`http://localhost:4432/repos/${repoName}/delete`, { method: "DELETE" })
    .then(response => response.text())
    .then(data => { 
      updateRepos(JSON.parse(cleanJSON(data)).repositories);
      resetTimer(Date.now);
    })
    .catch(error => console.log(error));
  }

  const refreshRepo = (repoName, event) => {
    event.preventDefault();
    fetch(`http://localhost:4432/repos/${repoName}/update`, { method: "PUT" })
    .then(response => response.text())
    .then(data => {
      let parsedResponse = JSON.parse(cleanJSON(data));
      if (parsedResponse.status !== 304) {
        updateRepos(parsedResponse.repositories);
        resetTimer(Date.now());
      }
    })
    .catch(error => console.log(error));
  }

  const markSeen = (repo, event) => {
    if (repo.seen_state) return;
    event.preventDefault();
    fetch(`http://localhost:4432/mark-seen/${repo.repo_name}`, { method: "PUT" })
    .then(response => response.text())
    .then(data => {
      updateRepos(JSON.parse(cleanJSON(data)).repositories);
      resetTimer(Date.now);
    })
    .catch(error => console.log(error));
  }

  const color = repo.seen_state ? "green" : "red";

  return (
    <div className="Repo" itemID="">
      <h1>{repo.repo_name}</h1>
      <h3>Release: {repo.name}</h3>
      <h4>Tag: {repo.tag_name}</h4>
      <p>{repo.body}</p>
      <p>{repo.published_at}</p>
      <button onClick={(event) => removeRepo(repo.repo_name, event)}>
        Remove
      </button>
      <button onClick={(event) => refreshRepo(repo.repo_name, event)}>
        Refresh
      </button>
      <button onClick={(event) => markSeen(repo, event)}>
        Mark Seen
      </button>
      <div style={{backgroundColor:`${color}`}}>
        {repo.seen_state ? "seen" : "new!"}
      </div>
      <br/>
    </div>
  );
}

export default Repo;

