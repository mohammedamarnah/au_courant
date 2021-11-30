import { Text, Box } from '@chakra-ui/react'

const Header = () => {
  return (
    <Box background='#41b55a' margin='7'>
      <Text color='white' fontSize='4xl'>Au Courant</Text>
      <Text padding='3' color='white' fontSize='xl'>
        adjective; aware of what is going on; well informed.
      </Text>
    </Box>
  );
};

export default Header;