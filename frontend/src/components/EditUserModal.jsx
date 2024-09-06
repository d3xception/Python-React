import { BiEditAlt } from 'react-icons/bi'
import { Button, Flex, FormControl, FormLabel, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Textarea, useDisclosure, useToast } from '@chakra-ui/react'
import { BASE_URL } from '../App';
import { useState } from 'react';

const EditUserModal= ({user, setUsers}) =>{
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({
    name:user.name,
    role:user.role,
    description:user.description
  });
  const handleEditUser = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      const res = await fetch(BASE_URL + "/friends/"+ user.id, {
        method: "PATCH",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      if (!res.ok) {
          throw new Error(data.error)
      }
      setUsers((prevUsers) => prevUsers.map((u) => u.id === user.id ? data : u))
      toast({
          status: "success",
          title: "success",
          description: "Friend updated successfully.",
          duration: 2000,
          position: "top-center"
        }); 
        onClose();
    } catch (error) {
      toast({
          status: "error",
          title: "An error occured.",
          description: error.message,
          duration: 4000,
          isClosable: true,
          position: "top-center"
      });
    } finally{
      setIsLoading(false)
    }
  }
  return (<>
    <IconButton
 				onClick={onOpen}
 				variant='ghost'
 				colorScheme='blue'
 				aria-label='See menu'
 				size={"sm"}
 				icon={<BiEditAlt size={20} />}
 		/>
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <form onSubmit={handleEditUser}>
      <ModalContent>
        <ModalHeader>Edit Friend</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Flex alignItems={"center"} gap={4}>
            {/* Left */}
            <FormControl>
              <FormLabel>Full Name</FormLabel>
              <Input value={inputs.name} 
                onChange={(e) => setInputs({...inputs, name: e.target.value})}/>
            </FormControl>
            {/* Right */}
            <FormControl>
              <FormLabel>Role</FormLabel>
              <Input value={inputs.role} 
                onChange={(e) => setInputs({...inputs, role: e.target.value})}/>
            </FormControl>
          </Flex>
          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Textarea resize={"none"} overflowY={"hidden"} 
              value={inputs.description} 
              onChange={(e) => setInputs({...inputs, description: e.target.value})}/>
          </FormControl>
          <RadioGroup defaultValue='male' mt={4} isDisabled={true} >
            <Flex gap={5}>
              <Radio value='male'
                onChange={(e) => setInputs({...inputs, gender: e.target.value})}>Male</Radio>
              <Radio value='female'
                onChange={(e) => setInputs({...inputs, gender: e.target.value})}>Female</Radio>
            </Flex>
          </RadioGroup>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} type='submit' setIsLoading={isLoading} >
            Save
          </Button>
          <Button colorScheme='red' onClick={onClose}>cancel</Button>
        </ModalFooter>
      </ModalContent>
      </form>
    </Modal>
  </>
  )
}

export default EditUserModal
