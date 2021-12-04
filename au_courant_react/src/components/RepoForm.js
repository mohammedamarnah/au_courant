import { useState } from 'react';

import { AddIcon, RepeatIcon } from '@chakra-ui/icons';
import { Button, Input, Stack, Text, Box } from '@chakra-ui/react'

import { cleanJSON } from '../Helpers';

function RepoForm({ updateRepos, resetTimer }) {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [repoURL, setRepoURL] = useState("");

  const addRepo = (event) => {
    event.preventDefault();
    try {
      let formattedURL = repoURL.replace(/\s+/g, ' ').trim();
      if (formattedURL.at(-1) === '/') {
        formattedURL = formattedURL.substr(0, formattedURL.length - 1);
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

  const refreshRepos = (event) => {
    event.preventDefault();
    fetch(`http://localhost:4432/refresh-repos`, { method: 'PUT' })
    .then(response => response.text())
    .then(data => {
      updateRepos(JSON.parse(cleanJSON(data)).repositories);
      resetTimer(Date.now());
    })
  }

  return (
    <form className="RepoMainForm" onSubmit={addRepo}>
      <Box display='flex' justifyContent='center'>
        <Stack>
          <Input
            placeholder="Repository URL"
            variant='filled'
            value={repoURL}
            onChange={e => setRepoURL(e.target.value)} />
          <Text>OR</Text>
          <Input
            placeholder="Owner"
            variant='filled'
            value={owner}
            onChange={e => setOwner(e.target.value)} />
          <Input
            placeholder="Repository Name"
            variant='filled'
            value={repo}
            onChange={e => setRepo(e.target.value)} />
          <Button type="submit" backgroundColor='#2da44e'>
            <AddIcon color='white' />
            <Text margin='3' color='white'>Add</Text>
          </Button>
          <Button onClick={refreshRepos}>
            <RepeatIcon />
            <Text margin='3'>Refresh</Text>
          </Button>
        </Stack>
      </Box>
    </form>
  );
}

export default RepoForm;
