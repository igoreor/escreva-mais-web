import { Box, Heading, Text } from '@chakra-ui/react'

export default function HomePage() {
  return (
    <Box 
      minH="100vh" 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center"
      p={8}
    >
      <Heading as="h1" size="2xl" mb={4} textAlign="center">
        Bem-vindo ao Escreva +
      </Heading>
      <Text fontSize="lg" mb={8} textAlign="center" maxW="md">
        Sua plataforma de escrita e aprendizado
      </Text>
      <Text fontSize="md" color="gray.500" textAlign="center">
        Arquitetura do projeto configurada e pronta para desenvolvimento
      </Text>
    </Box>
  )
} 