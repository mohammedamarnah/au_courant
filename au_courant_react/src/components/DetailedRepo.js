import { Text, Link } from '@chakra-ui/react'
import { cleanJSON } from '../Helpers'

function DetailedRepo({ repoItem, updateReposFn, resetTimerFn, }) {
  if (!repoItem.seen_state) {
    fetch(`http://localhost:4432/mark-seen/${repoItem.repo_name}`, { method: "PUT" })
      .then(response => response.text())
      .then(data => {
        updateReposFn(JSON.parse(cleanJSON(data)).repositories);
        resetTimerFn(Date.now);
      })
      .catch(error => console.log(error));
  }

  const repoLink = `https://github.com/${repoItem.owner}/${repoItem.repo_name}`;
  const repoReleaseLink = `${repoLink}/releases/tag/${repoItem.tag_name}`;

  return (
    <>
      <Link href={repoLink} isExternal>
        <Text fontSize='xl' color='tomato'>{repoItem.repo_name}</Text>
        <Text color='gray.500' fontSize='lg'>by {repoItem.owner}</Text>
      </Link>
      <Text fontSize='lg'>Release:
        <Link href={repoReleaseLink} isExternal>
          {` ${repoItem.name}`}
        </Link>
      </Text>
      <Text fontSize='md'>Tag: {repoItem.tag_name}</Text>
      <Text>Published at: {repoItem.published_at}</Text>
      <Text>Release notes:</Text>
      <Text color='black' p='3'>{repoItem.body}</Text>
    </>
  )
}

export default DetailedRepo;