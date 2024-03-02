import { Box, Image } from '@chakra-ui/react';

import BeFitlogo from  './assets/BeFitlogo.png';
import React from 'react';
const Header: React.FC = () => {
  return (
    <Box bg="black" py={4} textAlign="center">
      <Image src={BeFitlogo} alt="Logo" mx="auto" height={"30px"} />
    </Box>
  );
};

export default Header;
