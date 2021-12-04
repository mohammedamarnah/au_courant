import {
  Text,
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/hooks';
import { CloseIcon, RepeatIcon } from '@chakra-ui/icons'

import { cleanJSON } from '../Helpers';

import DetailedRepo from './DetailedRepo';



function Repo({ repo, updateRepos, resetTimer }) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const removeRepo = (repoName, event) => {
    event.stopPropagation();
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
    event.stopPropagation();
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

  const color = repo.seen_state ? "white" : "red";
  const text = repo.seen_state ? "" : "new!";

  return (
    <>
      <Box as='button' boxShadow='dark-lg' p='4' rounded='md' bg='white' onClick={onOpen}>
        <Box backgroundColor={color} display='flex' justifyContent='center' maxWidth='50px' rounded='lg'>
          <Text color='white'>{text}</Text>
        </Box>

        <Text fontSize='xl' color='tomato' p='3'>{repo.repo_name}</Text>
        <Text fontSize='lg'>Release: {repo.name}</Text>
        <Text fontSize='md'>Tag: {repo.tag_name}</Text>
        <Text>{repo.published_at}</Text>

        <Box minHeight='30px' />

        <Box display='flex' justifyContent='space-evenly'>
          <Button color='tomato' onClick={(event) => removeRepo(repo.repo_name, event)}>
            <CloseIcon />
          </Button>
          <Button onClick={(event) => refreshRepo(repo.repo_name, event)}>
            <RepeatIcon />
          </Button>
        </Box>
      </Box>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader />
          <ModalCloseButton />
          <ModalBody>
            <DetailedRepo repoItem={repo} updateReposFn={updateRepos} resetTimerFn={resetTimer} />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Repo;