import { cleanJSON } from './Helpers';
import './Repo.css';
import { Text, Box, Button } from '@chakra-ui/react'
import { CloseIcon, RepeatIcon, ViewIcon } from '@chakra-ui/icons'

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
    <Box boxShadow='dark-lg' p='6' rounded='md' bg='white'>
      <Box backgroundColor={color} width='25px' height='25px' />
      <Text fontSize='xl' color='tomato'>{repo.repo_name}</Text>
      <Text fontSize='lg'>Release: {repo.name}</Text>
      <Text fontSize='md'>Tag: {repo.tag_name}</Text>
      <Text>{repo.published_at}</Text>
      <Text color='black' minHeight='100px' minWidth='100px' p='6'>{repo.body}</Text>
      <Box display='flex' justifyItems='baseline' justifyContent='space-between'>
        <Button color='tomato' onClick={(event) => removeRepo(repo.repo_name, event)}>
          <CloseIcon />
        </Button>
        <Button onClick={(event) => refreshRepo(repo.repo_name, event)}>
          <RepeatIcon />
        </Button>
        <Button onClick={(event) => markSeen(repo, event)}>
          <ViewIcon />
        </Button>
      </Box>
    </Box>
  );
}

export default Repo;