import './Repo.css';
import { useState } from 'react';
import { cleanJSON } from './Helpers';

function RepoForm({ updateRepos, resetTimer }) {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [repoURL, setRepoURL] = useState("");

  const addRepo = (event) => {
    event.preventDefault();
    try {
      let formattedURL = repoURL.replace(/\s+/g, ' ').trim();
      if (formattedURL.at(-1) === '/') {
        formattedURL = formattedURL.substr(0, formattedURL.length-1);
      }

      let splittedURL = formattedURL.split("/");
      let owner_ = splittedURL.at(-2);
      let repo_ = splittedURL.at(-1);

      if (!owner_ || !repo_) {
        owner_ = owner;
        repo_ = repo;
      }

      if (owner_ && repo_) {
        fetch(`http://localhost:4432/add-repo?owner=${owner_}&repo_name=${repo_}`, { method: "POST" })
        .then(response => response.text())
        .then(data => {
          updateRepos(JSON.parse(cleanJSON(data)).repositories);
          setRepoURL("");
          setOwner("");
          setRepo("");
          resetTimer(Date.now());
        })
        .catch(requestError => console.log(requestError));
      } else {
        throw new Error("Parameters can't be empty, please fill either the URL or the owner and the repository name.")
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form className="RepoMainForm" onSubmit={addRepo}>

      <div className="RepoURLForm">
        <label>Repository URL: </label>
        <input
          type="text"
          value={repoURL}
          onChange={e => setRepoURL(e.target.value)} />
      </div>

      <p>OR</p>

      <div className="InfoForm">
        <label>Owner: </label>
        <input
          type="text"
          value={owner}
          onChange={e => setOwner(e.target.value)} />
        <label>Repository Name: </label>
        <input
          type="text"
          value={repo}
          onChange={e => setRepo(e.target.value)} />
      </div>

      <input type="submit" value="Add Repository" />
    </form>
  );
}

export default RepoForm;
