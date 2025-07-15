'use client';
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FiCamera } from 'react-icons/fi';
import { useState } from 'react';
import Sidebar from '@/components/common/SideBar';

const ProfilePage = () => {
  const [form, setForm] = useState({
    name: 'Exemplo exemplo exemplo',
    email: 'exemplo@gmail.com',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <Flex minH="100vh" bg="#f8f8f8">
      <Sidebar />

      <Box flex="1" display="flex" justifyContent="center" alignItems="center" p={8}>
        <Box bg="white" borderRadius="md" w="full" maxW="500px" p={8}>
          <VStack spacing={6} w="100%" align="center">
            <Heading as="h1" fontSize="2xl" color="#002450">
              Meu perfil
            </Heading>

            <Box position="relative">
              <Avatar
                size="2xl"
                name="Foto"
                src="https://via.placeholder.com/120x120.png?text=Foto"
                border="3px solid #0057b8"
              />
              <IconButton
                icon={<FiCamera />}
                size="sm"
                position="absolute"
                bottom="0"
                right="0"
                aria-label="Alterar foto"
                borderRadius="full"
                bg="white"
                shadow="md"
                as="label"
                htmlFor="file-upload"
              />
              <Input id="file-upload" type="file" display="none" />
            </Box>

            <Box w="100%">
              <FormLabel fontSize="sm" color="#0057b8">
                Nome completo
              </FormLabel>
              <Input
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                borderColor="#0057b8"
                focusBorderColor="#0057b8"
              />
            </Box>

            <Box w="100%">
              <FormLabel fontSize="sm" color="#0057b8">
                E-mail
              </FormLabel>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                borderColor="#0057b8"
                focusBorderColor="#0057b8"
              />
            </Box>

            <HStack w="100%" spacing={4}>
              <Box flex="1">
                <FormLabel fontSize="sm" color="#0057b8">
                  Senha
                </FormLabel>
                <Input
                  type="password"
                  placeholder="Insira sua nova senha"
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  borderColor="#0057b8"
                  focusBorderColor="#0057b8"
                />
              </Box>
              <Box flex="1">
                <FormLabel fontSize="sm" color="#0057b8">
                  Confirmar senha
                </FormLabel>
                <Input
                  type="password"
                  placeholder="Insira sua nova senha"
                  value={form.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  borderColor="#0057b8"
                  focusBorderColor="#0057b8"
                />
              </Box>
            </HStack>

            <Button w="100%" bg="#0057b8" color="white" _hover={{ bg: '#00489e' }}>
              Salvar alterações
            </Button>

            <Button variant="link" color="#ec5c52" fontSize="sm">
              Excluir dados da conta
            </Button>
          </VStack>
        </Box>
      </Box>
    </Flex>
  );
};

export default ProfilePage;
